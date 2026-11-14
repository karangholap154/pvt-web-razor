import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { DiscussionPost, DiscussionReply } from "@/types/discussions";

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

export interface DiscussionThreadResult {
  discussion: DiscussionPost;
  replies: DiscussionReply[];
}

/**
 * Pre-fetches a single discussion thread and its replies for SSR, metadata, and JSON-LD.
 * Wrapped in React cache() so generateMetadata and page render share the same query.
 */
export const getDiscussionThread = cache(async (id: string): Promise<DiscussionThreadResult | null> => {
  try {
    const supabase = getPublicSupabaseClient();

    const { data: discussion, error: discError } = await supabase
      .from("discussions")
      .select("*, notes(id, title, branch, semester, university)")
      .eq("id", id)
      .maybeSingle();

    if (discError || !discussion) {
      return null;
    }

    const { data: rawReplies } = await supabase
      .from("discussion_replies")
      .select("*")
      .eq("discussion_id", id)
      .order("is_accepted_answer", { ascending: false })
      .order("upvotes_count", { ascending: false })
      .order("created_at", { ascending: true });

    const replies = rawReplies || [];
    const allUserIds = Array.from(
      new Set([discussion.user_id, ...replies.map((r) => r.user_id)])
    );

    const userMap: Record<string, { username: string | null; full_name?: string | null; badge_tier?: string | null }> = {};
    if (allUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from("users")
        .select("id, username, full_name, badge_tier")
        .in("id", allUserIds);

      if (profiles) {
        profiles.forEach((p) => {
          userMap[p.id] = { username: p.username, full_name: p.full_name, badge_tier: p.badge_tier };
        });
      }
    }

    const rawNote = discussion.notes;
    const linkedNote = Array.isArray(rawNote) ? rawNote[0] : rawNote;

    const enrichedDiscussion: DiscussionPost = {
      id: discussion.id,
      user_id: discussion.user_id,
      note_id: discussion.note_id,
      university: discussion.university,
      branch: discussion.branch,
      semester: discussion.semester,
      title: discussion.title,
      content: discussion.content,
      tags: discussion.tags || [],
      upvotes_count: discussion.upvotes_count || 0,
      replies_count: discussion.replies_count || 0,
      is_resolved: Boolean(discussion.is_resolved),
      created_at: discussion.created_at || new Date().toISOString(),
      updated_at: discussion.updated_at || undefined,
      author: {
        id: discussion.user_id,
        username: userMap[discussion.user_id]?.username || "Anonymous",
        full_name: userMap[discussion.user_id]?.full_name,
        badge_tier: userMap[discussion.user_id]?.badge_tier || "contributor",
      },
      linked_note: linkedNote
        ? {
            id: linkedNote.id,
            title: linkedNote.title,
            branch: linkedNote.branch,
            semester: linkedNote.semester,
            university: linkedNote.university || undefined,
          }
        : null,
      has_user_voted: false,
    };

    const enrichedReplies: DiscussionReply[] = replies.map((r) => ({
      id: r.id,
      discussion_id: r.discussion_id,
      user_id: r.user_id,
      content: r.content,
      is_accepted_answer: Boolean(r.is_accepted_answer),
      upvotes_count: r.upvotes_count || 0,
      created_at: r.created_at || new Date().toISOString(),
      author: {
        id: r.user_id,
        username: userMap[r.user_id]?.username || "Anonymous",
        full_name: userMap[r.user_id]?.full_name,
        badge_tier: userMap[r.user_id]?.badge_tier || "contributor",
      },
      has_user_voted: false,
    }));

    return {
      discussion: enrichedDiscussion,
      replies: enrichedReplies,
    };
  } catch (err) {
    console.error("Error in getDiscussionThread:", err);
    return null;
  }
});
