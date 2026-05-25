import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../../utils/supabaseClient";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("session_email")?.value;

    if (!sessionEmail) {
      return NextResponse.json({ authenticated: false });
    }

    // Fetch user's university from DB
    const { data: user } = await supabase
      .from("users")
      .select("university")
      .eq("email", sessionEmail)
      .maybeSingle() as any;

    return NextResponse.json({
      authenticated: true,
      email: sessionEmail,
      university: user?.university ?? null,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
