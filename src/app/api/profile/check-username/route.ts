import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";

// Dot allowed in middle only — not first/last char, no consecutive dots
const USERNAME_REGEX = /^(?!.*\.\.)[a-z0-9_][a-z0-9_.]{1,13}[a-z0-9_]$/;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.trim().toLowerCase();

    if (!username) {
      return NextResponse.json({ available: false, error: "Username is required." }, { status: 400 });
    }

    if (!USERNAME_REGEX.test(username)) {
      return NextResponse.json({
        available: false,
        error: "3–15 chars: start/end with a letter, number or underscore. Dots allowed in the middle only.",
      });
    }

    const supabase = await createSupabaseServerClient();
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    return NextResponse.json({ available: !existing });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json({ available: false, error: "Internal server error" }, { status: 500 });
  }
}
