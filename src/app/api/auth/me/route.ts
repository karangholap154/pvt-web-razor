import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";
import { supabase as dbClient } from "../../../../utils/supabaseClient";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ authenticated: false });
    }

    // Fetch user's university from our custom users table (keyed by email)
    const { data: userData } = await (dbClient as any)
      .from("users")
      .select("university")
      .eq("email", user.email)
      .maybeSingle();

    return NextResponse.json({
      authenticated: true,
      email: user.email,
      university: userData?.university ?? null,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
