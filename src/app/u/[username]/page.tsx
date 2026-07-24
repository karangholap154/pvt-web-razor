import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import type { Metadata } from "next";
import UserProfileClient from "./UserProfileClient";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, university, default_branch, avatar_url")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (!profile) {
    return {
      title: "User Not Found | Private Academy",
    };
  }

  const title = `@${username} — ${profile.full_name || "Student"} | Private Academy`;
  const description = `Explore @${username}'s engineering study resources on Private Academy.${profile.university ? ` Studying ${profile.default_branch || ""} at ${profile.university}.` : ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
  const supabase = await createSupabaseServerClient();

  // Fetch the public profile by username
  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, university, default_branch, avatar_url, created_at, username, email")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  // Check if the viewer is the profile owner
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const isOwn = currentUser?.id === profile.id;

  // Determine if this profile is an Admin
  const adminEmailsStr = process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsStr
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const profileIsAdmin = profile.email ? adminEmails.includes(profile.email.trim().toLowerCase()) : false;

  // Fetch notes uploaded by the admin
  let notes: Note[] = [];
  if (profileIsAdmin) {
    const { data: dbNotes } = await supabase
      .from("notes")
      .select("id, title, branch, semester, price, university, video_url, download_url")
      .order("created_at", { ascending: false });

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
      }));
    }
  }

  return (
    <UserProfileClient
      username={profile.username ?? username}
      fullName={profile.full_name ?? null}
      university={profile.university ?? null}
      branch={profile.default_branch ?? null}
      avatarUrl={profile.avatar_url ?? null}
      createdAt={profile.created_at ?? null}
      isOwn={isOwn}
      isAdmin={profileIsAdmin}
      notes={notes}
    />
  );
}
