import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../utils/supabaseAdmin";
import { createSupabaseServerClient } from "../../../../../utils/supabaseServer";
import { isAdmin } from "../../../../../utils/auth";
import { checkRateLimit } from "../../../../../utils/rateLimiter";

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const { allowed, retryAfterSeconds } = checkRateLimit(`reset_pwd_${clientIp}`, 5, 15 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json(
        { error: `Too many password reset requests. Please try again in ${retryAfterSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }
    // 1. Verify admin privilege
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email || !(await isAdmin(user.email))) {
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
