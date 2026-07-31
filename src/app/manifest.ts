import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Private Academy | Engineering Study Hub",
    short_name: "Private Academy",
    description: "Branch-wise engineering notes, semester exam guides, project source code, and video tutorials for Mumbai University, SPPU, DBATU, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#fbbf24",
    icons: [
      {
        src: "/pvtimg.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
