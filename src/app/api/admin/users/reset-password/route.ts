import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../utils/supabaseAdmin";
import { isAdmin } from "../../../../../utils/auth";

export async function POST(request: Request) {
  try {
    // 1. Verify admin privilege
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 2. Parse request JSON
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json(
        { error: "User ID and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // 3. Update password in auth.users via admin client
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: password,
    });

    if (error) {
      console.error("Admin user password reset error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "User password updated successfully",
    });
  } catch (error: unknown) {
    console.error("Reset password api error:", error);
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }
}
