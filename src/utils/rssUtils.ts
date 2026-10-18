/**
 * Shared utility functions for generating compliant RSS 2.0 XML feeds.
 */

export function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function formatRfc822Date(dateString?: string | null): string {
  if (!dateString) return new Date().toUTCString();
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

export interface RssItem {
  title: string;
  link: string;
  guid: string;
  description: string;
  pubDate: string;
  categories?: string[];
  author?: string;
}

export interface RssChannelOptions {
  title: string;
  link: string;
  description: string;
  feedUrl: string;
  language?: string;
  items: RssItem[];
}

export function buildRssChannel({
  title,
  link,
  description,
  feedUrl,
  language = "en-in",
  items,
}: RssChannelOptions): string {
  const renderedItems = items
    .map((item) => {
      const categoriesXml = (item.categories || [])
        .filter(Boolean)
        .map((cat) => `      <category>${escapeXml(cat)}</category>`)
        .join("\n");

      const authorXml = item.author
        ? `      <author><![CDATA[${item.author}]]></author>\n`
        : "";

      return `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <description><![CDATA[${item.description}]]></description>
${authorXml}${categoriesXml ? categoriesXml + "\n" : ""}      <pubDate>${item.pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${link}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${renderedItems}
  </channel>
</rss>`.trim();
}
