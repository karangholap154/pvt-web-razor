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
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await request.json();
    const { replyId } = body;

    if (!replyId) {
      return NextResponse.json({ error: "replyId is required" }, { status: 400 });
    }

    // 1. Fetch discussion and verify OP ownership
    const { data: discussion, error: discError } = await supabase
      .from("discussions")
      .select("id, user_id, is_resolved")
      .eq("id", id)
      .single();

    if (discError || !discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    if (discussion.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden. Only the original poster can mark an answer as Best Answer." },
        { status: 403 }
      );
    }

    // 2. Reset any previous accepted answer for this discussion
    await supabase
      .from("discussion_replies")
      .update({ is_accepted_answer: false })
      .eq("discussion_id", id);

    // 3. Mark the target reply as accepted answer
    const { error: updateReplyError } = await supabase
      .from("discussion_replies")
      .update({ is_accepted_answer: true })
      .eq("id", replyId)
      .eq("discussion_id", id);

    if (updateReplyError) {
      console.error("Error marking accepted answer:", updateReplyError);
      return NextResponse.json({ error: updateReplyError.message }, { status: 500 });
    }

    // 4. Mark discussion as resolved
    await supabase
      .from("discussions")
      .update({ is_resolved: true, updated_at: new Date().toISOString() })
      .eq("id", id);

    return NextResponse.json({ success: true, message: "Marked reply as Best Answer!" });
  } catch (err) {
    console.error("Mark solved API exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
