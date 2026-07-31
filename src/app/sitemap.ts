import type { MetadataRoute } from "next";
import { supabaseAdmin } from "../utils/supabaseAdmin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";
  const currentDate = new Date();

  // Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contribute`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-condition`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic routes fetched from Supabase
  let noteRoutes: MetadataRoute.Sitemap = [];
  let articleRoutes: MetadataRoute.Sitemap = [];
  let profileRoutes: MetadataRoute.Sitemap = [];

  try {
    // 1. Fetch public notes
    const { data: dbNotes } = await supabaseAdmin
      .from("notes")
      .select("id, created_at");

    if (dbNotes && dbNotes.length > 0) {
      noteRoutes = dbNotes.map((note) => ({
        url: `${baseUrl}/notes/${note.id}`,
        lastModified: note.created_at ? new Date(note.created_at) : currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }

    // 2. Fetch public articles
    const { data: dbArticles } = await supabaseAdmin
      .from("articles")
      .select("id, created_at");

    if (dbArticles && dbArticles.length > 0) {
      articleRoutes = dbArticles.map((article) => ({
        url: `${baseUrl}/articles/${article.id}`,
        lastModified: article.created_at ? new Date(article.created_at) : currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }

    // 3. Fetch public usernames
    const { data: dbUsers } = await supabaseAdmin
      .from("users")
      .select("username, created_at");

    if (dbUsers && dbUsers.length > 0) {
      profileRoutes = dbUsers
        .filter((user) => Boolean(user.username))
        .map((user) => ({
          url: `${baseUrl}/u/${encodeURIComponent(user.username!)}`,
          lastModified: user.created_at ? new Date(user.created_at) : currentDate,
          changeFrequency: "weekly",
          priority: 0.6,
        }));
    }
  } catch (err) {
    console.error("Error generating dynamic sitemap entries:", err);
  }

  return [...staticRoutes, ...noteRoutes, ...articleRoutes, ...profileRoutes];
}
