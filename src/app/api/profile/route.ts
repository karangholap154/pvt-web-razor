import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

// Dot allowed in middle only — not first/last char, no consecutive dots
// Pattern: first=[a-z0-9_], middle=[a-z0-9_.]{1,13}, last=[a-z0-9_] = 3-15 chars total
const USERNAME_REGEX = /^(?!.*\.\.)[a-z0-9_][a-z0-9_.]{1,13}[a-z0-9_]$/;

export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cleanEmail = user.email.trim().toLowerCase();
    const body = await request.json();
    const { full_name, university, default_branch, default_semester, username } = body;

    // Validate and normalize username if provided
    let normalizedUsername: string | null = null;
    if (username !== undefined && username !== null && username !== "") {
      normalizedUsername = username.trim().toLowerCase();
      const testable: string = normalizedUsername ?? "";
      if (!USERNAME_REGEX.test(testable)) {
        return NextResponse.json(
          { error: "Username must be 3–15 characters and contain only lowercase letters, numbers, or underscores." },
          { status: 400 }
        );
      }
      // Check uniqueness — exclude current user
      const { data: existing } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("username", normalizedUsername as string)
        .neq("id", user.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
      }
    }

    // Fetch existing user record to preserve unspecified fields
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const upsertPayload = {
      id: user.id,
      email: cleanEmail,
      full_name: full_name !== undefined ? full_name : existingUser?.full_name ?? null,
      university: university !== undefined ? university : existingUser?.university ?? null,
      default_branch: default_branch !== undefined ? default_branch : existingUser?.default_branch ?? null,
      default_semester: default_semester !== undefined ? default_semester : existingUser?.default_semester ?? null,
      username: username !== undefined ? normalizedUsername : existingUser?.username ?? null,
    };

    const { error } = await supabaseAdmin
      .from("users")
      .upsert(upsertPayload, { onConflict: "id" });

    if (error) {
      console.error("Supabase profile upsert error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    // Best-effort update of auth user metadata so changes reflect in session claims
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: full_name || existingUser?.full_name || null,
        },
      });

      if (authError) {
        console.warn("Supabase auth metadata update warning:", authError.message);
      }
    } catch (authErr) {
      console.warn("Non-fatal auth metadata update exception:", authErr);
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
