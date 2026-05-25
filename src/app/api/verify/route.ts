import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "../../../utils/supabaseClient";

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      noteId,
      email,
      amount,
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

    // 1. Recreate the signature hash using HMAC-SHA256
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex");

    // 2. Validate transaction integrity
    const isVerified = generatedSignature === razorpay_signature;

    if (!isVerified) {
      return NextResponse.json(
        { error: "Payment verification signature mismatch" },
        { status: 400 }
      );
    }

    // 3. Register transaction in Supabase Purchases ledger
    const { error: insertError } = await supabase.from("purchases").insert({
      email,
      note_id: noteId,
      razorpay_order_id,
      razorpay_payment_id,
      amount: Number(amount) / 100, // Log in Rupee units (divide from paise)
      status: "success",
    });

    if (insertError) {
      console.error("Failed to insert purchase record in Supabase:", insertError);
      return NextResponse.json(
        { error: "Database transaction logging failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and registered",
    });
  } catch (error: any) {
    console.error("Signature verification error:", error);
    return NextResponse.json(
      { error: "Internal verification processing error" },
      { status: 500 }
    );
  }
}
