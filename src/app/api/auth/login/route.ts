import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";

const ALLOWED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "aol.com",
  "live.com",
  "zohomail.in",
  "zohomail.com",
  "privateacademy.in",
];

export async function POST(request: Request) {
  try {
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
    const { error } = await supabase.auth.signInWithPassword({
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

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      message: "Logged in successfully",
    });
  } catch (err: any) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "Internal login error. Please try again." },
      { status: 500 }
    );
  }
}
