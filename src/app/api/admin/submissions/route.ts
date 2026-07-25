import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { checkIsAdmin } from "@/utils/auth";

export async function GET(request: Request) {
  try {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user || !user.email || !checkIsAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    let query = supabaseAdmin
      .from("note_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data: submissions, error } = await query;

    if (error) {
      console.error("Failed to fetch submissions for admin:", error);
      return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
    }

    // Fetch user details for each submission to display contributor username/email
    const userIds = Array.from(new Set(submissions.map((s) => s.user_id)));
    const userProfilesMap: Record<string, { username?: string | null; email?: string | null; full_name?: string | null }> = {};

    if (userIds.length > 0) {
      const { data: userProfiles } = await supabaseAdmin
        .from("users")
        .select("id, username, email, full_name")
        .in("id", userIds);

      if (userProfiles) {
        userProfiles.forEach((u) => {
          userProfilesMap[u.id] = { username: u.username, email: u.email, full_name: u.full_name };
        });
      }
    }

    const enrichedSubmissions = submissions.map((sub) => ({
      ...sub,
      user_profile: userProfilesMap[sub.user_id] || { username: "Unknown", email: "" },
    }));

    return NextResponse.json({ submissions: enrichedSubmissions });
  } catch (error) {
    console.error("GET /api/admin/submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function deleteStorageFileByUrl(fileUrl: string) {
  if (!fileUrl) return;
  const match = fileUrl.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
  if (match) {
    const bucket = match[1];
    const path = match[2];
    try {
      const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
      if (error) {
        console.warn(`Failed to remove file ${path} from bucket ${bucket}:`, error.message);
      }
    } catch (err) {
      console.error("Error removing file from storage:", err);
    }
  }
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function POST(request: Request) {
  try {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user || !user.email || !checkIsAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { submissionId, action, finalPrice, adminFeedback } = body;

    if (!submissionId || !action || !["approve", "reject", "delete"].includes(action)) {
      return NextResponse.json({ error: "Invalid submission parameters" }, { status: 400 });
    }

    // Fetch existing submission record
    const { data: submission, error: subError } = await supabaseAdmin
      .from("note_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (subError || !submission) {
      return NextResponse.json({ error: "Submission record not found" }, { status: 404 });
    }

    if (action === "delete") {
      // 1. Delete submission file from storage bucket
      if (submission.file_url) {
        await deleteStorageFileByUrl(submission.file_url);
      }

      // 2. Check if a live note was created from this submission and delete it + its storage file
      const { data: publishedNotes } = await supabaseAdmin
        .from("notes")
        .select("id, download_url")
        .eq("contributor_id", submission.user_id)
        .eq("title", submission.title);

      if (publishedNotes && publishedNotes.length > 0) {
        for (const note of publishedNotes) {
          if (note.download_url && note.download_url !== submission.file_url) {
            await deleteStorageFileByUrl(note.download_url);
          }
          await supabaseAdmin.from("notes").delete().eq("id", note.id);
        }
      }

      // 3. Delete the note submission record
      const { error: deleteSubError } = await supabaseAdmin
        .from("note_submissions")
        .delete()
        .eq("id", submissionId);

      if (deleteSubError) {
        console.error("Failed to delete submission record:", deleteSubError);
        return NextResponse.json({ error: "Failed to delete submission record" }, { status: 500 });
      }

      // 4. Update student's approved_notes_count if submission was approved
      if (submission.status === "approved") {
        const { data: userProfile } = await supabaseAdmin
          .from("users")
          .select("approved_notes_count")
          .eq("id", submission.user_id)
          .maybeSingle();

        const currentApprovedCount = Math.max(0, (userProfile?.approved_notes_count || 1) - 1);
        await supabaseAdmin
          .from("users")
          .update({ approved_notes_count: currentApprovedCount })
          .eq("id", submission.user_id);
      }

      return NextResponse.json({ success: true, message: "Submission and associated files deleted permanently!" });
    }

    if (action === "reject") {
      // 1. REJECT ACTION: Remove pending file from storage and update submission status
      if (submission.file_url) {
        const match = submission.file_url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
        if (match) {
          await supabaseAdmin.storage.from(match[1]).remove([match[2]]);
        }
      }

      const { error: updateError } = await supabaseAdmin
        .from("note_submissions")
        .update({
          status: "rejected",
          admin_feedback: adminFeedback || "Submission did not meet quality guidelines.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      if (updateError) {
        console.error("Failed to reject submission:", updateError);
        return NextResponse.json({ error: "Failed to update submission status" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Submission marked as rejected and pending file removed from storage" });
    }

    // 2. APPROVE ACTION: Move file from pending/ to notes-bucket/pdfs/ and publish to catalog
    const approvedPrice = Math.min(99, Math.max(0, Number(finalPrice ?? submission.suggested_price) || 0));
    let liveFileUrl = submission.file_url;

    if (submission.file_url) {
      const match = submission.file_url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
      if (match) {
        const sourceBucket = match[1];
        const sourcePath = match[2];
        const fileNameOnly = sourcePath.split("/").pop() || "note.pdf";
        const newPath = `pdfs/contrib_${Date.now()}_${fileNameOnly}`;

        const { data: fileData, error: downloadError } = await supabaseAdmin.storage
          .from(sourceBucket)
          .download(sourcePath);

        if (fileData && !downloadError) {
          const buffer = Buffer.from(await fileData.arrayBuffer());
          const { error: uploadError } = await supabaseAdmin.storage
            .from("notes-bucket")
            .upload(newPath, buffer, {
              contentType: "application/pdf",
              upsert: true,
            });

          if (!uploadError) {
            // Delete original pending file from storage
            await supabaseAdmin.storage.from(sourceBucket).remove([sourcePath]);

            // Get new public URL for live note in notes-bucket/pdfs/
            const { data: urlData } = supabaseAdmin.storage
              .from("notes-bucket")
              .getPublicUrl(newPath);
            if (urlData?.publicUrl) {
              liveFileUrl = urlData.publicUrl;
            }
          }
        }
      }
    }

    // Update submission status to approved
    const { error: updateSubError } = await supabaseAdmin
      .from("note_submissions")
      .update({
        status: "approved",
        admin_feedback: adminFeedback || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    if (updateSubError) {
      console.error("Failed to approve submission:", updateSubError);
      return NextResponse.json({ error: "Failed to update submission status" }, { status: 500 });
    }

    // Insert live note record into notes table with clean human-readable slug ID
    const titleSlug = slugify(submission.title) || "study-note";
    const randSuffix = Math.random().toString(36).substring(2, 6);
    const noteId = `${titleSlug}-${randSuffix}`;
    const { data: publishedNote, error: noteInsertError } = await supabaseAdmin
      .from("notes")
      .insert({
        id: noteId,
        title: submission.title,
        university: submission.university,
        branch: submission.branch,
        semester: submission.semester,
        download_url: liveFileUrl,
        price: approvedPrice,
        contributor_id: submission.user_id,
        is_community_contributed: true,
        platform_commission_rate: 0.20,
      })
      .select()
      .single();

    if (noteInsertError) {
      console.error("Failed to insert live note record:", noteInsertError);
      return NextResponse.json({ error: "Failed to publish note to live catalog" }, { status: 500 });
    }

    // Update student's approved_notes_count & recalculate badge_tier
    const { data: userProfile } = await supabaseAdmin
      .from("users")
      .select("approved_notes_count, total_downloads_count, badge_tier")
      .eq("id", submission.user_id)
      .maybeSingle();

    const currentApprovedCount = (userProfile?.approved_notes_count || 0) + 1;
    const currentDownloadsCount = userProfile?.total_downloads_count || 0;

    let newBadgeTier = "contributor";
    if (currentApprovedCount >= 10 || currentDownloadsCount >= 100) {
      newBadgeTier = "legend";
    } else if (currentApprovedCount >= 5 && currentDownloadsCount >= 50) {
      newBadgeTier = "top_author";
    } else if (currentApprovedCount >= 3 || currentDownloadsCount >= 25) {
      newBadgeTier = "rising";
    } else {
      newBadgeTier = "contributor";
    }

    await supabaseAdmin
      .from("users")
      .update({
        approved_notes_count: currentApprovedCount,
        badge_tier: newBadgeTier,
      })
      .eq("id", submission.user_id);

    return NextResponse.json({
      success: true,
      message: "Study note approved and published to live catalog!",
      note: publishedNote,
    });
  } catch (error) {
    console.error("POST /api/admin/submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
