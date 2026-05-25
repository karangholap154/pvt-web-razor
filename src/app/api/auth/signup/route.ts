import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabaseClient";
import { hashPassword, generateSalt } from "../../../../utils/auth";

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

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // 1. Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing user:", fetchError);
      return NextResponse.json(
        { error: "Database verification error" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email address already exists" },
        { status: 400 }
      );
    }

    // 2. Hash password and insert
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    const { error: insertError } = await supabase.from("users").insert({
      email: cleanEmail,
      password_hash: passwordHash,
      salt: salt,
    });

    if (insertError) {
      console.error("Error creating user:", insertError);
      return NextResponse.json(
        { error: "Database registration failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal signup processing error" },
      { status: 500 }
    );
  }
}
