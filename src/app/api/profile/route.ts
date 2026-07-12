import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";

// Dot allowed in middle only — not first/last char, no consecutive dots
// Pattern: first=[a-z0-9_], middle=[a-z0-9_.]{1,13}, last=[a-z0-9_] = 3-15 chars total
const USERNAME_REGEX = /^(?!.*\.\.)[a-z0-9_][a-z0-9_.]{1,13}[a-z0-9_]$/;

export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("username", normalizedUsername as string)
        .neq("id", user.id)
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
      }
    }

    const updatePayload: {
      full_name?: string | null;
      university?: string | null;
      default_branch?: string | null;
      default_semester?: string | null;
      username?: string | null;
    } = {
      full_name: full_name || null,
      university: university || null,
      default_branch: default_branch || null,
      default_semester: default_semester || null,
    };
    if (username !== undefined) {
      updatePayload.username = normalizedUsername;
    }

    const { error } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("id", user.id);

    if (error) {
      console.error("Supabase profile update error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    // Also update auth user metadata so it reflects in the layout / navbar
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: full_name || null,
      }
    });

    if (authError) {
      console.error("Supabase auth metadata update error:", authError);
      return NextResponse.json({ error: "Failed to update auth metadata" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

