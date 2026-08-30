import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { isAdmin } from "@/utils/auth";

export async function GET(request: Request) {
  try {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user || !user.email || !(await isAdmin(user.email))) {
      return NextResponse.json({ error: "Unauthorized admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    let query = supabaseAdmin
      .from("payout_requests")
      .select("*, users:user_id(id, username, email, full_name)")
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data: payoutRequests, error } = await query;

    if (error) {
      console.error("Failed to fetch payout requests for admin:", error);
      return NextResponse.json({ error: "Failed to fetch payout requests" }, { status: 500 });
    }

    const rawPayouts = payoutRequests || [];
    const enrichedPayouts = rawPayouts.map((p) => {
      const userProfile = Array.isArray(p.users) ? p.users[0] : p.users;
      return {
        ...p,
        user_profile: userProfile || { username: "Unknown", email: "" },
      };
    });

    return NextResponse.json({ payoutRequests: enrichedPayouts });
  } catch (error) {
    console.error("GET /api/admin/payouts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user || !user.email || !(await isAdmin(user.email))) {
      return NextResponse.json({ error: "Unauthorized admin access required" }, { status: 403 });
    }

    const { requestId, action, utrReference, adminNotes } = await request.json();

    if (!requestId || !action || !["complete", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid payout processing parameters" }, { status: 400 });
    }

    if (action === "complete" && !utrReference?.trim()) {
      return NextResponse.json({ error: "UTR transaction reference number is required to mark payout as completed" }, { status: 400 });
    }

    const status = action === "complete" ? "completed" : "rejected";

    const { error: updateError } = await supabaseAdmin
      .from("payout_requests")
      .update({
        status,
        utr_reference: utrReference ? utrReference.trim() : null,
        admin_notes: adminNotes ? adminNotes.trim() : null,
        processed_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("Failed to update payout request:", updateError);
      return NextResponse.json({ error: "Failed to update payout request status" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Payout request marked as ${status}`,
    });
  } catch (error) {
    console.error("POST /api/admin/payouts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
