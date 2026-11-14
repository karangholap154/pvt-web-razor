import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { DiscussionPost } from "@/types/discussions";

export interface InitialDiscussionsResult {
  discussions: DiscussionPost[];
  total: number;
  totalPages: number;
}

function getPublicSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

/**
 * Pre-fetches the first page of discussions for SSR and ISR.
 * Enables zero-layout-shift and SEO indexability for public discussion feeds.
 */
export async function getInitialDiscussions(limit: number = 10): Promise<InitialDiscussionsResult> {
  try {
    const supabase = getPublicSupabaseClient();

    const { data: rawDiscussions, count, error } = await supabase
      .from("discussions")
      .select(
        "id, user_id, note_id, university, branch, semester, title, content, tags, upvotes_count, replies_count, is_resolved, created_at, updated_at",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(0, limit - 1);

    if (error || !rawDiscussions) {
      console.error("Error prefetching discussions:", error);
      return { discussions: [], total: 0, totalPages: 1 };
    }

    const userIds = Array.from(new Set(rawDiscussions.map((d) => d.user_id)));
    const noteIds = Array.from(new Set(rawDiscussions.map((d) => d.note_id).filter(Boolean)));

    const userMap: Record<string, { username: string | null; full_name?: string | null; badge_tier?: string | null }> = {};
    const noteMap: Record<string, { id: string; title: string; branch: string; semester: string }> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("users")
        .select("id, username, full_name, badge_tier")
        .in("id", userIds);

      if (profiles) {
        profiles.forEach((p) => {
          userMap[p.id] = { username: p.username, full_name: p.full_name, badge_tier: p.badge_tier };
        });
      }
    }

    if (noteIds.length > 0) {
      const { data: notesData } = await supabase
        .from("notes")
        .select("id, title, branch, semester")
        .in("id", noteIds as string[]);

      if (notesData) {
        notesData.forEach((n) => {
          noteMap[n.id] = { id: n.id, title: n.title, branch: n.branch, semester: n.semester };
        });
      }
    }

    const enrichedDiscussions: DiscussionPost[] = rawDiscussions.map((d) => ({
      id: d.id,
      user_id: d.user_id,
      note_id: d.note_id,
      university: d.university,
      branch: d.branch,
      semester: d.semester,
      title: d.title,
      content: d.content,
      tags: d.tags || [],
      upvotes_count: d.upvotes_count || 0,
      replies_count: d.replies_count || 0,
      is_resolved: Boolean(d.is_resolved),
      created_at: d.created_at || new Date().toISOString(),
      updated_at: d.updated_at || undefined,
      author: {
        id: d.user_id,
        username: userMap[d.user_id]?.username || "Anonymous",
        full_name: userMap[d.user_id]?.full_name,
        badge_tier: userMap[d.user_id]?.badge_tier || "contributor",
      },
      linked_note: d.note_id ? noteMap[d.note_id] || null : null,
      has_user_voted: false,
    }));

    return {
      discussions: enrichedDiscussions,
      total: count || 0,
      totalPages: count ? Math.ceil(count / limit) : 1,
    };
  } catch (err) {
    console.error("Error in getInitialDiscussions:", err);
    return { discussions: [], total: 0, totalPages: 1 };
  }
}
