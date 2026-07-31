import type { Metadata } from "next";
import ArticlesClient from "./ArticlesClient";

export const metadata: Metadata = {
  title: "Educational Articles & Exam Guides | Private Academy",
  description: "Explore deep-dives into engineering concepts, exam preparation roadmaps, study techniques, and final year project ideas written by engineering experts.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "Educational Articles & Exam Guides | Private Academy",
    description: "Explore deep-dives into engineering concepts, exam preparation roadmaps, and final year project ideas written by engineering experts.",
    url: "/articles",
  },
  twitter: {
    card: "summary_large_image",
    title: "Educational Articles & Exam Guides | Private Academy",
    description: "Explore deep-dives into engineering concepts, exam preparation roadmaps, and final year project ideas.",
  },
};

export default function ArticlesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Educational Articles & Guides",
    "description": "Deep-dives into concepts, exam preparation roadmaps, and final year projects written by engineering experts.",
    "url": "https://www.privateacademy.in/articles",
    "publisher": {
      "@type": "Organization",
      "name": "Private Academy Engineering",
      "logo": "https://www.privateacademy.in/pvtimg.png"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlesClient />
    </>
  );
}
