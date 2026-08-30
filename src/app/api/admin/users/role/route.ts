import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../utils/supabaseAdmin";
import { createSupabaseServerClient } from "../../../../../utils/supabaseServer";
import { checkIsAdmin } from "../../../../../utils/auth";

export async function PUT(request: Request) {
  try {
    // 1. Verify caller has admin privileges
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminProfile } = await supabase
      .from("users")
      .select("role")
      .eq("email", user.email)
      .maybeSingle();

    if (!checkIsAdmin(user.email, adminProfile?.role)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 2. Parse payload
    const { userId, newRole } = await request.json();

    if (!userId || !newRole) {
      return NextResponse.json({ error: "userId and newRole are required" }, { status: 400 });
    }

    const validRoles = ["user", "contributor", "admin"];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        { error: `Invalid role. Allowed roles are: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    // 3. Update role in public.users table
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({ role: newRole })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update user role:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${newRole}`,
      user: updatedUser,
    });
  } catch (error: unknown) {
    console.error("API update role error:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
