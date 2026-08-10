import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Console | Private Academy",
  robots: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};
import { checkIsAdmin } from "../../utils/auth";
import { createSupabaseServerClient } from "../../utils/supabaseServer";
import { supabaseAdmin } from "../../utils/supabaseAdmin";
import AdminConsole from "./AdminConsole";
import styles from "./admin.module.css";
import { Note, Article } from "../../data/mockData";
import { Tables } from "../../types/supabase";

interface ProjectDb {
  id: string;
  title: string;
  branch: string;
  tech_stack: string[] | null;
  description: string;
  github_url: string;
}

export default async function AdminPage() {
  // 1. Session check via Supabase Auth
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    redirect("/login");
  }

  // 2. Authorization check: Is whitelisted admin?
  const authorized = checkIsAdmin(user.email);
  if (!authorized) {
    return (
      <div className={styles.container}>
        <div className={styles.deniedCard}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ margin: "0 auto" }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h2 className={styles.deniedTitle}>Access Denied</h2>
          <p className={styles.deniedText}>
            Your email address <strong style={{ color: "var(--text-primary)" }}>{user.email}</strong> is not authorized to access the Admin Panel console. Please contact the administrator.
          </p>
          <Link href="/" className={styles.btnCancel} style={{ textDecoration: "none", display: "inline-block" }}>
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // 3. Fetch all database tables
  let notes: Note[] = [];
  let articles: Article[] = [];
  let projects: ProjectDb[] = [];
  let purchases: Tables<"purchases">[] = [];
  let users: Tables<"users">[] = [];

  try {
    // Fetch notes
    const { data: dbNotes } = await supabase
      .from("notes")
      .select("*")
      .order("title", { ascending: true });

    if (dbNotes) {
      notes = dbNotes.map((item) => ({
        id: item.id,
        title: item.title,
        university: item.university || undefined,
        branch: item.branch as Note["branch"],
        semester: item.semester as Note["semester"],
        description: `${item.title} - ${item.branch} Engineering, ${item.semester} | ${item.university || ""}`,
        downloadUrl: item.download_url || "",
        videoUrl: item.video_url || "",
        price: item.price ? Number(item.price) : 0,
      }));
    }

    // Fetch articles
    const { data: dbArticles } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbArticles) {
      articles = dbArticles.map((item) => {
        const content = item.content || "";
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;

        const cleanText = content
          .replace(/[#*`_]/g, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .trim();
        const summary = cleanText.length <= 150 ? cleanText : cleanText.slice(0, 147) + "...";

        return {
          id: item.id,
          title: item.title,
          readTime,
          category: item.category as Article["category"],
          summary,
          content,
        };
      });
    }

    // Fetch projects
    const { data: dbProjects } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbProjects) {
      projects = dbProjects.map((item) => ({
        id: item.id,
        title: item.title,
        branch: item.branch,
        tech_stack: item.tech_stack,
        description: item.description || "",
        github_url: item.github_url || "",
      }));
    }

    // Fetch purchases for analytics
    const { data: dbPurchases } = await supabaseAdmin
      .from("purchases")
      .select("*")
      .order("created_at", { ascending: false });
    if (dbPurchases) {
      purchases = dbPurchases;
    }

    // Fetch users for analytics
    const { data: dbUsers } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (dbUsers) {
      users = dbUsers;
    }
  } catch (err) {
    console.error("Admin fetch tables failed:", err);
  }

  return (
    <AdminConsole
      initialNotes={notes}
      initialArticles={articles}
      initialProjects={projects}
      initialPurchases={purchases}
      initialUsers={users}
    />
  );
}
