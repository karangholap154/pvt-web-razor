import type { Metadata } from "next";
import { Suspense } from "react";
import HomeContent from "@/components/portal/HomeContent";
import Loading from "@/app/loading";
import { getPublicNotesData } from "@/utils/notesData";

export const revalidate = 300; // ISR cache every 5 minutes

export const metadata: Metadata = {
  title: "Official Engineering Study Notes & Guides | Private Academy",
  description: "Browse verified, authentic, and complete syllabus study notes, semester question guides, and tutorials for Mumbai University, SPPU, DBATU, and more.",
  alternates: {
    canonical: "/notes",
  },
  openGraph: {
    title: "Official Engineering Study Notes & Guides | Private Academy",
    description: "Browse verified, authentic, and complete syllabus study notes, semester question guides, and tutorials.",
    url: "/notes",
  },
};

async function AsyncOfficialNotesContent() {
  const { notes, meta } = await getPublicNotesData("official");
  return <HomeContent initialNotes={notes} initialMeta={meta} catalogMode="official" />;
}

export default function OfficialNotesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncOfficialNotesContent />
    </Suspense>
  );
}
