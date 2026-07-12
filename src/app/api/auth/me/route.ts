import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";
import { isAdmin } from "../../../../utils/auth";

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
      .select("university, default_branch, default_semester, username")
      .eq("email", user.email)
      .maybeSingle();

    const isUserAdmin = await isAdmin();

    return NextResponse.json({
      authenticated: true,
      email: user.email,
      university: userData?.university ?? null,
      default_branch: userData?.default_branch ?? null,
      default_semester: userData?.default_semester ?? null,
      username: userData?.username ?? null,
      isAdmin: isUserAdmin,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

