import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";

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
    const { full_name, university, default_branch, default_semester } = body;

    const { error } = await supabase
      .from("users")
      .update({
        full_name: full_name || null,
        university: university || null,
        default_branch: default_branch || null,
        default_semester: default_semester || null,
      })
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
