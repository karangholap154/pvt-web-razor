import { createClient } from "@supabase/supabase-js";
import { Note } from "@/data/mockData";
import type { Database } from "@/types/supabase";

export interface PublicNotesResult {
  notes: Note[];
  meta: {
    id: string;
    title: string;
    branch: string;
    semester: string;
    university?: string;
    subject?: string;
    resource_type?: string;
  }[];
}

function getPublicSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

export async function getPublicNotesData(
  source: "official" | "community" | "all" = "all"
): Promise<PublicNotesResult> {
  try {
    const supabase = getPublicSupabaseClient();

    let query = supabase
      .from("notes")
      .select(
        "id, title, branch, semester, download_url, video_url, price, university, subject, resource_type, coverage_scope, contributor_id, is_community_contributed"
      )
      .order("title", { ascending: true })
      .limit(100);

    if (source === "official") {
      query = query.or("resource_type.eq.official_subject,and(is_community_contributed.is.null,resource_type.is.null),and(is_community_contributed.eq.false,resource_type.is.null)");
    } else if (source === "community") {
      query = query.or("resource_type.neq.official_subject,is_community_contributed.eq.true");
    }

    const { data: rawNotes } = await query;

    const meta = (rawNotes || []).map((n) => ({
      id: n.id,
      title: n.title,
      branch: n.branch,
      semester: n.semester,
      university: n.university || undefined,
      subject: n.subject || n.title,
      resource_type: n.resource_type || (n.is_community_contributed ? "supplementary_guide" : "official_subject"),
    }));

    const contributorIds = Array.from(
      new Set(
        (rawNotes || [])
          .map((n) => n.contributor_id)
          .filter((id): id is string => Boolean(id))
      )
    );

    const userMap: Record<
      string,
      { username?: string | null; full_name?: string | null }
    > = {};

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

    const formattedNotes: Note[] = (rawNotes || []).map((item) => ({
      id: item.id,
      title: item.title,
      branch: item.branch as Note["branch"],
      semester: item.semester as Note["semester"],
      description: `${item.title} - ${item.branch} Engineering, ${item.semester} | ${item.university || ""}`,
      downloadUrl: item.price && Number(item.price) > 0 ? "" : item.download_url || "",
      videoUrl: item.video_url || "",
      price: item.price ? Number(item.price) : 0,
      university: item.university || undefined,
      subject: item.subject || item.title,
      resource_type: item.resource_type || (item.is_community_contributed ? "supplementary_guide" : "official_subject"),
      coverage_scope: item.coverage_scope || null,
      is_community_contributed: item.is_community_contributed,
      contributor_id: item.contributor_id,
      contributor_username: item.contributor_id
        ? userMap[item.contributor_id]?.username
        : null,
      contributor_name: item.contributor_id
        ? userMap[item.contributor_id]?.full_name
        : null,
    }));

    return { notes: formattedNotes, meta };
  } catch (err) {
    console.error("Error pre-fetching public notes:", err);
    return { notes: [], meta: [] };
  }
}
