import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../../utils/supabaseClient";

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
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("session_email")?.value;

    if (!sessionEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { university } = await request.json();

    if (!university || !ALLOWED_UNIVERSITIES.includes(university)) {
      return NextResponse.json({ error: "Invalid university selection" }, { status: 400 });
    }

    // Check if university is already set (permanent — cannot be changed)
    const { data: user } = await supabase
      .from("users")
      .select("university")
      .eq("email", sessionEmail)
      .maybeSingle() as any;

    if (user?.university) {
      return NextResponse.json(
        { error: "University has already been set and cannot be changed" },
        { status: 400 }
      );
    }

    // Set the university
    const { error: updateError } = await supabase
      .from("users")
      .update({ university } as any)
      .eq("email", sessionEmail);

    if (updateError) {
      console.error("University update error:", updateError);
      return NextResponse.json({ error: "Failed to save university" }, { status: 500 });
    }

    return NextResponse.json({ success: true, university });
  } catch (error) {
    console.error("University set error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
