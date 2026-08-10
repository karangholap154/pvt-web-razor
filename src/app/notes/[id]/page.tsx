import { cache } from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "../../../utils/supabaseServer";
import NoteDetailsClient from "./NoteDetailsClient";
import { Note } from "../../../data/mockData";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

const getNote = cache(async (id: string) => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: item } = await supabase
      .from("notes")
      .select("*, users:contributor_id(username, full_name)")
      .eq("id", id)
      .maybeSingle();

    return item;
  } catch (err) {
    console.error("Error fetching note by id:", err);
    return null;
  }
});

export async function generateMetadata({ params }: NotePageProps) {
  const { id } = await params;
  const item = await getNote(id);

  if (!item) {
    return {
      title: "Study Note Not Found | Private Academy",
      description: "The requested engineering study resource could not be found.",
      robots: { index: false },
    };
  }

  const title = `${item.title} | Private Academy Notes`;
  const descText = `${item.title} - ${item.branch} Engineering, ${item.semester} study note ${item.university ? `for ${item.university}` : ""}. Download PDF & watch video explanations.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";
  const url = `${baseUrl}/notes/${id}`;

  return {
    title,
    description: descText,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: descText,
      url,
      type: "website",
      siteName: "Private Academy",
      images: [{ url: `${baseUrl}/pvtimg.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descText,
      images: [`${baseUrl}/pvtimg.png`],
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const item = await getNote(id);

  if (!item) {
    notFound();
  }

  const userProfile = Array.isArray(item.users) ? item.users[0] : item.users;

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
    contributor_username: userProfile?.username ?? null,
    contributor_name: userProfile?.full_name ?? null,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": item.title,
    "description": `${item.title} - ${item.branch} Engineering, ${item.semester}`,
    "educationalLevel": "Higher Education / Engineering",
    "learningResourceType": "Study Note & Lecture Guide",
    "provider": {
      "@type": "Organization",
      "name": "Private Academy Engineering",
      "logo": "https://www.privateacademy.in/pvtimg.png"
    },
    "url": `https://www.privateacademy.in/notes/${id}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoteDetailsClient note={note} />
    </>
  );
}
