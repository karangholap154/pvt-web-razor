import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "../../../../utils/supabaseClient";
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

// Helper to format date as "May 25, 2026"
function formatDate(): string {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  return new Date().toLocaleDateString("en-US", options);
}

// Helper to calculate read time
function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// Helper to auto-generate summary
function generateSummary(content: string): string {
  if (!content) return "";
  const cleanText = content
    .replace(/[#*`_]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
  if (cleanText.length <= 150) return cleanText;
  return cleanText.slice(0, 147) + "...";
}

// 1. Create Article (POST)
export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { title, category, content } = await request.json();

    if (!title || !category || !content) {
      return NextResponse.json(
        { error: "Title, category, and content are required" },
        { status: 400 }
      );
    }

    // Generate unique text id
    const rand = crypto.randomBytes(3).toString("hex");
    const id = `art-${slugify(title)}-${rand}`;

    const computedReadTime = calculateReadTime(content);
    const computedSummary = generateSummary(content);

    const { data, error } = await supabase.from("articles").insert({
      id,
      title,
      read_time: computedReadTime,
      category,
      summary: computedSummary,
      content,
    }).select().single();

    if (error) {
      console.error("Database insert article error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, article: data });
  } catch (error: any) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }
}

// 2. Update Article (PUT)
export async function PUT(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id, title, category, content } = await request.json();

    if (!id || !title || !category || !content) {
      return NextResponse.json(
        { error: "ID, Title, category, and content are required" },
        { status: 400 }
      );
    }

    const computedReadTime = calculateReadTime(content);
    const computedSummary = generateSummary(content);

    const { data, error } = await supabase
      .from("articles")
      .update({
        title,
        read_time: computedReadTime,
        category,
        summary: computedSummary,
        content,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database update article error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, article: data });
  } catch (error: any) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }
}

// 3. Delete Article (DELETE)
export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      console.error("Database delete article error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Article deleted successfully" });
  } catch (error: any) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }
}
