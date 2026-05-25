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

// Helper to parse tech stack to array of strings
function parseTechStack(input: any): string[] {
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    return input.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
  }
  return [];
}

// 1. Create Project (POST)
export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { title, branch, techStack, description, githubUrl } = await request.json();

    if (!title || !branch) {
      return NextResponse.json(
        { error: "Title and branch are required" },
        { status: 400 }
      );
    }

    // Generate unique text id
    const rand = crypto.randomBytes(3).toString("hex");
    const id = `proj-${slugify(title)}-${rand}`;

    const { data, error } = await supabase.from("projects").insert({
      id,
      title,
      branch,
      tech_stack: parseTechStack(techStack),
      description: description || "",
      github_url: githubUrl || "",
    }).select().single();

    if (error) {
      console.error("Database insert project error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }
}

// 2. Update Project (PUT)
export async function PUT(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id, title, branch, techStack, description, githubUrl } = await request.json();

    if (!id || !title || !branch) {
      return NextResponse.json(
        { error: "ID, Title, and branch are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("projects")
      .update({
        title,
        branch,
        tech_stack: parseTechStack(techStack),
        description: description || "",
        github_url: githubUrl || "",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database update project error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error: any) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }
}

// 3. Delete Project (DELETE)
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

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Database delete project error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }
}
