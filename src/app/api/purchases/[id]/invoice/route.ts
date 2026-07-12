import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../../utils/supabaseServer";
import { supabaseAdmin } from "../../../../../utils/supabaseAdmin";
import { isAdmin } from "../../../../../utils/auth";
import PDFDocument from "pdfkit";
import path from "path";

// Seller Information
const SELLER_INFO = {
  name: "Private Academy Engineering",
  email: "privateacademy.in@gmail.com",
  address: "Pune, Maharashtra, India",
};

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const purchaseId = params.id;

    if (!purchaseId) {
      return NextResponse.json(
        { error: "Purchase ID is required" },
        { status: 400 }
      );
    }

    // 1. Authenticate user session
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const requesterEmail = user.email.trim().toLowerCase();

    // 2. Fetch the purchase record using admin client
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from("purchases")
      .select("id, amount, created_at, email, note_id, razorpay_order_id, razorpay_payment_id, status")
      .eq("id", purchaseId)
      .single();

    if (purchaseError || !purchase) {
      console.error(`Error fetching purchase ${purchaseId}:`, purchaseError);
      return NextResponse.json(
        { error: "Purchase record not found" },
        { status: 404 }
      );
    }

    // 3. Authorization check: must be owner or admin
    const userIsAdmin = await isAdmin();
    const isOwner = purchase.email.trim().toLowerCase() === requesterEmail;

    if (!isOwner && !userIsAdmin) {
      console.warn(
        `User ${requesterEmail} unauthorized to access invoice of purchase ${purchaseId}`
      );
      return NextResponse.json(
        { error: "Unauthorized to access this invoice" },
        { status: 403 }
      );
    }

    // 4. Fetch additional info: note details and user profile details
    let noteTitle = "Unknown Study Material";
    let noteBranch = "N/A";
    let noteSemester = "N/A";
    if (purchase.note_id) {
      const { data: note } = await supabaseAdmin
        .from("notes")
        .select("title, branch, semester")
        .eq("id", purchase.note_id)
        .single();
      if (note) {
        noteTitle = note.title;
        noteBranch = note.branch;
        noteSemester = note.semester;
      }
    }

    let buyerFullName = "Student";
    let buyerUniversity = "N/A";
    const { data: buyerProfile } = await supabaseAdmin
      .from("users")
      .select("full_name, university")
      .eq("email", purchase.email)
      .maybeSingle();

    if (buyerProfile) {
      buyerFullName = buyerProfile.full_name || "Student";
      buyerUniversity = buyerProfile.university || "N/A";
    }

    // 5. Generate PDF in Memory
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 0, size: "A4" });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // Register custom fonts
      try {
        const regularFontPath = path.join(process.cwd(), "src/assets/fonts/Roboto-Regular.ttf");
        const boldFontPath = path.join(process.cwd(), "src/assets/fonts/Roboto-Bold.ttf");
        doc.registerFont("Roboto", regularFontPath);
        doc.registerFont("Roboto-Bold", boldFontPath);
      } catch (err) {
        reject(err);
        return;
      }

      // ── Light Theme Colors ──
      const white = "#ffffff";
      const offWhite = "#f9fafb";          // Very subtle grey for alternating sections
      const accent = "#d97706";            // Amber-700 — rich amber for headings/accents
      const accentSubtle = "#fef3c7";      // Amber-100 — for tinted backgrounds
      const textPrimary = "#111827";       // Grey-900 — near black for main text
      const textSecondary = "#4b5563";     // Grey-600 — for secondary info
      const textMuted = "#9ca3af";         // Grey-400 — for labels/captions
      const border = "#e5e7eb";            // Grey-200
      const borderAccent = "#fbbf24";      // Amber-400 — for accent borders
      const successGreen = "#059669";      // Emerald-600

      // Page dimensions
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const mx = 45;
      const contentWidth = pageWidth - 2 * mx;

      // ════════════════════════════════════════════════════════
      // HEADER — Amber accent strip + clean branding
      // ════════════════════════════════════════════════════════

      // Thin amber accent bar at top
      doc.rect(0, 0, pageWidth, 5).fill(accent);

      // Brand name
      doc.font("Roboto-Bold").fontSize(22).fillColor(accent)
        .text("Private", mx, 28, { continued: true })
        .fillColor(textPrimary).text("Academy");

      // Tagline
      doc.font("Roboto").fontSize(8).fillColor(textMuted)
        .text("ENGINEERING STUDY MATERIAL HUB", mx, 54);

      // INVOICE title on the right
      doc.font("Roboto-Bold").fontSize(30).fillColor(textPrimary)
        .text("INVOICE", pageWidth - mx - 170, 20, { width: 170, align: "right" });

      // Sub-label
      doc.font("Roboto").fontSize(8).fillColor(textMuted)
        .text("Receipt", pageWidth - mx - 170, 55, { width: 170, align: "right" });

      // Separator line
      doc.lineWidth(1).strokeColor(border)
        .moveTo(mx, 75).lineTo(pageWidth - mx, 75).stroke();

      // ════════════════════════════════════════════════════════
      // META ROW — Invoice details in amber-tinted strip
      // ════════════════════════════════════════════════════════
      const metaY = 82;
      const metaH = 50;
      doc.rect(mx, metaY, contentWidth, metaH).fill(accentSubtle);

      // Subtle border around the strip
      doc.lineWidth(0.5).strokeColor(borderAccent)
        .rect(mx, metaY, contentWidth, metaH).stroke();

      const formattedDate = new Date(purchase.created_at || "").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const shortPurchaseId = purchase.id.slice(-8).toUpperCase();
      const invoiceYear = new Date(purchase.created_at || "").getFullYear();
      const invoiceNumber = `INV-${invoiceYear}-${shortPurchaseId}`;

      const metaColW = contentWidth / 4;
      const metaLabelY = metaY + 10;
      const metaValueY = metaY + 24;

      doc.font("Roboto").fontSize(7).fillColor(textMuted)
        .text("INVOICE NO.", mx + 12, metaLabelY);
      doc.font("Roboto-Bold").fontSize(9).fillColor(accent)
        .text(invoiceNumber, mx + 12, metaValueY);

      doc.font("Roboto").fontSize(7).fillColor(textMuted)
        .text("DATE OF ISSUE", mx + metaColW + 5, metaLabelY);
      doc.font("Roboto-Bold").fontSize(9).fillColor(textPrimary)
        .text(formattedDate, mx + metaColW + 5, metaValueY);

      doc.font("Roboto").fontSize(7).fillColor(textMuted)
        .text("ORDER REFERENCE", mx + metaColW * 2 + 5, metaLabelY);
      doc.font("Roboto-Bold").fontSize(9).fillColor(textPrimary)
        .text(purchase.razorpay_order_id, mx + metaColW * 2 + 5, metaValueY);

      doc.font("Roboto").fontSize(7).fillColor(textMuted)
        .text("PAYMENT STATUS", mx + metaColW * 3 + 5, metaLabelY);
      doc.font("Roboto-Bold").fontSize(9).fillColor(successGreen)
        .text("● PAID", mx + metaColW * 3 + 5, metaValueY);

      // ════════════════════════════════════════════════════════
      // BILLING DETAILS — Two column layout
      // ════════════════════════════════════════════════════════
      const billingY = metaY + metaH + 25;

      // Left: Billed From
      doc.font("Roboto-Bold").fontSize(8).fillColor(accent)
        .text("BILLED FROM", mx, billingY);
      doc.lineWidth(2).strokeColor(borderAccent)
        .moveTo(mx, billingY + 13).lineTo(mx + 35, billingY + 13).stroke();
      doc.font("Roboto-Bold").fontSize(11).fillColor(textPrimary)
        .text(SELLER_INFO.name, mx, billingY + 22);
      doc.font("Roboto").fontSize(8.5).fillColor(textSecondary)
        .text(SELLER_INFO.address, mx, billingY + 38);
      doc.text(SELLER_INFO.email, mx, billingY + 50);

      // Right: Billed To
      const col2X = mx + 280;
      doc.font("Roboto-Bold").fontSize(8).fillColor(accent)
        .text("BILLED TO", col2X, billingY);
      doc.lineWidth(2).strokeColor(borderAccent)
        .moveTo(col2X, billingY + 13).lineTo(col2X + 35, billingY + 13).stroke();
      doc.font("Roboto-Bold").fontSize(11).fillColor(textPrimary)
        .text(buyerFullName, col2X, billingY + 22);
      doc.font("Roboto").fontSize(8.5).fillColor(textSecondary)
        .text(buyerUniversity, col2X, billingY + 38);
      doc.text(purchase.email, col2X, billingY + 50);

      // ════════════════════════════════════════════════════════
      // ITEM TABLE
      // ════════════════════════════════════════════════════════
      const tableY = billingY + 80;
      const tableHeaderH = 28;

      // Header — warm amber background
      doc.rect(mx, tableY, contentWidth, tableHeaderH).fill(accentSubtle);
      doc.lineWidth(0.5).strokeColor(borderAccent)
        .moveTo(mx, tableY).lineTo(mx + contentWidth, tableY).stroke()
        .moveTo(mx, tableY + tableHeaderH).lineTo(mx + contentWidth, tableY + tableHeaderH).stroke();

      doc.font("Roboto-Bold").fontSize(7.5).fillColor(accent);
      doc.text("DESCRIPTION", mx + 12, tableY + 9, { width: 330 });
      doc.text("QTY", mx + 355, tableY + 9, { width: 35, align: "center" });
      doc.text("UNIT PRICE", mx + 395, tableY + 9, { width: 55, align: "right" });
      doc.text("TOTAL", mx + 455, tableY + 9, { width: contentWidth - 467, align: "right" });

      // Item Row
      const rowY = tableY + tableHeaderH;
      const rowH = 44;
      doc.rect(mx, rowY, contentWidth, rowH).fill(white);

      // Amber left accent bar
      doc.rect(mx, rowY, 3, rowH).fill(borderAccent);

      // Bottom border
      doc.lineWidth(0.5).strokeColor(border)
        .moveTo(mx, rowY + rowH).lineTo(mx + contentWidth, rowY + rowH).stroke();

      // Item details
      doc.font("Roboto-Bold").fontSize(9.5).fillColor(textPrimary)
        .text(noteTitle, mx + 14, rowY + 8, { width: 330 });
      doc.font("Roboto").fontSize(7.5).fillColor(textSecondary)
        .text(`${noteBranch}  ·  Semester ${noteSemester}`, mx + 14, rowY + 24);

      doc.font("Roboto").fontSize(8.5).fillColor(textPrimary);
      doc.text("1", mx + 355, rowY + 15, { width: 35, align: "center" });
      doc.text(`₹${purchase.amount.toFixed(2)}`, mx + 395, rowY + 15, { width: 55, align: "right" });
      doc.font("Roboto-Bold")
        .text(`₹${purchase.amount.toFixed(2)}`, mx + 455, rowY + 15, { width: contentWidth - 467, align: "right" });

      // ════════════════════════════════════════════════════════
      // TOTALS SECTION
      // ════════════════════════════════════════════════════════
      const totalsY = rowY + rowH + 15;
      const labelX = mx + 335;
      const valueX = mx + 440;
      const valueW = contentWidth - 452;

      doc.font("Roboto").fontSize(9).fillColor(textSecondary);
      doc.text("Subtotal:", labelX, totalsY, { width: 95, align: "right" });
      doc.fillColor(textPrimary).text(`₹${purchase.amount.toFixed(2)}`, valueX, totalsY, { width: valueW, align: "right" });

      // Separator
      doc.lineWidth(0.5).strokeColor(border)
        .moveTo(labelX, totalsY + 19).lineTo(mx + contentWidth, totalsY + 19).stroke();

      // Grand Total — amber tinted row
      const gtY = totalsY + 26;
      doc.rect(labelX - 12, gtY - 5, contentWidth - (labelX - mx) + 12, 28).fill(accentSubtle);
      doc.lineWidth(0.5).strokeColor(borderAccent)
        .rect(labelX - 12, gtY - 5, contentWidth - (labelX - mx) + 12, 28).stroke();

      doc.font("Roboto-Bold").fontSize(10).fillColor(textPrimary)
        .text("AMOUNT PAID:", labelX, gtY + 2, { width: 95, align: "right" });
      doc.fontSize(13).fillColor(accent)
        .text(`₹${purchase.amount.toFixed(2)}`, valueX, gtY, { width: valueW, align: "right" });

      // ════════════════════════════════════════════════════════
      // PAYMENT CONFIRMATION CARD
      // ════════════════════════════════════════════════════════
      const payY = gtY + 50;
      doc.rect(mx, payY, contentWidth, 55).fill(offWhite);
      doc.lineWidth(0.5).strokeColor(border)
        .rect(mx, payY, contentWidth, 55).stroke();

      // Amber left accent
      doc.rect(mx, payY, 3, 55).fill(borderAccent);

      doc.font("Roboto-Bold").fontSize(7.5).fillColor(accent)
        .text("PAYMENT CONFIRMATION", mx + 14, payY + 8);

      doc.font("Roboto").fontSize(8.5).fillColor(textSecondary)
        .text("Razorpay Payment ID:  ", mx + 14, payY + 23, { continued: true })
        .font("Roboto-Bold").fillColor(textPrimary).text(purchase.razorpay_payment_id);

      doc.font("Roboto").fontSize(8.5).fillColor(textSecondary)
        .text("Razorpay Order ID:     ", mx + 14, payY + 37, { continued: true })
        .font("Roboto-Bold").fillColor(textPrimary).text(purchase.razorpay_order_id);

      // PAID Stamp — top right of payment card
      const stampCx = mx + contentWidth - 55;
      const stampCy = payY + 28;
      doc.save();
      doc.rotate(-15, { origin: [stampCx, stampCy] });
      doc.lineWidth(2.5).strokeColor(successGreen)
        .roundedRect(stampCx - 32, stampCy - 12, 64, 24, 4).stroke();
      doc.font("Roboto-Bold").fontSize(14).fillColor(successGreen)
        .text("PAID", stampCx - 20, stampCy - 8);
      doc.restore();

      // ════════════════════════════════════════════════════════
      // FOOTER
      // ════════════════════════════════════════════════════════
      const footerH = 60;
      const footerY = pageHeight - footerH;

      // Light grey background with amber top line
      doc.rect(0, footerY, pageWidth, footerH).fill(offWhite);
      doc.rect(0, footerY, pageWidth, 2).fill(borderAccent);

      doc.font("Roboto").fontSize(7).fillColor(textMuted)
        .text(
          "This is a computer-generated invoice. No signature is required.",
          mx, footerY + 12,
          { width: contentWidth, align: "center" }
        );
      doc.text(
        "All purchases of digital study materials from PrivateAcademy are final and governed by our Terms of Service.",
        mx, footerY + 24,
        { width: contentWidth, align: "center" }
      );

      doc.font("Roboto-Bold").fontSize(7.5).fillColor(accent)
        .text(
          `${SELLER_INFO.name}  ·  ${SELLER_INFO.email}  ·  ${SELLER_INFO.address}`,
          mx, footerY + 42,
          { width: contentWidth, align: "center" }
        );

      doc.end();
    });

    // 6. Return PDF response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${purchase.razorpay_order_id}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("API Invoice generation error:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      {
        error: "Internal server error during invoice generation",
        message: err.message,
        stack: err.stack,
      },
      { status: 500 }
    );
  }
}
