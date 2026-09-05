import type { Metadata } from "next";
import { Suspense } from "react";
import { createSupabaseServerClient } from "../utils/supabaseServer";
import HomeContent from "../components/portal/HomeContent";
import { Note } from "../data/mockData";

export const revalidate = 300; // Cache and revalidate every 5 minutes (ISR)

export const metadata: Metadata = {
  title: "Private Academy | Engineering Study Notes, Guides & Video Tutorials",
  description: "Access syllabus-aligned engineering study notes, semester question guides, project source code, and video tutorials for Mumbai University, SPPU, DBATU, and leading universities.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Private Academy | Engineering Study Notes, Guides & Video Tutorials",
    description: "Access syllabus-aligned engineering study notes, semester question guides, project source code, and video tutorials for Mumbai University, SPPU, DBATU, and leading universities.",
    url: "/",
  },
};

async function getPublicNotesData() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: rawNotes } = await supabase
      .from("notes")
      .select("id, title, branch, semester, download_url, video_url, price, university, contributor_id, is_community_contributed")
      .order("title", { ascending: true })
      .limit(100);

    const meta = (rawNotes || []).map((n) => ({
      id: n.id,
      title: n.title,
      branch: n.branch,
      semester: n.semester,
      university: n.university || undefined,
    }));

    const contributorIds = Array.from(
      new Set((rawNotes || []).map((n) => n.contributor_id).filter((id): id is string => Boolean(id)))
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

    const formattedNotes: Note[] = (rawNotes || []).map((item) => ({
      id: item.id,
      title: item.title,
      branch: item.branch as Note["branch"],
      semester: item.semester as Note["semester"],
      description: `${item.title} - ${item.branch} Engineering, ${item.semester} | ${item.university || ""}`,
      downloadUrl: item.price && Number(item.price) > 0 ? "" : (item.download_url || ""),
      videoUrl: item.video_url || "",
      price: item.price ? Number(item.price) : 0,
      university: item.university || undefined,
      is_community_contributed: item.is_community_contributed,
      contributor_id: item.contributor_id,
      contributor_username: item.contributor_id ? userMap[item.contributor_id]?.username : null,
      contributor_name: item.contributor_id ? userMap[item.contributor_id]?.full_name : null,
    }));

    return { notes: formattedNotes, meta };
  } catch (err) {
    console.error("Error pre-fetching public notes:", err);
    return { notes: [], meta: [] };
  }
}

async function AsyncHomeContent() {
  const { notes, meta } = await getPublicNotesData();
  return <HomeContent initialNotes={notes} initialMeta={meta} />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "var(--text-secondary)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem auto" }}></div>
            <h3>Loading Private Academy Library...</h3>
          </div>
        </div>
      }
    >
      <AsyncHomeContent />
    </Suspense>
  );
}
