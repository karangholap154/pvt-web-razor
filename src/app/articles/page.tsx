import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import ArticlesClient from "./ArticlesClient";
import { Article } from "../../data/mockData";

export const revalidate = 300; // Cache page static output for 5 minutes with Next.js ISR

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

function calculateReadTime(content: string): string {
  const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

async function getArticles(): Promise<Article[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, category, summary, read_time, created_at")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      readTime: item.read_time || calculateReadTime(""),
      category: item.category as Article["category"],
      summary: item.summary || "",
      content: "",
    }));
  } catch (err) {
    console.error("Error loading articles on server:", err);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

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
      <ArticlesClient initialArticles={articles} />
    </>
  );
}
