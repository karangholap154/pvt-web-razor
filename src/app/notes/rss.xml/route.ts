import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { buildRssChannel, formatRfc822Date, RssItem } from "@/utils/rssUtils";

export const revalidate = 1800; // Cache on edge for 30 minutes

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";
  const { searchParams } = new URL(request.url);

  const branch = searchParams.get("branch");
  const university = searchParams.get("university");
  const semester = searchParams.get("semester");

  try {
    let query = supabaseAdmin
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
        created_at,
        users:contributor_id (full_name, username)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (branch) {
      query = query.ilike("branch", `%${branch}%`);
    }
    if (university) {
      query = query.ilike("university", `%${university}%`);
    }
    if (semester) {
      query = query.ilike("semester", `%${semester}%`);
    }

    const { data: notes, error } = await query;

    if (error) {
      console.error("Notes RSS database error:", error);
      return new NextResponse("Error fetching notes for RSS", { status: 500 });
    }

    const items: RssItem[] = (notes || []).map((item) => {
      const itemUrl = `${baseUrl}/notes/${item.id}`;
      const univTag = item.university ? `[${item.university}] ` : "";
      const semTag = item.semester ? `(${item.semester}) ` : "";
      const isFree = !item.price || Number(item.price) === 0;
      const priceLabel = isFree ? "Free Resource" : `Paid (₹${item.price})`;

      const authorObj = Array.isArray(item.users) ? item.users[0] : item.users;
      const author = authorObj?.full_name || authorObj?.username || "Private Academy Faculty";

      const categories = [
        "Study Notes",
        item.university,
        item.branch,
        item.semester,
        item.subject,
      ].filter(Boolean) as string[];

      const description = `
        <p><strong>Subject:</strong> ${item.subject || item.title}</p>
        <p><strong>University:</strong> ${item.university || "General Engineering"}</p>
        <p><strong>Branch:</strong> ${item.branch} | <strong>Semester:</strong> ${item.semester}</p>
        <p><strong>Access:</strong> ${priceLabel}</p>
        <p><a href="${itemUrl}">View details and download on Private Academy</a></p>
      `.trim();

      return {
        title: `${univTag}${semTag}${item.title}`,
        link: itemUrl,
        guid: itemUrl,
        description,
        author,
        categories,
        pubDate: formatRfc822Date(item.created_at),
      };
    });

    const filterLabels = [university, branch, semester].filter(Boolean);
    const channelTitle = filterLabels.length > 0
      ? `Private Academy Notes (${filterLabels.join(" - ")})`
      : "Private Academy - Engineering Study Notes & Guides";

    const rssXml = buildRssChannel({
      title: channelTitle,
      link: `${baseUrl}/notes`,
      description: "Verified engineering syllabus notes, semester question papers, and study guides.",
      feedUrl: `${baseUrl}/notes/rss.xml`,
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
    console.error("Notes RSS generation error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
