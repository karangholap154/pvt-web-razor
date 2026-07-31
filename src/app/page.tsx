import type { Metadata } from "next";
import { Suspense } from "react";
import HomeContent from "../components/portal/HomeContent";

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
      <HomeContent />
    </Suspense>
  );
}
