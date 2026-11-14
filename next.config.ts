import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.ALLOWED_DEV_ORIGINS
    ? { allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS.split(",").map((s) => s.trim()) }
    : {}),
  serverExternalPackages: ["pdfkit", "pdfjs-dist", "canvas"],
  async redirects() {
    return [
      {
        source: "/notes",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
