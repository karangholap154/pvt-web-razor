import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../../utils/supabaseClient";
import { hashPassword } from "../../../../utils/auth";

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

    // 1. Fetch user by email
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("password_hash, salt")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (fetchError) {
      console.error("Login verification query error:", fetchError);
      return NextResponse.json(
        { error: "Authentication query failed" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2. Verify password hash
    const computedHash = hashPassword(password, user.salt);
    const isValid = computedHash === user.password_hash;

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3. Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session_email", cleanEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      message: "Logged in successfully",
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal login processing error" },
      { status: 500 }
    );
  }
}
