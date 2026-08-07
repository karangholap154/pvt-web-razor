import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../utils/supabaseServer";
import { getRazorpayServerInstance } from "../../../utils/razorpayServer";
import { checkRateLimit } from "@/utils/rateLimiter";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Enforce rate limiting: 10 order checkouts per 15 minutes per user
    const { allowed, retryAfterSeconds } = checkRateLimit(`checkout_${user.id}`, 10, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many payment requests. Please try again in ${retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const { noteId } = await request.json();
    const checkoutEmail = user.email.trim().toLowerCase();

    if (!noteId) {
      return NextResponse.json(
        { error: "noteId is required" },
        { status: 400 }
      );
    }

    let razorpay;
    try {
      razorpay = getRazorpayServerInstance();
    } catch (err) {
      console.error("Razorpay initialization error:", err);
      return NextResponse.json(
        { error: "Payment service is currently unavailable. Missing credentials." },
        { status: 503 }
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
        email: checkoutEmail,
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
  } catch (error: unknown) {
    console.error("Razorpay order checkout creation failed:", error);
    return NextResponse.json(
      { error: "Internal payment processing error" },
      { status: 500 }
    );
  }
}
