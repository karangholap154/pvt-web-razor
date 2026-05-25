"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "./articles.module.css";
import modalStyles from "../page.module.css"; // Reuse modal styling classes
import { Article } from "../../data/mockData";
import { supabase } from "../../utils/supabaseClient";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

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
            data.map((item) => ({
              id: item.id,
              title: item.title,
              author: item.author,
              date: item.date,
              readTime: item.read_time || "",
              category: item.category as any,
              summary: item.summary || "",
              content: item.content || ""
            }))
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

  // Handle Hash Deep Linking on Mount & Hash Change (runs once we have the articles loaded)
  useEffect(() => {
    if (isLoading || articles.length === 0) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const matched = articles.find((art) => art.id === id);
        if (matched) {
          setActiveArticle(matched);
        }
      }
    };

    // Run on mount or when articles load
    handleHashChange();

    // Listen for changes
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isLoading, articles]);

  // Close reader modal and clear URL hash
  const closeArticle = () => {
    setActiveArticle(null);
    if (typeof window !== "undefined") {
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }
  };

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
            <article className={styles.card} key={art.id} id={art.id}>
              <div className={styles.cardHeader}>
                <span className={styles.categoryTag}>{art.category}</span>
                <span className={styles.meta}>{art.date}</span>
              </div>
              <h2 className={styles.cardTitle}>{art.title}</h2>
              <p className={styles.summary}>{art.summary}</p>
              
              <div className={styles.authorMeta}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>By </span>
                  <span className={styles.authorName}>{art.author}</span>
                </div>
                <span className={styles.readTime}>{art.readTime}</span>
              </div>

              <button
                onClick={() => setActiveArticle(art)}
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

      {/* Modal Reader Overlay */}
      {activeArticle && (
        <div className={modalStyles.modalBackdrop} onClick={closeArticle} id="article-reader-backdrop">
          <div
            className={`${modalStyles.modalContent} ${styles.articleModal}`}
            onClick={(e) => e.stopPropagation()}
            id="article-reader-content-container"
          >
            
            {/* Modal Header */}
            <div className={modalStyles.modalHeader}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span className={styles.categoryTag}>{activeArticle.category}</span>
                <h3 className={modalStyles.modalTitle}>{activeArticle.title}</h3>
              </div>
              <button onClick={closeArticle} className={modalStyles.modalCloseBtn} id="btn-close-reader">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className={modalStyles.modalBody}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                <span>Published by: <strong>{activeArticle.author}</strong></span>
                <span>Date: {activeArticle.date} | {activeArticle.readTime}</span>
              </div>
              
              <div className={styles.articleContent} id="full-article-body">
                {activeArticle.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={modalStyles.modalFooter}>
              <button onClick={closeArticle} className={modalStyles.btnSecondary} id="btn-close-reader-footer">
                Close Reader
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
