import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { buildRssChannel, formatRfc822Date, RssItem } from "@/utils/rssUtils";

export const revalidate = 1800; // Cache on edge for 30 minutes

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";

  try {
    // 1. Fetch latest articles and notes in parallel
    const [articlesResult, notesResult] = await Promise.all([
      supabaseAdmin
        .from("articles")
        .select("id, title, summary, category, created_at")
        .order("created_at", { ascending: false })
        .limit(25),
      supabaseAdmin
        .from("notes")
        .select(`
          id,
          title,
          branch,
          semester,
          university,
          subject,
          price,
          resource_type,
          created_at
        `)
        .order("created_at", { ascending: false })
        .limit(25),
    ]);

    const itemsWithDates: { item: RssItem; timestamp: number }[] = [];

    // 2. Format articles into RSS items
    if (articlesResult.data) {
      for (const article of articlesResult.data) {
        const itemUrl = `${baseUrl}/articles/${article.id}`;
        const timestamp = article.created_at ? new Date(article.created_at).getTime() : 0;
        itemsWithDates.push({
          timestamp,
          item: {
            title: `[Article] ${article.title}`,
            link: itemUrl,
            guid: itemUrl,
            description: article.summary || `Read this engineering article on Private Academy: ${article.title}`,
            pubDate: formatRfc822Date(article.created_at),
            categories: article.category ? [article.category, "Engineering Articles"] : ["Engineering Articles"],
          },
        });
      }
    }

    // 3. Format study notes into RSS items
    if (notesResult.data) {
      for (const note of notesResult.data) {
        const itemUrl = `${baseUrl}/notes/${note.id}`;
        const timestamp = note.created_at ? new Date(note.created_at).getTime() : 0;
        const univPrefix = note.university ? `[${note.university}] ` : "";
        const semPrefix = note.semester ? `(${note.semester}) ` : "";
        const isFree = !note.price || Number(note.price) === 0;
        const priceLabel = isFree ? "Free Resource" : `Paid (₹${note.price})`;

        const desc = `Study Note for ${note.subject || note.title} | University: ${note.university || "General"} | Branch: ${note.branch} | Semester: ${note.semester} | Access: ${priceLabel}`;

        const categories = [
          "Study Notes",
          note.university,
          note.branch,
          note.semester,
        ].filter(Boolean) as string[];

        itemsWithDates.push({
          timestamp,
          item: {
            title: `[Note] ${univPrefix}${semPrefix}${note.title}`,
            link: itemUrl,
            guid: itemUrl,
            description: desc,
            pubDate: formatRfc822Date(note.created_at),
            categories,
          },
        });
      }
    }

    // 4. Sort combined items by most recent
    itemsWithDates.sort((a, b) => b.timestamp - a.timestamp);
    const sortedItems = itemsWithDates.slice(0, 40).map((wrapper) => wrapper.item);

    // 5. Generate channel XML
    const rssXml = buildRssChannel({
      title: "Private Academy - Engineering Study Hub & Notes",
      link: baseUrl,
      description: "Latest verified syllabus study notes, semester question papers, and educational engineering articles.",
      feedUrl: `${baseUrl}/rss.xml`,
      items: sortedItems,
    });

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Error generating master RSS feed:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
