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
      .select("id, title, branch, semester, download_url, video_url, price, university, contributor_id, is_community_contributed", { count: "exact" })
      .eq("university", university);

    if (branch && branch !== "All branches") {
      query = query.eq("branch", branch);
    }

    if (semester && semester !== "All semesters") {
      query = query.eq("semester", semester);
    }

    if (search && search.trim() !== "") {
      const sanitizedSearch = search.trim().replace(/[%_]/g, "\\$&");
      query = query.ilike("title", `%${sanitizedSearch}%`);
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

    // Enrich contributor usernames
    const rawNotes = notes || [];
    const contributorIds = Array.from(
      new Set(rawNotes.map((n) => n.contributor_id).filter((id): id is string => Boolean(id)))
    );
    const userMap: Record<string, { username?: string | null; full_name?: string | null }> = {};

    if (contributorIds.length > 0) {
      const { data: profiles } = await supabase
        .from("users")
        .select("id, username, full_name")
        .in("id", contributorIds);

      if (profiles) {
        profiles.forEach((p) => {
          userMap[p.id] = { username: p.username, full_name: p.full_name };
        });
      }
    }

    const enrichedNotes = rawNotes.map((item) => ({
      ...item,
      contributor_username: item.contributor_id ? userMap[item.contributor_id]?.username : null,
      contributor_name: item.contributor_id ? userMap[item.contributor_id]?.full_name : null,
    }));

    return NextResponse.json(
      {
        notes: enrichedNotes,
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
