import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";

  const protectedPaths = [
    "/admin",
    "/admin/",
    "/dashboard",
    "/dashboard/",
    "/login",
    "/login/",
    "/profile",
    "/profile/",
    "/u",
    "/u/",
    "/u/*",
    "/api/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "Amazonbot",
          "Bytespider",
          "Googlebot",
          "Bingbot",
        ],
        allow: "/",
        disallow: protectedPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
