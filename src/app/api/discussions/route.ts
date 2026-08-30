import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { moderateContentWithFallback } from "@/utils/moderation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const university = searchParams.get("university");
    const branch = searchParams.get("branch");
    const semester = searchParams.get("semester");
    const tag = searchParams.get("tag");
    const status = searchParams.get("status"); // 'unanswered', 'solved', 'trending'
    const search = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 20); // Strict limit max 20

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Build base query with exact total count
    let query = supabase
      .from("discussions")
      .select("id, user_id, note_id, university, branch, semester, title, content, tags, upvotes_count, replies_count, is_resolved, created_at, updated_at", { count: "exact" });

    if (university && university !== "All Universities") {
      query = query.eq("university", university);
    }

    if (branch && branch !== "All branches") {
      const branchAliases: Record<string, string[]> = {
        "Information Technology (IT)": ["Information Technology (IT)", "Information Technology", "IT"],
        "Information Technology": ["Information Technology (IT)", "Information Technology", "IT"],
        "Artificial Intelligence & Machine Learning (AIML)": ["Artificial Intelligence & Machine Learning (AIML)", "AIML"],
        "AIML": ["Artificial Intelligence & Machine Learning (AIML)", "AIML"],
        "Computer Science & Engineering (CSE)": ["Computer Science & Engineering (CSE)", "CSE"],
        "Electronics & Telecommunication (EXTC)": ["Electronics & Telecommunication (EXTC)", "EXTC"],
      };
      const matchBranches = branchAliases[branch] || [branch];
      if (matchBranches.length === 1) {
        query = query.eq("branch", matchBranches[0]);
      } else {
        query = query.in("branch", matchBranches);
      }
    }

    if (semester && semester !== "All semesters") {
      query = query.eq("semester", semester);
    }

    if (tag && tag.trim() !== "") {
      query = query.contains("tags", [tag.trim()]);
    }

    if (status === "unanswered") {
      query = query.eq("replies_count", 0);
    } else if (status === "solved") {
      query = query.eq("is_resolved", true);
    }

    if (search && search.trim() !== "") {
      const sanitizedSearch = search.trim().replace(/[%_]/g, "\\$&");
      query = query.or(`title.ilike.%${sanitizedSearch}%,content.ilike.%${sanitizedSearch}%`);
    }

    // Sort order
    if (status === "trending") {
      query = query.order("upvotes_count", { ascending: false }).order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    // Pagination bounds
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: rawDiscussions, count, error } = await query.range(from, to);

    if (error) {
      console.error("Error fetching discussions:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const discussions = rawDiscussions || [];

    // 2. Fetch author profiles & linked notes in bulk
    const userIds = Array.from(new Set(discussions.map((d) => d.user_id)));
    const noteIds = Array.from(new Set(discussions.map((d) => d.note_id).filter(Boolean)));

    const userMap: Record<string, { username: string | null; full_name?: string | null; badge_tier?: string | null }> = {};
    const noteMap: Record<string, { id: string; title: string; branch: string; semester: string }> = {};
    const userVotedSet = new Set<string>();

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("users")
        .select("id, username, full_name, badge_tier")
        .in("id", userIds);

      if (profiles) {
        profiles.forEach((p) => {
          userMap[p.id] = { username: p.username, full_name: p.full_name, badge_tier: p.badge_tier };
        });
      }
    }

    if (noteIds.length > 0) {
      const { data: notesData } = await supabase
        .from("notes")
        .select("id, title, branch, semester")
        .in("id", noteIds as string[]);

      if (notesData) {
        notesData.forEach((n) => {
          noteMap[n.id] = { id: n.id, title: n.title, branch: n.branch, semester: n.semester };
        });
      }
    }

    if (user && discussions.length > 0) {
      const discussionIds = discussions.map((d) => d.id);
      const { data: votes } = await supabase
        .from("discussion_votes")
        .select("discussion_id")
        .eq("user_id", user.id)
        .in("discussion_id", discussionIds);

      if (votes) {
        votes.forEach((v) => {
          if (v.discussion_id) userVotedSet.add(v.discussion_id);
        });
      }
    }

    // 3. Assemble enriched discussion payloads
    const enrichedDiscussions = discussions.map((d) => ({
      ...d,
      author: {
        id: d.user_id,
        username: userMap[d.user_id]?.username || "Anonymous",
        full_name: userMap[d.user_id]?.full_name,
        badge_tier: userMap[d.user_id]?.badge_tier || "contributor",
      },
      linked_note: d.note_id ? noteMap[d.note_id] || null : null,
      has_user_voted: userVotedSet.has(d.id),
    }));

    return NextResponse.json(
      {
        discussions: enrichedDiscussions,
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("Discussions GET exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to ask a doubt." }, { status: 401 });
    }

    const { data: userProfile } = await supabase
      .from("users")
      .select("status")
      .eq("id", user.id)
      .maybeSingle();

    if (userProfile?.status === "suspended" || userProfile?.status === "banned") {
      return NextResponse.json(
        { error: "Your account is currently suspended from creating new discussion posts." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, university, branch, semester, tags, note_id } = body;

    if (!title || !title.trim() || !content || !content.trim() || !university || !branch || !semester) {
      return NextResponse.json({ error: "Title, content, university, branch, and semester are required." }, { status: 400 });
    }

    const formattedTags = Array.isArray(tags)
      ? tags.map((t: string) => t.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")).filter(Boolean).slice(0, 5)
      : [];

    // Multilingual Content Moderation Check (Title + Content + Tags)
    const combinedText = `Title: ${title.trim()}\nContent: ${content.trim()}${
      formattedTags.length > 0 ? `\nTags: ${formattedTags.join(", ")}` : ""
    }`;
    const moderation = await moderateContentWithFallback(combinedText);

    if (!moderation.isAllowed) {
      return NextResponse.json(
        { error: `Post rejected: ${moderation.reason || "Content violates community standards."}` },
        { status: 400 }
      );
    }

    const { data: newDiscussion, error: insertError } = await supabase
      .from("discussions")
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        university,
        branch,
        semester,
        tags: formattedTags,
        note_id: note_id || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating discussion:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, discussion: newDiscussion }, { status: 201 });
  } catch (err) {
    console.error("Discussions POST exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
