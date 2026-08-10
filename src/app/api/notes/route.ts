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

    const supabase = await createSupabaseServerClient();

    // 1. Fetch metadata (lightweight branch/semester note summaries for folder tree & counts)
    let metaQuery = supabase.from("notes").select("id, title, branch, semester, university");
    if (university && university !== "All universities") {
      metaQuery = metaQuery.eq("university", university);
    }
    const { data: allNotesMeta } = await metaQuery;

    // 2. Build filtered notes query with relational contributor join
    let query = supabase
      .from("notes")
      .select("id, title, branch, semester, download_url, video_url, price, university, contributor_id, is_community_contributed, users:contributor_id(username, full_name)", { count: "exact" });

    if (university && university !== "All universities") {
      query = query.eq("university", university);
    }

    if (branch && branch !== "All branches") {
      const branchAliases: Record<string, string[]> = {
        "Information Technology (IT)": ["Information Technology (IT)", "Information Technology", "IT"],
        "Information Technology": ["Information Technology (IT)", "Information Technology", "IT"],
        "Artificial Intelligence & Machine Learning (AIML)": ["Artificial Intelligence & Machine Learning (AIML)", "AIML"],
        "AIML": ["Artificial Intelligence & Machine Learning (AIML)", "AIML"],
        "Computer Science & Engineering (CSE)": ["Computer Science & Engineering (CSE)", "CSE"],
        "Electronics & Telecommunication (EXTC)": ["Electronics & Telecommunication (EXTC)", "EXTC"],
      };
      const matchBranches = branchAliases[branch] || [branch];
      if (matchBranches.length === 1) {
        query = query.eq("branch", matchBranches[0]);
      } else {
        query = query.in("branch", matchBranches);
      }
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

    const rawNotes = notes || [];
    const enrichedNotes = rawNotes.map((item) => {
      const userProfile = Array.isArray(item.users) ? item.users[0] : item.users;
      return {
        id: item.id,
        title: item.title,
        branch: item.branch,
        semester: item.semester,
        video_url: item.video_url,
        price: item.price,
        university: item.university,
        is_community_contributed: item.is_community_contributed,
        contributor_id: item.contributor_id,
        // Omit raw storage URL for paid resources in public API responses
        download_url: item.price && Number(item.price) > 0 ? null : item.download_url,
        contributor_username: userProfile?.username ?? null,
        contributor_name: userProfile?.full_name ?? null,
      };
    });

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
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
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
