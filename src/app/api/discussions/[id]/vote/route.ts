import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to upvote." }, { status: 401 });
    }

    // Safely parse JSON body if present
    let replyId: string | undefined = undefined;
    try {
      const rawText = await request.text();
      if (rawText && rawText.trim() !== "") {
        const parsed = JSON.parse(rawText);
        replyId = parsed.replyId;
      }
    } catch (parseErr) {
      console.warn("Vote request body parse fallback:", parseErr);
    }

    if (replyId) {
      // 1. Voting on a reply
      const { data: existingVote } = await supabase
        .from("discussion_votes")
        .select("id")
        .eq("user_id", user.id)
        .eq("reply_id", replyId)
        .maybeSingle();

      let isVoted = false;
      if (existingVote) {
        // Unvote
        await supabase.from("discussion_votes").delete().eq("id", existingVote.id);
        isVoted = false;
      } else {
        // Vote
        await supabase.from("discussion_votes").insert({ user_id: user.id, reply_id: replyId });
        isVoted = true;
      }

      // Read exact count updated atomically by Postgres trigger
      const { data: reply } = await supabase
        .from("discussion_replies")
        .select("upvotes_count")
        .eq("id", replyId)
        .single();

      return NextResponse.json({ success: true, voted: isVoted, upvotes_count: reply?.upvotes_count || 0 });
    } else {
      // 2. Voting on main discussion topic
      const { data: existingVote } = await supabase
        .from("discussion_votes")
        .select("id")
        .eq("user_id", user.id)
        .eq("discussion_id", id)
        .maybeSingle();

      let isVoted = false;
      if (existingVote) {
        // Unvote
        await supabase.from("discussion_votes").delete().eq("id", existingVote.id);
        isVoted = false;
      } else {
        // Vote
        await supabase.from("discussion_votes").insert({ user_id: user.id, discussion_id: id });
        isVoted = true;
      }

      // Read exact count updated atomically by Postgres trigger
      const { data: discussion } = await supabase
        .from("discussions")
        .select("upvotes_count")
        .eq("id", id)
        .single();

      return NextResponse.json({ success: true, voted: isVoted, upvotes_count: discussion?.upvotes_count || 0 });
    }
  } catch (err) {
    console.error("Vote API exception:", err);
    return NextResponse.json({ error: "Internal server error", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
