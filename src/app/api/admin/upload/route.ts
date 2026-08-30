import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";
import { isAdmin } from "../../../../utils/auth";

// Helper to slugify a name
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
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email || !(await isAdmin(user.email))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Ensure it's a PDF file
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // 3. Convert File to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate PDF magic bytes (%PDF- => 0x25 0x50 0x44 0x46)
    if (
      buffer.length < 4 ||
      buffer[0] !== 0x25 ||
      buffer[1] !== 0x50 ||
      buffer[2] !== 0x44 ||
      buffer[3] !== 0x46
    ) {
      return NextResponse.json(
        { error: "Invalid PDF file header. Uploaded file is not a valid PDF document." },
        { status: 400 }
      );
    }

    // Generate unique slugified filename
    const originalName = file.name.substring(0, file.name.lastIndexOf("."));
    const fileExt = "pdf";
    const timestamp = Math.floor(Date.now() / 1000);
    const rand = crypto.randomBytes(3).toString("hex");
    const uniqueName = `${slugify(originalName)}-${timestamp}-${rand}.${fileExt}`;
    const filePath = `pdfs/${uniqueName}`;

    // 4. Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("notes-bucket")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5. Get public URL
    const { data: urlData } = supabase.storage
      .from("notes-bucket")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      fileName: file.name,
    });
  } catch (error: unknown) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "Internal file upload processing error" },
      { status: 500 }
    );
  }
}
