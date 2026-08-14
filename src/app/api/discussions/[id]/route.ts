import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { moderateContentWithFallback } from "@/utils/moderation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Discussion ID is required" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch single discussion with linked note
    const { data: discussion, error: discError } = await supabase
      .from("discussions")
      .select("*, notes(id, title, branch, semester, university)")
      .eq("id", id)
      .single();

    if (discError || !discussion) {
      return NextResponse.json({ error: "Discussion topic not found" }, { status: 404 });
    }

    // 2. Fetch discussion replies
    const { data: rawReplies, error: replyError } = await supabase
      .from("discussion_replies")
      .select("*")
      .eq("discussion_id", id)
      .order("is_accepted_answer", { ascending: false })
      .order("upvotes_count", { ascending: false })
      .order("created_at", { ascending: true });

    if (replyError) {
      console.error("Error fetching discussion replies:", replyError);
    }

    const replies = rawReplies || [];

    // 3. Batch fetch authors
    const allUserIds = Array.from(
      new Set([discussion.user_id, ...replies.map((r) => r.user_id)])
    );

    const userMap: Record<string, { username: string | null; full_name?: string | null; badge_tier?: string | null }> = {};
    const linkedNote = Array.isArray(discussion.notes) ? discussion.notes[0] : discussion.notes;
    const userVotedSet = new Set<string>();

    if (allUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from("users")
        .select("id, username, full_name, badge_tier")
        .in("id", allUserIds);

      if (profiles) {
        profiles.forEach((p) => {
          userMap[p.id] = { username: p.username, full_name: p.full_name, badge_tier: p.badge_tier };
        });
      }
    }

    // Check user vote status for post and replies
    if (user) {
      const replyIds = replies.map((r) => r.id);

      const { data: discVotes } = await supabase
        .from("discussion_votes")
        .select("discussion_id, reply_id")
        .eq("user_id", user.id)
        .or(`discussion_id.eq.${id}${replyIds.length > 0 ? `,reply_id.in.(${replyIds.join(",")})` : ""}`);

      if (discVotes) {
        discVotes.forEach((v) => {
          if (v.discussion_id) userVotedSet.add(`disc_${v.discussion_id}`);
          if (v.reply_id) userVotedSet.add(`reply_${v.reply_id}`);
        });
      }
    }

    const enrichedDiscussion = {
      ...discussion,
      author: {
        id: discussion.user_id,
        username: userMap[discussion.user_id]?.username || "Anonymous",
        full_name: userMap[discussion.user_id]?.full_name,
        badge_tier: userMap[discussion.user_id]?.badge_tier || "contributor",
      },
      linked_note: linkedNote,
      has_user_voted: userVotedSet.has(`disc_${discussion.id}`),
    };

    const enrichedReplies = replies.map((r) => ({
      ...r,
      author: {
        id: r.user_id,
        username: userMap[r.user_id]?.username || "Anonymous",
        full_name: userMap[r.user_id]?.full_name,
        badge_tier: userMap[r.user_id]?.badge_tier || "contributor",
      },
      has_user_voted: userVotedSet.has(`reply_${r.id}`),
    }));

    return NextResponse.json({
      discussion: enrichedDiscussion,
      replies: enrichedReplies,
      isOriginalPoster: user ? user.id === discussion.user_id : false,
    });
  } catch (err) {
    console.error("Discussion thread GET exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to reply." }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Reply content cannot be empty." }, { status: 400 });
    }

    // Multilingual Content Moderation Check (Gemini AI + Local Fallback)
    const moderation = await moderateContentWithFallback(content.trim());
    if (!moderation.isAllowed) {
      return NextResponse.json(
        { error: `Reply rejected: ${moderation.reason || "Content violates community standards."}` },
        { status: 400 }
      );
    }

    // 1. Verify discussion exists
    const { data: discussion, error: discError } = await supabase
      .from("discussions")
      .select("id, replies_count")
      .eq("id", id)
      .single();

    if (discError || !discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    // 2. Insert text reply
    const { data: newReply, error: replyInsertError } = await supabase
      .from("discussion_replies")
      .insert({
        discussion_id: id,
        user_id: user.id,
        content: content.trim(),
      })
      .select()
      .single();

    if (replyInsertError) {
      console.error("Error creating reply:", replyInsertError);
      return NextResponse.json({ error: replyInsertError.message }, { status: 500 });
    }

    // 3. Increment discussion replies_count atomically
    await supabase
      .from("discussions")
      .update({
        replies_count: (discussion.replies_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Fetch author profile
    const { data: profile } = await supabase
      .from("users")
      .select("username, full_name, badge_tier")
      .eq("id", user.id)
      .maybeSingle();

    const enrichedReply = {
      ...newReply,
      author: {
        id: user.id,
        username: profile?.username || "Anonymous",
        full_name: profile?.full_name,
        badge_tier: profile?.badge_tier || "contributor",
      },
      has_user_voted: false,
    };

    return NextResponse.json({ success: true, reply: enrichedReply }, { status: 201 });
  } catch (err) {
    console.error("Discussion POST reply exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Discussion ID is required" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const replyId = searchParams.get("replyId");

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (replyId) {
      // 1. Fetch reply & verify ownership
      const { data: reply, error: fetchError } = await supabaseAdmin
        .from("discussion_replies")
        .select("id, user_id")
        .eq("id", replyId)
        .eq("discussion_id", id)
        .maybeSingle();

      if (fetchError || !reply) {
        return NextResponse.json({ error: "Reply not found" }, { status: 404 });
      }

      if (reply.user_id !== user.id) {
        return NextResponse.json({ error: "You can only delete your own replies" }, { status: 403 });
      }

      // Perform deletion using supabaseAdmin
      const { error: deleteError } = await supabaseAdmin
        .from("discussion_replies")
        .delete()
        .eq("id", replyId)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Error deleting reply:", deleteError);
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      // Sync discussion replies_count
      const { data: remainingReplies } = await supabaseAdmin
        .from("discussion_replies")
        .select("id")
        .eq("discussion_id", id);

      const newCount = remainingReplies ? remainingReplies.length : 0;
      await supabaseAdmin
        .from("discussions")
        .update({
          replies_count: newCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      return NextResponse.json({ success: true, message: "Reply deleted successfully" });
    } else {
      // 2. Fetch discussion topic & verify ownership
      const { data: discussion, error: fetchError } = await supabaseAdmin
        .from("discussions")
        .select("id, user_id")
        .eq("id", id)
        .maybeSingle();

      if (fetchError || !discussion) {
        return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
      }

      if (discussion.user_id !== user.id) {
        return NextResponse.json({ error: "You can only delete your own doubts" }, { status: 403 });
      }

      const { error: deleteError } = await supabaseAdmin
        .from("discussions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Error deleting discussion:", deleteError);
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Doubt deleted successfully" });
    }
  } catch (err) {
    console.error("Discussion DELETE exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
