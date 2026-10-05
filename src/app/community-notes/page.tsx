import type { Metadata } from "next";
import { Suspense } from "react";
import CommunityNotesClient from "@/components/community/CommunityNotesClient";
import Loading from "@/app/loading";
import { getPublicNotesData } from "@/utils/notesData";

export const revalidate = 300; // ISR cache every 5 minutes

export const metadata: Metadata = {
  title: "Student Contributed Notes & Study Material | Private Academy",
  description: "Explore peer-contributed study notes, chapter summaries, handwritten PDFs, and revision sheets shared by fellow engineering students across all universities.",
  alternates: {
    canonical: "/community-notes",
  },
  openGraph: {
    title: "Student Contributed Notes & Study Material | Private Academy",
    description: "Explore peer-contributed study notes, chapter summaries, and revision sheets shared by fellow engineering students across all universities.",
    url: "/community-notes",
  },
};

async function AsyncCommunityNotesContent() {
  const { notes, meta } = await getPublicNotesData("community");
  return <CommunityNotesClient initialNotes={notes} initialMeta={meta} />;
}

export default function CommunityNotesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncCommunityNotesContent />
    </Suspense>
  );
}
