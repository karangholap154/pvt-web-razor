import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createSupabaseServerClient } from "../../../utils/supabaseServer";
import { supabaseAdmin } from "../../../utils/supabaseAdmin";

// Initialize Razorpay client on the server side
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const userEmail = user.email.trim().toLowerCase();

    // 2. Fetch order details from Razorpay
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.fetch(orderId);
    } catch (err) {
      console.error(`Failed to fetch order ${orderId} from Razorpay:`, err);
      return NextResponse.json(
        { error: "Order not found on Razorpay" },
        { status: 404 }
      );
    }

    if (!razorpayOrder || !razorpayOrder.notes) {
      return NextResponse.json(
        { error: "Invalid order records found on Razorpay" },
        { status: 400 }
      );
    }

    // 3. Verify order ownership
    const metadataEmail = (razorpayOrder.notes && typeof razorpayOrder.notes.email === "string")
      ? razorpayOrder.notes.email.trim().toLowerCase()
      : String(razorpayOrder.notes?.email || "").trim().toLowerCase();
    const noteId = String(razorpayOrder.notes?.noteId || "");

    if (metadataEmail !== userEmail) {
      console.warn(`User ${userEmail} attempted to sync order ${orderId} owned by ${metadataEmail}`);
      return NextResponse.json(
        { error: "Unauthorized order sync (ownership mismatch)" },
        { status: 403 }
      );
    }

    // 4. Check if the order is paid or has a captured payment
    let isPaid = razorpayOrder.status === "paid" || razorpayOrder.amount_paid > 0;
    let successfulPaymentId = "";

    // Query payments for this order to find the successful payment ID
    try {
      const payments = await razorpay.orders.fetchPayments(orderId);
      const successfulPayment = payments.items?.find(
        (p: { status: string; id: string }) => p.status === "captured"
      );

      if (successfulPayment) {
        isPaid = true;
        successfulPaymentId = successfulPayment.id;
      }
    } catch (err) {
      console.error(`Failed to fetch payments for order ${orderId}:`, err);
    }

    if (!isPaid) {
      return NextResponse.json({
        success: false,
        message: "No successful payment found for this order on Razorpay yet.",
      });
    }

    // If order is paid but no specific payment ID was extracted, try a fallback string
    if (!successfulPaymentId) {
      successfulPaymentId = `sync_${orderId.slice(-10)}_${Date.now()}`;
    }

    // 5. Register/Upsert purchase in Supabase using admin client
    const { error: upsertError } = await supabaseAdmin.from("purchases").upsert(
      {
        email: userEmail,
        note_id: noteId,
        razorpay_order_id: orderId,
        razorpay_payment_id: successfulPaymentId,
        amount: Number(razorpayOrder.amount) / 100, // Stored in Rupee unit
        status: "success",
      },
      { onConflict: "razorpay_order_id" }
    );

    if (upsertError) {
      console.error("Failed to upsert sync purchase in Supabase:", upsertError);
      return NextResponse.json(
        { error: "Database transaction logging failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment synchronized and note access granted!",
    });
  } catch (error: unknown) {
    console.error("Order sync error:", error);
    return NextResponse.json(
      { error: "Internal payment sync processing error" },
      { status: 500 }
    );
  }
}
