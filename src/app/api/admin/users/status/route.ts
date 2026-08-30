import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { isAdmin } from "@/utils/auth";

export async function PUT(request: Request) {
  try {
    // 1. Verify caller has admin privileges
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email || !(await isAdmin(user.email))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 2. Parse payload
    const { userId, newStatus } = await request.json();

    if (!userId || !newStatus) {
      return NextResponse.json({ error: "userId and newStatus are required" }, { status: 400 });
    }

    const validStatuses = ["active", "suspended", "banned"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed statuses are: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // 3. Update status in public.users table
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({ status: newStatus })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update user status:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `User status updated to ${newStatus}`,
      user: updatedUser,
    });
  } catch (error: unknown) {
    console.error("API update status error:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
