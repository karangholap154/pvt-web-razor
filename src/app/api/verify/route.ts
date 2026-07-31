import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "../../../utils/supabaseAdmin";
import { getRazorpayServerInstance } from "../../../utils/razorpayServer";
import { syncContributorBadgeTier } from "@/utils/badgeUtils";

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      noteId,
      email,
      amount, // Client-reported amount (in paise)
    } = await request.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !noteId ||
      !email ||
      !amount
    ) {
      return NextResponse.json(
        { error: "Missing required verification properties" },
        { status: 400 }
      );
    }

    let razorpay;
    try {
      razorpay = getRazorpayServerInstance();
    } catch (err) {
      console.error("Razorpay initialization error:", err);
      return NextResponse.json(
        { error: "Payment verification service unavailable. Missing credentials." },
        { status: 503 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("RAZORPAY_KEY_SECRET is missing from server environment!");
      return NextResponse.json(
        { error: "Payment verification service configuration error" },
        { status: 500 }
      );
    }

    // 1. Recreate the signature hash using HMAC-SHA256 (standard security check)
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(text)
      .digest("hex");

    const expectedBuf = Buffer.from(generatedSignature, "utf-8");
    const sigBuf = Buffer.from(razorpay_signature, "utf-8");

    if (expectedBuf.length !== sigBuf.length || !crypto.timingSafeEqual(expectedBuf, sigBuf)) {
      return NextResponse.json(
        { error: "Payment verification signature mismatch" },
        { status: 400 }
      );
    }

    // 2. Prevent Order Substitution: Fetch the actual order from Razorpay's API
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    } catch (err) {
      console.error("Failed to fetch order details from Razorpay API:", err);
      return NextResponse.json(
        { error: "Unable to verify order with payment provider" },
        { status: 400 }
      );
    }

    // Validate that the order exists and has our custom metadata
    if (!razorpayOrder || !razorpayOrder.notes) {
      return NextResponse.json(
        { error: "Invalid order records found on Razorpay" },
        { status: 400 }
      );
    }

    // 3. Verify that the order metadata noteId and email match what the client submitted
    const metadataNoteId = String(razorpayOrder.notes.noteId || "");
    const metadataEmail = (razorpayOrder.notes && typeof razorpayOrder.notes.email === "string")
      ? razorpayOrder.notes.email.trim().toLowerCase()
      : String(razorpayOrder.notes.email || "").trim().toLowerCase();

    if (metadataNoteId !== noteId) {
      console.error(`Security alert: noteId mismatch. Submitted: ${noteId}, Order Metadata: ${metadataNoteId}`);
      return NextResponse.json(
        { error: "Tampered order details (noteId mismatch)" },
        { status: 400 }
      );
    }

    if (metadataEmail !== cleanEmail) {
      console.error(`Security alert: email mismatch. Submitted: ${cleanEmail}, Order Metadata: ${metadataEmail}`);
      return NextResponse.json(
        { error: "Tampered order details (email mismatch)" },
        { status: 400 }
      );
    }

    // 4. Fetch the note's actual price and contributor info from Supabase to prevent price tampering
    const { data: note, error: noteError } = await supabaseAdmin
      .from("notes")
      .select("price, is_community_contributed, contributor_id, platform_commission_rate")
      .eq("id", noteId)
      .single();

    if (noteError || !note) {
      console.error(`Failed to verify note price from database:`, noteError);
      return NextResponse.json(
        { error: "Study resource not found" },
        { status: 404 }
      );
    }

    const expectedAmountPaise = Math.round(Number(note.price) * 100);

    // Verify that the order amount matches the note's expected price
    if (razorpayOrder.amount !== expectedAmountPaise) {
      console.error(`Security alert: amount mismatch. Expected (Paise): ${expectedAmountPaise}, Order Amount: ${razorpayOrder.amount}`);
      return NextResponse.json(
        { error: "Tampered order details (amount mismatch)" },
        { status: 400 }
      );
    }

    // Calculate contributor earnings split if community-contributed
    const grossAmount = Number(expectedAmountPaise) / 100;
    let contributorId: string | null = null;
    let contributorEarnings = 0;
    let platformCommission = grossAmount;

    if (note.is_community_contributed && note.contributor_id) {
      contributorId = note.contributor_id;
      const { commissionRate } = await syncContributorBadgeTier(supabaseAdmin, contributorId);
      platformCommission = Number((grossAmount * commissionRate).toFixed(2));
      contributorEarnings = Number((grossAmount - platformCommission).toFixed(2));
    }

    // 5. Register/Upsert transaction in Supabase Purchases ledger using supabaseAdmin
    const { error: insertError } = await supabaseAdmin.from("purchases").upsert(
      {
        email: cleanEmail,
        note_id: noteId,
        razorpay_order_id,
        razorpay_payment_id,
        amount: grossAmount, // Log in Rupee units
        contributor_id: contributorId,
        contributor_earnings: contributorEarnings,
        platform_commission: platformCommission,
        status: "success",
      },
      { onConflict: "razorpay_order_id" }
    );

    if (insertError) {
      console.error("Failed to upsert purchase record in Supabase:", insertError);
      return NextResponse.json(
        { error: "Database transaction logging failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and registered",
    });
  } catch (error: unknown) {
    console.error("Signature verification error:", error);
    return NextResponse.json(
      { error: "Internal verification processing error" },
      { status: 500 }
    );
  }
}
