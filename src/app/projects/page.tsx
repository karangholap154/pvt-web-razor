import type { Metadata } from "next";
import { supabaseAdmin } from "../../utils/supabaseAdmin";
import ProjectsClient, { ProjectItem } from "./ProjectsClient";

export const revalidate = 3600; // Cache static page for 1 hour with ISR revalidation

export const metadata: Metadata = {
  title: "Engineering Micro & Mini Projects with Source Code | Private Academy",
  description: "Explore IT engineering micro and mini projects for every semester with full source code, live demos, and documentation.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Engineering Micro & Mini Projects with Source Code | Private Academy",
    description: "Explore IT engineering micro and mini projects for every semester with full source code, live demos, and documentation.",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Micro & Mini Projects with Source Code | Private Academy",
    description: "Explore IT engineering micro and mini projects for every semester with full source code, live demos, and documentation.",
  },
};

export default async function ProjectsPage() {
  let projects: ProjectItem[] = [];
  
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      console.warn("Failed to fetch projects from Supabase.", error);
    } else if (data) {
      projects = data.map((item) => ({
        id: item.id,
        title: item.title,
        branch: item.branch || "Information Technology",
        techStack: item.tech_stack || [],
        description: item.description || "",
        githubUrl: item.github_url || ""
      }));
    }
  } catch (err) {
    console.error("General error loading projects from Supabase.", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Engineering Micro & Mini Projects Showcase",
    "description": "IT engineering micro and mini projects with source code and documentation.",
    "url": "https://www.privateacademy.in/projects",
    "itemListElement": projects.map((proj, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "SoftwareSourceCode",
        "name": proj.title,
        "description": proj.description,
        "programmingLanguage": proj.techStack.join(", "),
        "codeRepository": proj.githubUrl
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectsClient initialProjects={projects} />
    </>
  );
}
