"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./articles.module.css";
import { Article } from "../../data/mockData";
import { supabase } from "../../utils/supabaseClient";

function calculateReadTime(content: string): string {
  const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function generateSummary(content: string): string {
  if (!content) return "";
  const cleanText = content
    .replace(/[#*`_]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
  if (cleanText.length <= 150) return cleanText;
  return cleanText.slice(0, 147) + "...";
}

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter categories
  const categories = ["All", "Guidance", "Tutorial", "Project Ideas", "Software Tips"];

  // Fetch articles from Supabase
  useEffect(() => {
    async function loadArticles() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data) {
          console.warn("Failed to fetch articles from Supabase.", error);
          setArticles([]);
        } else {
          setArticles(
            data.map((item) => {
              const content = item.content || "";
              return {
                id: item.id,
                title: item.title,
                readTime: calculateReadTime(content),
                category: item.category as Article["category"],
                summary: generateSummary(content),
                content: content
              };
            })
          );
        }
      } catch (err) {
        console.error("General error loading articles from Supabase.", err);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadArticles();
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    if (selectedCategory === "All") return articles;
    return articles.filter((art) => art.category === selectedCategory);
  }, [articles, selectedCategory]);

  // Handle Hash Deep Linking redirect to dedicated article page
  useEffect(() => {
    if (isLoading || articles.length === 0) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const matched = articles.find((art) => art.id === id);
        if (matched) {
          router.push(`/articles/${matched.id}`);
        }
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isLoading, articles, router]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header} id="articles-header">
        <h1 className={styles.title} id="articles-title">Educational Articles & Guides</h1>
        <p className={styles.description} id="articles-desc">
          Deep-dives into concepts, exam preparation roadmaps, and final year projects written by engineering experts.
        </p>
      </header>

      {/* Category filters */}
      <nav className={styles.categoryRow} id="category-filter-row" aria-label="Article Categories">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.categoryBtnActive : ""}`}
            id={`btn-category-${cat.toLowerCase().replace(" ", "-")}`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Articles Grid */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
          <div style={{ width: "30px", height: "30px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem auto" }}></div>
          <h3>Loading articles library...</h3>
        </div>
      ) : (
        <main className={styles.grid} id="articles-grid">
          {filteredArticles.map((art) => (
            <article 
              className={styles.card} 
              key={art.id} 
              id={art.id}
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/articles/${art.id}`)}
            >
              <div className={styles.cardHeader}>
                <span className={styles.categoryTag}>{art.category}</span>
              </div>
              <h2 className={styles.cardTitle}>
                <Link
                  href={`/articles/${art.id}`}
                  style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                  onClick={(e) => e.stopPropagation()}
                >
                  {art.title}
                </Link>
              </h2>
              <p className={styles.summary}>{art.summary}</p>
              
              <div className={styles.authorMeta} style={{ justifyContent: "flex-end" }}>
                <span className={styles.readTime}>{art.readTime}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/articles/${art.id}`);
                }}
                className={styles.btnRead}
                style={{ marginTop: "1rem" }}
                id={`btn-read-full-${art.id}`}
              >
                Read Full Article
              </button>
            </article>
          ))}
        </main>
      )}
    </div>
  );
}
