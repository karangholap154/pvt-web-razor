import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ authenticated: false });
    }

    const { data: userData } = await supabase
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
