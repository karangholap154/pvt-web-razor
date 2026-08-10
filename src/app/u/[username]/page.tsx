import { cache } from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import type { Metadata } from "next";
import UserProfileClient from "./UserProfileClient";

interface PageProps {
  params: Promise<{ username: string }>;
}

const getProfileByUsername = cache(async (username: string) => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: profile } = await supabase
      .from("users")
      .select("id, full_name, university, default_branch, avatar_url, created_at, username, email, badge_tier")
      .eq("username", username.toLowerCase())
      .maybeSingle();

    return profile;
  } catch (err) {
    console.error("Error fetching profile by username:", err);
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return {
      title: "User Not Found | Private Academy",
    };
  }

  const title = `@${username} — ${profile.full_name || "Student"} | Private Academy`;
  const description = `Explore @${username}'s engineering study resources on Private Academy.${profile.university ? ` Studying ${profile.default_branch || ""} at ${profile.university}.` : ""}`;
  const url = `/u/${username}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      username: username,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

interface Note {
  id: string;
  title: string;
  branch: string;
  semester: string;
  description: string;
  price: number;
  videoUrl: string;
  downloadUrl: string;
  university: string;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();

  // Check if the viewer is the profile owner
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const isOwn = currentUser?.id === profile.id;

  // Determine if this profile is an Admin
  const adminEmailsStr = process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsStr
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const profileIsAdmin = profile.email ? adminEmails.includes(profile.email.trim().toLowerCase()) : false;

  // Fetch notes uploaded by the admin or student contributor
  let notes: Note[] = [];
  let notesQuery = supabase
    .from("notes")
    .select("id, title, branch, semester, price, university, video_url, download_url, is_community_contributed, contributor_id")
    .order("created_at", { ascending: false });

  if (!profileIsAdmin) {
    notesQuery = notesQuery.eq("contributor_id", profile.id);
  } else {
    notesQuery = notesQuery.or(`contributor_id.eq.${profile.id},is_community_contributed.is.null,is_community_contributed.eq.false`);
  }

  const { data: dbNotes } = await notesQuery;

  if (dbNotes) {
    notes = dbNotes.map((item) => ({
      id: item.id,
      title: item.title,
      branch: item.branch,
      semester: item.semester,
      description: `${item.title} - ${item.branch} Engineering, ${item.semester} | ${item.university || ""}`,
      price: item.price ? Number(item.price) : 0,
      videoUrl: item.video_url || "",
      downloadUrl: item.download_url || "",
      university: item.university || "",
      is_community_contributed: item.is_community_contributed,
      contributor_id: item.contributor_id,
    }));
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": `@${profile.username ?? username} - ${profile.full_name || "Student Contributor"}`,
    "description": `Explore @${profile.username ?? username}'s engineering study resources on Private Academy.`,
    "url": `https://www.privateacademy.in/u/${profile.username ?? username}`,
    "mainEntity": {
      "@type": "Person",
      "name": profile.full_name || profile.username || username,
      "image": profile.avatar_url || undefined,
      "worksFor": profile.university ? {
        "@type": "EducationalOrganization",
        "name": profile.university
      } : undefined
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UserProfileClient
        username={profile.username ?? username}
        fullName={profile.full_name ?? null}
        university={profile.university ?? null}
        branch={profile.default_branch ?? null}
        avatarUrl={profile.avatar_url ?? null}
        createdAt={profile.created_at ?? null}
        isOwn={isOwn}
        isAdmin={profileIsAdmin}
        badgeTier={profile.badge_tier ?? null}
        notes={notes}
      />
    </>
  );
}
