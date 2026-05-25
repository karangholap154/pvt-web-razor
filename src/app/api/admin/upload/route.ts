import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "../../../../utils/supabaseClient";
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
    // 1. Authorization check
    const authorized = await isAdmin();
    if (!authorized) {
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

    // Generate unique slugified filename
    const originalName = file.name.substring(0, file.name.lastIndexOf("."));
    const fileExt = "pdf";
    const timestamp = Math.floor(Date.now() / 1000);
    const rand = crypto.randomBytes(3).toString("hex");
    const uniqueName = `${slugify(originalName)}-${timestamp}-${rand}.${fileExt}`;
    const filePath = `pdfs/${uniqueName}`;

    // 4. Upload to Supabase Storage
    const { data, error } = await supabase.storage
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
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "Internal file upload processing error" },
      { status: 500 }
    );
  }
}
