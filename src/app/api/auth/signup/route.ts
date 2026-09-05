import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";
import { ALLOWED_DOMAINS } from "../../../../utils/constants";
import { checkRateLimitAsync } from "../../../../utils/rateLimiter";

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const { allowed, retryAfterSeconds } = await checkRateLimitAsync(`signup_${clientIp}`, 5, 15 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json(
        { error: "RATE_LIMIT", retryAfterSeconds },
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

    // 2. Password length check
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // 3. Sign up via Supabase Auth — sends confirmation email automatically
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          accepted_legal_at: new Date().toISOString(),
        },
      },
    });

    if (error) {
      // Graceful rate-limit message
      const msg = error.message.toLowerCase();
      if (
        msg.includes("rate limit") ||
        msg.includes("too many") ||
        msg.includes("email rate")
      ) {
        return NextResponse.json(
          {
            error:
              "RATE_LIMIT", // special code — frontend will show branded message
          },
          { status: 429 }
        );
      }

      // User already exists (Supabase returns a 200 with a dummy session for
      // security — but some versions do return an error, handle both)
      if (msg.includes("already registered") || msg.includes("already exists")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in." },
          { status: 400 }
        );
      }

      console.error("Signup error from Supabase Auth:", error);
      return NextResponse.json(
        { error: error.message || "Signup failed. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "CONFIRM_EMAIL", // frontend will show "check your email" message
    });
  } catch (err: unknown) {
    console.error("Signup route error:", err);
    return NextResponse.json(
      { error: "Internal signup error. Please try again." },
      { status: 500 }
    );
  }
}
