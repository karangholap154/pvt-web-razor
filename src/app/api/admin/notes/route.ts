import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";
import { isAdmin } from "../../../../utils/auth";

// Helper to slugify title
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// 1. Create Note (POST)
export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();

    const { title, branch, semester, downloadUrl, videoUrl, price, university } =
      await request.json();

    if (!title || !branch || !semester) {
      return NextResponse.json(
        { error: "Title, branch, and semester are required" },
        { status: 400 }
      );
    }

    // Generate unique text id
    const rand = crypto.randomBytes(3).toString("hex");
    const id = `note-${slugify(title)}-${rand}`;

    const { data, error } = await supabase
      .from("notes")
      .insert({
        id,
        title,
        branch,
        semester,
        download_url: downloadUrl || "",
        video_url: videoUrl || "",
        price: price ? Number(price) : 0,
        university: university || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert note error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, note: data });
  } catch (error: unknown) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}

// 2. Update Note (PUT)
export async function PUT(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();

    const { id, title, branch, semester, downloadUrl, videoUrl, price, university } =
      await request.json();

    if (!id || !title || !branch || !semester) {
      return NextResponse.json(
        { error: "ID, Title, branch, and semester are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("notes")
      .update({
        title,
        branch,
        semester,
        download_url: downloadUrl || "",
        video_url: videoUrl || "",
        price: price ? Number(price) : 0,
        university: university || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database update note error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, note: data });
  } catch (error: unknown) {
    console.error("Update note error:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}

// 3. Delete Note (DELETE)
export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      console.error("Database delete note error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Note deleted successfully" });
  } catch (error: unknown) {
    console.error("Delete note error:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
