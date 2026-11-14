import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { isValidUsername } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.trim().toLowerCase();

    if (!username) {
      return NextResponse.json({ available: false, error: "Username is required." }, { status: 400 });
    }

    if (!isValidUsername(username)) {
      return NextResponse.json({
        available: false,
        error: "3–15 chars: start/end with a letter, number or underscore. Dots allowed in the middle only.",
      });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabaseAdmin
      .from("users")
      .select("id")
      .eq("username", username);

    if (user?.id) {
      query = query.neq("id", user.id);
    }

    const { data: existing } = await query.maybeSingle();

    return NextResponse.json({ available: !existing });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json({ available: false, error: "Internal server error" }, { status: 500 });
  }
}
