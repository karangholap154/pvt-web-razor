import { cache } from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "../../../utils/supabaseServer";
import ArticleDetailsClient from "./ArticleDetailsClient";
import { Article } from "../../../data/mockData";
import { calculateReadTime } from "@/utils/text";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

const getArticle = cache(async (id: string) => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: item } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    return item;
  } catch (err) {
    console.error("Error fetching article by id:", err);
    return null;
  }
});

export async function generateMetadata({ params }: ArticlePageProps) {
  const { id } = await params;
  const item = await getArticle(id);

  if (!item) {
    return {
      title: "Article Not Found | Private Academy",
      description: "The requested academic article could not be found.",
      robots: { index: false },
    };
  }

  const title = `${item.title} | Private Academy`;
  const description = item.summary || "Read this syllabus explanation or study guide from our experts.";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";
  const url = `${baseUrl}/articles/${id}`;

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
      images: [{ url: `${baseUrl}/pvtimg.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/pvtimg.png`],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const item = await getArticle(id);

  if (!item) {
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";
  const url = `${baseUrl}/articles/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: item.title,
        description: item.summary || "",
        articleBody: item.content || "",
        category: item.category || "Engineering Education",
        url,
        inLanguage: "en",
        image: `${baseUrl}/pvtimg.png`,
        datePublished: item.created_at || undefined,
        dateModified: item.created_at || undefined,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        author: {
          "@type": "Organization",
          name: "Private Academy Editorial",
          url: baseUrl,
        },
        publisher: {
          "@type": "EducationalOrganization",
          name: "Private Academy Engineering",
          url: baseUrl,
          logo: `${baseUrl}/pvtimg.png`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Articles",
            item: `${baseUrl}/articles`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: item.title,
            item: url,
          },
        ],
      },
    ],
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
