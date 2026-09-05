import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";
import { supabaseAdmin } from "../../../../utils/supabaseAdmin";
import { ALLOWED_DOMAINS } from "../../../../utils/constants";
import { checkRateLimitAsync } from "../../../../utils/rateLimiter";

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const { allowed, retryAfterSeconds } = await checkRateLimitAsync(`login_${clientIp}`, 10, 15 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${retryAfterSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const domain = cleanEmail.split("@").pop() || "";

    // 1. Domain restriction
    if (!ALLOWED_DOMAINS.includes(domain)) {
      return NextResponse.json(
        {
          error:
            "Unsupported email domain. Please use a supported email provider (e.g. Gmail, Yahoo, Outlook).",
        },
        { status: 400 }
      );
    }

    // 2. Sign in via Supabase Auth — sessions stored in cookies automatically
    const supabase = await createSupabaseServerClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      const msg = error.message.toLowerCase();

      // Email not confirmed yet
      if (msg.includes("email not confirmed") || msg.includes("not confirmed")) {
        return NextResponse.json(
          {
            error:
              "Please confirm your email first. Check your inbox for the confirmation link we sent.",
          },
          { status: 401 }
        );
      }

      // Invalid credentials
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3. Check user status in public.users
    if (authData.user) {
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("status")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (userData?.status === "banned") {
        await supabase.auth.signOut();
        return NextResponse.json(
          { error: "Your account has been permanently banned due to community guidelines violation." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      message: "Logged in successfully",
    });
  } catch (err: unknown) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "Internal login error. Please try again." },
      { status: 500 }
    );
  }
}
