import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { isAdmin } from "@/utils/auth";

export async function DELETE(request: Request) {
  try {
    // 1. Verify caller has admin privileges
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email || !(await isAdmin(user.email))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Prevent self-deletion of active admin session
    if (userId === user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own active admin account." },
        { status: 400 }
      );
    }

    // 2. Delete user from public.users table first
    const { error: dbError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);

    if (dbError) {
      console.error("Failed to delete user from public.users:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 3. Delete user from Supabase Auth (auth.users)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.warn("Failed to delete user from auth.users (already deleted or error):", authError.message);
    }

    return NextResponse.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error: unknown) {
    console.error("API delete user error:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
