import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "../../../../utils/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("Webhook verification failed: Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    if (!webhookSecret) {
      console.warn("RAZORPAY_WEBHOOK_SECRET is not configured. Webhook signature checks will fail!");
    }

    // 1. Validate Webhook Signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Webhook verification failed: Signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Parse payload
    const eventData = JSON.parse(rawBody);
    console.log(`Razorpay webhook received event: ${eventData.event}`);

    // We handle payment.captured
    if (eventData.event === "payment.captured") {
      const payment = eventData.payload.payment.entity;
      const razorpay_order_id = payment.order_id;
      const razorpay_payment_id = payment.id;
      const notes = payment.notes || {};
      
      const noteId = notes.noteId;
      // Use email from notes metadata first, fallback to the prefilled payment email
      const email = (notes.email || payment.email || "").trim().toLowerCase();
      const amountPaise = payment.amount;

      if (!razorpay_order_id || !razorpay_payment_id || !noteId || !email) {
        console.error("Webhook payment payload missing required properties:", {
          razorpay_order_id,
          razorpay_payment_id,
          noteId,
          email,
        });
        return NextResponse.json(
          { error: "Incomplete payment entity details" },
          { status: 400 }
        );
      }

      console.log(`Webhook processing successful payment for Order: ${razorpay_order_id}, Email: ${email}, Note: ${noteId}`);

      // 3. Fetch note details to calculate earnings split
      const grossAmount = Number(amountPaise) / 100;
      let contributorId: string | null = null;
      let contributorEarnings = 0;
      let platformCommission = grossAmount;

      const { data: noteItem } = await supabaseAdmin
        .from("notes")
        .select("is_community_contributed, contributor_id, platform_commission_rate")
        .eq("id", noteId)
        .maybeSingle();

      if (noteItem?.is_community_contributed && noteItem.contributor_id) {
        contributorId = noteItem.contributor_id;
        const commissionRate = Number(noteItem.platform_commission_rate) || 0.20;
        platformCommission = Number((grossAmount * commissionRate).toFixed(2));
        contributorEarnings = Number((grossAmount - platformCommission).toFixed(2));
      }

      // Insert or update the purchase record in Supabase using admin client
      const { error: upsertError } = await supabaseAdmin.from("purchases").upsert(
        {
          email,
          note_id: noteId,
          razorpay_order_id,
          razorpay_payment_id,
          amount: grossAmount,
          contributor_id: contributorId,
          contributor_earnings: contributorEarnings,
          platform_commission: platformCommission,
          status: "success",
        },
        { onConflict: "razorpay_order_id" }
      );

      if (upsertError) {
        console.error("Webhook failed to record purchase in Supabase:", upsertError);
        return NextResponse.json(
          { error: "Database transaction logging failed" },
          { status: 500 }
        );
      }

      console.log(`Webhook successfully recorded purchase for ${email} / Note: ${noteId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: "Internal webhook processing error" },
      { status: 500 }
    );
  }
}
