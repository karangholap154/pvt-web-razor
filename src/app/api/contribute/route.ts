import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string || "").trim();
    const university = (formData.get("university") as string || "").trim();
    const branch = (formData.get("branch") as string || "").trim();
    const semester = (formData.get("semester") as string || "").trim();
    const rawPrice = Number(formData.get("suggestedPrice")) || 0;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!title || !university || !branch || !semester) {
      return NextResponse.json({ error: "Missing required metadata fields" }, { status: 400 });
    }

    // 1. Enforce PDF extension & MIME type
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // 2. Enforce 5 MB size limit
    const MAX_SIZE_MB = 5;
    const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds maximum limit of 5 MB` },
        { status: 400 }
      );
    }

    // 3. Enforce Price Cap (0 to 99)
    const price = Math.min(99, Math.max(0, rawPrice));

    // Upload to Supabase Storage: Use submissions-bucket (or notes-bucket fallback)
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `pending/${user.id}/${timestamp}_${sanitizedFilename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let bucketName = "submissions-bucket";
    let uploadResult = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadResult.error) {
      console.warn("submissions-bucket error, trying notes-bucket fallback:", uploadResult.error);
      bucketName = "notes-bucket";
      uploadResult = await supabaseAdmin.storage
        .from(bucketName)
        .upload(filePath, buffer, {
          contentType: "application/pdf",
          upsert: true,
        });
    }

    if (uploadResult.error) {
      console.error("Storage upload failed:", uploadResult.error);
      return NextResponse.json({ error: "Failed to store PDF file on server" }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filePath);
    const fileUrl = publicUrlData?.publicUrl || filePath;

    // Insert into note_submissions table
    const { data: submission, error: dbError } = await supabaseAdmin
      .from("note_submissions")
      .insert({
        user_id: user.id,
        title,
        university,
        branch,
        semester,
        suggested_price: price,
        file_url: fileUrl,
        status: "pending",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Failed to insert note submission record:", dbError);
      return NextResponse.json({ error: "Failed to record submission in database" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Study note submitted successfully for admin approval",
      submission,
    });
  } catch (error) {
    console.error("POST /api/contribute error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { data: submissions, error } = await supabaseAdmin
      .from("note_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch user note submissions:", error);
      return NextResponse.json({ submissions: [] });
    }

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("GET /api/contribute error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get("id");

    if (!submissionId) {
      return NextResponse.json({ error: "Missing submission ID parameter" }, { status: 400 });
    }

    // Verify submission belongs to this user
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("note_submissions")
      .select("*")
      .eq("id", submissionId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json({ error: "Submission not found or access denied" }, { status: 404 });
    }

    // Delete submission file from storage
    if (submission.file_url) {
      const match = submission.file_url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
      if (match) {
        await supabaseAdmin.storage.from(match[1]).remove([match[2]]);
      }
    }

    // If submission was approved, delete published note from notes table
    if (submission.status === "approved") {
      const { data: publishedNotes } = await supabaseAdmin
        .from("notes")
        .select("id, download_url")
        .eq("contributor_id", user.id)
        .eq("title", submission.title);

      if (publishedNotes && publishedNotes.length > 0) {
        for (const note of publishedNotes) {
          if (note.download_url && note.download_url !== submission.file_url) {
            const match = note.download_url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
            if (match) {
              await supabaseAdmin.storage.from(match[1]).remove([match[2]]);
            }
          }
          await supabaseAdmin.from("notes").delete().eq("id", note.id);
        }
      }
    }

    // Delete note_submissions record
    const { error: deleteError } = await supabaseAdmin
      .from("note_submissions")
      .delete()
      .eq("id", submissionId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Failed to delete submission:", deleteError);
      return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Submission deleted permanently!" });
  } catch (error) {
    console.error("DELETE /api/contribute error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
