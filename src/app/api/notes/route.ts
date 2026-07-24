import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const university = searchParams.get("university");
    const branch = searchParams.get("branch");
    const semester = searchParams.get("semester");
    const search = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "60", 10);

    if (!university) {
      return NextResponse.json(
        { error: "University parameter is required" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // 1. Fetch metadata (lightweight branch/semester note summaries for folder tree & counts)
    const { data: allNotesMeta } = await supabase
      .from("notes")
      .select("id, title, branch, semester")
      .eq("university", university);

    // 2. Build filtered notes query
    let query = supabase
      .from("notes")
      .select("id, title, branch, semester, download_url, video_url, price, university", { count: "exact" })
      .eq("university", university);

    if (branch && branch !== "All branches") {
      query = query.eq("branch", branch);
    }

    if (semester && semester !== "All semesters") {
      query = query.eq("semester", semester);
    }

    if (search && search.trim() !== "") {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: notes, count, error } = await query
      .order("title", { ascending: true })
      .range(from, to);

    if (error) {
      console.error("Notes API database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        notes: notes || [],
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 0,
        meta: allNotesMeta || [],
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Notes GET endpoint exception:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
