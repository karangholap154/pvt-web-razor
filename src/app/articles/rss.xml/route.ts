import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { buildRssChannel, formatRfc822Date, RssItem } from "@/utils/rssUtils";

export const revalidate = 1800; // Cache on edge for 30 minutes

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    let query = supabaseAdmin
      .from("articles")
      .select("id, title, summary, category, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (category) {
      query = query.ilike("category", `%${category}%`);
    }

    const { data: articles, error } = await query;

    if (error) {
      console.error("Articles RSS database error:", error);
      return new NextResponse("Error fetching articles for RSS", { status: 500 });
    }

    const items: RssItem[] = (articles || []).map((article) => {
      const itemUrl = `${baseUrl}/articles/${article.id}`;
      return {
        title: article.title,
        link: itemUrl,
        guid: itemUrl,
        description: article.summary || `Read "${article.title}" on Private Academy.`,
        categories: article.category ? [article.category, "Educational Articles"] : ["Educational Articles"],
        pubDate: formatRfc822Date(article.created_at),
      };
    });

    const channelTitle = category
      ? `Private Academy Articles - ${category}`
      : "Private Academy - Educational Articles & Engineering Guides";

    const rssXml = buildRssChannel({
      title: channelTitle,
      link: `${baseUrl}/articles`,
      description: "Deep-dives into engineering concepts, exam preparation roadmaps, and final year project guides.",
      feedUrl: `${baseUrl}/articles/rss.xml`,
      items,
    });

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Articles RSS generation error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
