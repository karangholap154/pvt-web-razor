import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";

const ALLOWED_UNIVERSITIES = [
  "Mumbai University",
  "Savitribai Phule Pune University",
  "Nagpur University",
  "Amravati University",
  "Dr. Babasaheb Ambedkar Technological University",
  "Shivaji University",
];

export async function POST(request: Request) {
  try {
    // 1. Get session from Supabase Auth
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sessionEmail = user.email;
    const { university } = await request.json();

    if (!university || !ALLOWED_UNIVERSITIES.includes(university)) {
      return NextResponse.json(
        { error: "Invalid university selection" },
        { status: 400 }
      );
    }

    // 2. Check if university is already set (permanent — cannot be changed)
    const { data: existingUser } = await supabase
      .from("users")
      .select("university")
      .eq("email", sessionEmail)
      .maybeSingle();

    if (existingUser?.university) {
      return NextResponse.json(
        { error: "University has already been set and cannot be changed" },
        { status: 400 }
      );
    }

    // 3. Upsert the row — ensures id is linked to Supabase auth user ID
    const { error: upsertError } = await supabase
      .from("users")
      .upsert({ id: user.id, email: sessionEmail, university }, { onConflict: "email" });

    if (upsertError) {
      console.error("University upsert error:", upsertError);
      return NextResponse.json(
        { error: "Failed to save university" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, university });
  } catch (error) {
    console.error("University set error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
