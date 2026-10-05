import type { Metadata } from "next";
import { Suspense } from "react";
import HomeContent from "@/components/portal/HomeContent";
import Loading from "./loading";
import { getPublicNotesData } from "@/utils/notesData";

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

async function AsyncHomeContent() {
  const { notes, meta } = await getPublicNotesData("official");
  return <HomeContent initialNotes={notes} initialMeta={meta} catalogMode="official" />;
}

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncHomeContent />
    </Suspense>
  );
}
