import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../utils/supabaseServer";
import { supabaseAdmin } from "../../../utils/supabaseAdmin";
import { checkIsAdmin } from "../../../utils/auth";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("id");
    const isPreview = searchParams.get("preview") === "true";
    const isInline = isPreview || searchParams.get("inline") === "true";

    if (!noteId) {
      return NextResponse.json({ error: "Missing note ID parameter" }, { status: 400 });
    }

    // 1. Fetch note details using admin client
    const { data: note, error: noteError } = await supabaseAdmin
      .from("notes")
      .select("download_url, price, title")
      .eq("id", noteId)
      .single();

    if (noteError || !note) {
      console.error(`Error querying note ${noteId}:`, noteError);
      return NextResponse.json({ error: "Study note not found" }, { status: 404 });
    }

    const downloadUrl = note.download_url;
    if (!downloadUrl) {
      return NextResponse.json({ error: "No download URL available for this note" }, { status: 404 });
    }

    const price = note.price ? Number(note.price) : 0;

    // 2. Check permissions for premium notes (skip if preview)
    if (price > 0 && !isPreview) {
      const supabaseServer = await createSupabaseServerClient();
      const { data: { user } } = await supabaseServer.auth.getUser();

      if (!user || !user.email) {
        return NextResponse.json({ error: "Authentication required to access premium resources" }, { status: 401 });
      }

      const email = user.email.trim().toLowerCase();

      // Check if user is admin (admin bypass)
      const userIsAdmin = checkIsAdmin(email);
      if (!userIsAdmin) {
        // Query purchases table for this user and note
        const { data: purchase, error: purchaseError } = await supabaseAdmin
          .from("purchases")
          .select("id")
          .eq("email", email)
          .eq("note_id", noteId)
          .eq("status", "success")
          .maybeSingle();

        if (purchaseError || !purchase) {
          console.warn(`Unauthorized download attempt by ${email} for note ${noteId}`);
          return NextResponse.json({ error: "Access denied. Premium resource must be purchased first." }, { status: 403 });
        }
      }
    }

    // Clean title for content-disposition header
    const cleanTitle = note.title.replace(/[^a-zA-Z0-9_\-]/g, "_").toLowerCase();
    const filename = `${cleanTitle}.pdf`;
    
    const contentDisposition = isInline 
      ? "inline" 
      : `attachment; filename="${filename}"`;

    const cacheControl = isPreview
      ? "public, max-age=31536000, immutable"
      : price === 0
      ? "public, max-age=86400"
      : "private, max-age=3600";

    const bucketName = "notes-bucket";
    const pathIndex = downloadUrl.indexOf(`/${bucketName}/`);

    // 3. If preview mode, process and extract first 3 pages with watermark
    if (isPreview) {
      let rawBuffer: ArrayBuffer;
      if (pathIndex !== -1) {
        const filePath = downloadUrl.substring(pathIndex + `/${bucketName}/`.length);
        const { data: fileData, error: downloadError } = await supabaseAdmin
          .storage
          .from(bucketName)
          .download(filePath);

        if (downloadError || !fileData) {
          console.error(`Failed to download PDF from private storage bucket:`, downloadError);
          return NextResponse.json({ error: "Failed to retrieve the PDF file from storage" }, { status: 500 });
        }
        rawBuffer = await fileData.arrayBuffer();
      } else {
        const fileResponse = await fetch(downloadUrl);
        if (!fileResponse.ok) {
          return NextResponse.json({ error: "Failed to retrieve the PDF file from storage" }, { status: 500 });
        }
        rawBuffer = await fileResponse.arrayBuffer();
      }

      try {
        const srcDoc = await PDFDocument.load(rawBuffer);
        const previewDoc = await PDFDocument.create();
        const helveticaFont = await previewDoc.embedFont(StandardFonts.HelveticaBold);

        const pageCount = srcDoc.getPageCount();
        const maxPages = Math.min(3, pageCount);
        const pageIndices = Array.from({ length: maxPages }, (_, i) => i);

        const copiedPages = await previewDoc.copyPages(srcDoc, pageIndices);

        for (const page of copiedPages) {
          previewDoc.addPage(page);
          const { width, height } = page.getSize();

          page.drawText("PRIVATE ACADEMY PREVIEW", {
            x: width / 6,
            y: height / 3.5,
            size: 32,
            font: helveticaFont,
            color: rgb(0.6, 0.6, 0.6),
            opacity: 0.15,
            rotate: degrees(45),
          });
        }

        const previewBuffer = await previewDoc.save();
        return new NextResponse(new Blob([previewBuffer as unknown as BlobPart], { type: "application/pdf" }), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": contentDisposition,
            "Cache-Control": cacheControl,
          },
        });
      } catch (pdfError) {
        console.error("Error processing PDF preview:", pdfError);
        return NextResponse.json({ error: "Failed to generate PDF preview" }, { status: 500 });
      }
    }

    // 4. Non-preview mode: Stream PDF directly to client without buffering in memory
    if (pathIndex !== -1) {
      const filePath = downloadUrl.substring(pathIndex + `/${bucketName}/`.length);
      const { data: fileData, error: downloadError } = await supabaseAdmin
        .storage
        .from(bucketName)
        .download(filePath);

      if (downloadError || !fileData) {
        console.error(`Failed to download PDF from private storage bucket:`, downloadError);
        return NextResponse.json({ error: "Failed to retrieve the PDF file from storage" }, { status: 500 });
      }

      return new NextResponse(fileData.stream(), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": contentDisposition,
          "Cache-Control": cacheControl,
        },
      });
    } else {
      const fileResponse = await fetch(downloadUrl);
      if (!fileResponse.ok || !fileResponse.body) {
        return NextResponse.json({ error: "Failed to retrieve the PDF file from storage" }, { status: 500 });
      }

      return new NextResponse(fileResponse.body as ReadableStream, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": contentDisposition,
          "Cache-Control": cacheControl,
        },
      });
    }
  } catch (error) {
    console.error("Proxy PDF download endpoint error:", error);
    return NextResponse.json({ error: "Internal server error during file retrieval" }, { status: 500 });
  }
}

