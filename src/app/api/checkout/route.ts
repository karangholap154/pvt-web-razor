import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabase } from "../../../utils/supabaseClient";

// Initialize Razorpay client on the server side
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: Request) {
  try {
    const { noteId, email } = await request.json();

    if (!noteId || !email) {
      return NextResponse.json(
        { error: "noteId and email are required" },
        { status: 400 }
      );
    }

    // 1. Fetch note price and details from Supabase
    const { data: note, error } = await supabase
      .from("notes")
      .select("price, title")
      .eq("id", noteId)
      .single();

    if (error || !note) {
      return NextResponse.json(
        { error: "Note not found in library" },
        { status: 404 }
      );
    }

    const price = Number(note.price);
    if (price <= 0) {
      return NextResponse.json(
        { error: "This note is free and does not require payment" },
        { status: 400 }
      );
    }

    // 2. Prepare Order options (amount is in Paise, e.g. Rs 99 = 9900 Paise)
    const options = {
      amount: Math.round(price * 100),
      currency: "INR",
      receipt: `rcpt_${noteId.slice(0, 20)}_${Date.now().toString().slice(-8)}`,
      notes: {
        noteId,
        email,
        noteTitle: note.title,
      },
    };

    // 3. Create the Razorpay Order
    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay order checkout creation failed:", error);
    return NextResponse.json(
      { error: "Internal payment processing error" },
      { status: 500 }
    );
  }
}
