import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "../../../utils/supabaseServer";
import NoteDetailsClient from "./NoteDetailsClient";
import { Note } from "../../../data/mockData";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NotePageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  
  try {
    const { data: item } = await supabase
      .from("notes")
      .select("title, branch, semester, university")
      .eq("id", id)
      .single();

    if (!item) {
      return {
        title: "Study Note Not Found | Private Academy",
        description: "The requested engineering study resource could not be found.",
      };
    }

    const descText = `${item.title} - ${item.branch} Engineering, ${item.semester} | ${item.university || ""}`;

    return {
      title: `${item.title} | Private Academy`,
      description: descText,
    };
  } catch (err) {
    console.error("Error generating metadata for note page:", err);
    return {
      title: "Private Academy Notes Library",
      description: "Access engineering notes, guides, and lectures.",
    };
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: item, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !item) {
    notFound();
  }

  let contributorUsername: string | null = null;
  let contributorName: string | null = null;

  if (item.contributor_id) {
    const { data: userProfile } = await supabase
      .from("users")
      .select("username, full_name")
      .eq("id", item.contributor_id)
      .maybeSingle();

    if (userProfile) {
      contributorUsername = userProfile.username;
      contributorName = userProfile.full_name;
    }
  }

  // Format to client Note structure
  const note: Note = {
    id: item.id,
    title: item.title,
    branch: item.branch as Note["branch"],
    semester: item.semester as Note["semester"],
    description: `${item.title} - ${item.branch} Engineering, ${item.semester} | ${item.university || ""}`,
    downloadUrl: item.download_url || "",
    videoUrl: item.video_url || "",
    price: item.price ? Number(item.price) : 0,
    university: item.university || undefined,
    is_community_contributed: item.is_community_contributed,
    contributor_id: item.contributor_id,
    contributor_username: contributorUsername,
    contributor_name: contributorName,
  };

  return <NoteDetailsClient note={note} />;
}
