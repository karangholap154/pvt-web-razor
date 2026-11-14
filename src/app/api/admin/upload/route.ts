import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/authHelpers";
import { isValidPdfBuffer, generateSafePdfFileName } from "@/utils/fileValidation";

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();
    if (auth.errorResponse) return auth.errorResponse;
    const { supabase } = auth;

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

    // Validate PDF magic bytes
    if (!isValidPdfBuffer(buffer)) {
      return NextResponse.json(
        { error: "Invalid PDF file header. Uploaded file is not a valid PDF document." },
        { status: 400 }
      );
    }

    // Generate unique slugified filename
    const filePath = generateSafePdfFileName(file.name, "pdfs");

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
