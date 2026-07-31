import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "../../../utils/supabaseServer";
import ArticleDetailsClient from "./ArticleDetailsClient";
import { Article } from "../../../data/mockData";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

function calculateReadTime(content: string): string {
  const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  try {
    const { data: item } = await supabase
      .from("articles")
      .select("title, summary, category")
      .eq("id", id)
      .single();

    if (!item) {
      return {
        title: "Article Not Found | Private Academy",
        description: "The requested academic article could not be found.",
        robots: { index: false },
      };
    }

    const title = `${item.title} | Private Academy`;
    const description = item.summary || "Read this syllabus explanation or study guide from our experts.";
    const url = `/articles/${id}`;

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        siteName: "Private Academy",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (err) {
    console.error("Error generating metadata for article page:", err);
    return {
      title: "Private Academy Articles & Guides",
      description: "Read educational articles and roadmap guides.",
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: item, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !item) {
    notFound();
  }

  // Format to Article structure
  const article: Article = {
    id: item.id,
    title: item.title,
    readTime: calculateReadTime(item.content || ""),
    category: item.category as Article["category"],
    summary: item.summary || "",
    content: item.content || "",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": item.title,
    "description": item.summary || "",
    "articleBody": item.content || "",
    "category": item.category || "Education",
    "url": `https://www.privateacademy.in/articles/${id}`,
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
      <ArticleDetailsClient article={article} />
    </>
  );
}
