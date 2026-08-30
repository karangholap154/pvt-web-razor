import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";
import { supabaseAdmin } from "../../../../utils/supabaseAdmin";
import { checkIsAdmin } from "../../../../utils/auth";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ authenticated: false });
    }

    const cleanEmail = user.email.trim().toLowerCase();

    // Query DB by id first (primary key), fallback to email
    let { data: userData } = await supabaseAdmin
      .from("users")
      .select("university, default_branch, default_semester, username, role")
      .eq("id", user.id)
      .maybeSingle();

    if (!userData) {
      const { data: byEmail } = await supabaseAdmin
        .from("users")
        .select("university, default_branch, default_semester, username, role")
        .eq("email", cleanEmail)
        .maybeSingle();
      userData = byEmail;
    }

    const isUserAdmin = checkIsAdmin(cleanEmail, userData?.role);
    const userRole = isUserAdmin ? "admin" : userData?.role || "user";

    let username = userData?.username ?? null;
    let university = userData?.university ?? null;

    // For admin accounts, if username is missing, auto-assign default admin username to avoid infinite gate loop
    if (isUserAdmin && !username) {
      const emailPrefix = cleanEmail.split("@")[0].replace(/[^a-z0-9_]/g, "");
      username = emailPrefix || "admin";
      university = university || "Mumbai University";

      await supabaseAdmin.from("users").upsert(
        {
          id: user.id,
          email: cleanEmail,
          username,
          role: "admin",
          university,
        },
        { onConflict: "id" }
      );
    } else if (!userData) {
      // Auto-provision basic user record if missing in public.users
      await supabaseAdmin.from("users").upsert(
        {
          id: user.id,
          email: cleanEmail,
          role: userRole,
        },
        { onConflict: "id" }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        email: cleanEmail,
        university,
        default_branch: userData?.default_branch ?? null,
        default_semester: userData?.default_semester ?? null,
        username,
        role: userRole,
        isAdmin: isUserAdmin,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
