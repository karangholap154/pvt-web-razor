import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { getContributorShareRate } from "@/utils/badgeUtils";
import { checkRateLimitAsync } from "@/utils/rateLimiter";

export async function GET() {
  try {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // 1. Fetch student's profile for upi_id & payout_name
    const { data: userProfile } = await supabaseAdmin
      .from("users")
      .select("upi_id, payout_name, badge_tier, email")
      .eq("id", user.id)
      .maybeSingle();

    // 2. Fetch all approved notes belonging to this contributor
    const { data: contributorNotes } = await supabaseAdmin
      .from("notes")
      .select("id, price, title")
      .eq("contributor_id", user.id);

    const noteIds = (contributorNotes || []).map((n) => n.id);

    let grossSales = 0;
    let totalSalesCount = 0;
    let netEarnings = 0;

    if (noteIds.length > 0) {
      // 3. Fetch all successful purchases of this contributor's notes
      const { data: purchases } = await supabaseAdmin
        .from("purchases")
        .select("amount, contributor_earnings, note_id")
        .in("note_id", noteIds)
        .eq("status", "success");

      if (purchases) {
        totalSalesCount = purchases.length;
        grossSales = purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const shareRate = getContributorShareRate(userProfile?.badge_tier);
        netEarnings = purchases.reduce((sum, p) => {
          const earnings = (p.contributor_earnings !== null && p.contributor_earnings !== undefined)
            ? Number(p.contributor_earnings)
            : Number(p.amount || 0) * shareRate;
          return sum + earnings;
        }, 0);
      }
    }

    // 4. Fetch past payout requests
    const { data: payoutRequests } = await supabaseAdmin
      .from("payout_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const totalPaidOut = (payoutRequests || [])
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const totalPendingPayouts = (payoutRequests || [])
      .filter((p) => p.status === "pending" || p.status === "processing")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const availableBalance = Math.max(0, netEarnings - totalPaidOut - totalPendingPayouts);

    return NextResponse.json({
      upi_id: userProfile?.upi_id || "",
      payout_name: userProfile?.payout_name || "",
      badge_tier: userProfile?.badge_tier || "contributor",
      grossSales,
      totalSalesCount,
      netEarnings,
      totalPaidOut,
      totalPendingPayouts,
      availableBalance,
      payoutRequests: payoutRequests || [],
    });
  } catch (error) {
    console.error("GET /api/payouts/request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Rate limit payout requests: max 5 requests per 15 minutes per user
    const { allowed, retryAfterSeconds } = await checkRateLimitAsync(`payout_request_${user.id}`, 5, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many payout requests. Please wait ${retryAfterSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

    const { upiId, payoutName, amount } = await request.json();

    const cleanUpiId = (upiId || "").trim();
    const requestAmount = Number(amount) || 0;

    if (!cleanUpiId || !cleanUpiId.includes("@")) {
      return NextResponse.json({ error: "Valid UPI ID is required (e.g. name@upi)" }, { status: 400 });
    }

    if (requestAmount < 100) {
      return NextResponse.json({ error: "Minimum payout threshold is ₹100" }, { status: 400 });
    }

    // Save/update user UPI ID in profile and fetch badge tier for payout calculation
    const { data: userProfile } = await supabaseAdmin
      .from("users")
      .select("badge_tier, status")
      .eq("id", user.id)
      .maybeSingle();

    if (userProfile?.status === "suspended" || userProfile?.status === "banned") {
      return NextResponse.json(
        { error: "Your account is currently suspended from requesting payouts." },
        { status: 403 }
      );
    }

    await supabaseAdmin
      .from("users")
      .update({
        upi_id: cleanUpiId,
        payout_name: payoutName ? payoutName.trim() : null,
      })
      .eq("id", user.id);

    // Re-verify available balance
    const { data: contributorNotes } = await supabaseAdmin
      .from("notes")
      .select("id")
      .eq("contributor_id", user.id);

    const noteIds = (contributorNotes || []).map((n) => n.id);
    let netEarnings = 0;

    if (noteIds.length > 0) {
      const { data: purchases } = await supabaseAdmin
        .from("purchases")
        .select("amount, contributor_earnings")
        .in("note_id", noteIds)
        .eq("status", "success");

      if (purchases) {
        const shareRate = getContributorShareRate(userProfile?.badge_tier);
        netEarnings = purchases.reduce((sum, p) => {
          const earnings = (p.contributor_earnings !== null && p.contributor_earnings !== undefined)
            ? Number(p.contributor_earnings)
            : Number(p.amount || 0) * shareRate;
          return sum + earnings;
        }, 0);
      }
    }

    const { data: payoutRequests } = await supabaseAdmin
      .from("payout_requests")
      .select("amount, status")
      .eq("user_id", user.id);

    const totalPaidOut = (payoutRequests || [])
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const totalPendingPayouts = (payoutRequests || [])
      .filter((p) => p.status === "pending" || p.status === "processing")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const availableBalance = Math.max(0, netEarnings - totalPaidOut - totalPendingPayouts);

    if (requestAmount > availableBalance) {
      return NextResponse.json(
        { error: `Requested amount (₹${requestAmount}) exceeds available balance (₹${availableBalance.toFixed(2)})` },
        { status: 400 }
      );
    }

    // Insert payout request
    const { data: payoutReq, error: insertError } = await supabaseAdmin
      .from("payout_requests")
      .insert({
        user_id: user.id,
        amount: requestAmount,
        upi_id: cleanUpiId,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create payout request:", insertError);
      return NextResponse.json({ error: "Failed to log payout request" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Payout request of ₹${requestAmount} submitted successfully! Admin will process to ${cleanUpiId}.`,
      payoutRequest: payoutReq,
    });
  } catch (error) {
    console.error("POST /api/payouts/request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
