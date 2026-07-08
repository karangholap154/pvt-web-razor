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
      .select("*")
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
  };

  return <NoteDetailsClient note={note} />;
}
