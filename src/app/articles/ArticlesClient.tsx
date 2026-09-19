"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Work_Sans, Caveat } from "next/font/google";
import { Article } from "../../data/mockData";
import { supabase } from "../../utils/supabaseClient";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
});

function calculateReadTime(content: string): string {
  const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

interface ArticlesClientProps {
  initialArticles?: Article[];
}

export default function ArticlesClient({ initialArticles }: ArticlesClientProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [isLoading, setIsLoading] = useState(!initialArticles || initialArticles.length === 0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter categories
  const categories = ["All", "Guidance", "Tutorial", "Project Ideas", "Software Tips"];

  // Fetch articles from Supabase fallback if initialArticles was not provided
  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      return;
    }

    async function loadArticles() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("id, title, category, summary, read_time, created_at")
          .order("created_at", { ascending: false });

        if (error || !data) {
          console.warn("Failed to fetch articles from Supabase.", error);
          setArticles([]);
        } else {
          setArticles(
            data.map((item) => ({
              id: item.id,
              title: item.title,
              readTime: item.read_time || calculateReadTime(""),
              category: item.category as Article["category"],
              summary: item.summary || "",
              content: "", // Content not needed for list view
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
  }, [initialArticles]);

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
    <div className={`${workSans.variable} ${caveat.variable} notebook-page-root`}>
      <style>{`
        .notebook-page-root {
          --nb-paper: #fbfaf4;
          --nb-rule: #dbe6ef;
          --nb-margin: #c94f4f;
          --nb-ink: #1d3557;
          --nb-ink-dim: #5c7089;
          --nb-yellow: #ffe98a;
          --nb-mint: #bfe3d0;
          --nb-pink: #f6c9d3;
          --nb-card-line: #d9d2bd;

          position: relative;
          width: 100%;
          background:
            repeating-linear-gradient(to bottom, transparent 0 31px, var(--nb-rule) 31px 32px),
            var(--nb-paper);
          color: var(--nb-ink);
          font-family: var(--font-body), sans-serif;
          overflow: hidden;
          min-height: 100vh;
        }

        .notebook-page-root a { color: inherit; text-decoration: none; }

        .notebook-page-root a:focus-visible,
        .notebook-page-root button:focus-visible {
          outline: 2px solid var(--nb-margin);
          outline-offset: 3px;
        }

        .nb-spine {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 58px;
          background:
            radial-gradient(circle at 50% 50%, var(--nb-paper) 0 5px, #c7cfd6 5px 6.5px, transparent 6.5px);
          background-size: 100% 34px;
          background-repeat: repeat-y;
          border-right: 1px solid var(--nb-rule);
        }

        .nb-margin-rule {
          position: absolute;
          top: 0;
          left: 92px;
          width: 2px;
          height: 100%;
          background: var(--nb-margin);
          opacity: 0.55;
          transform-origin: top;
          animation: nb-grow-line 1s ease-out both;
        }

        @keyframes nb-grow-line {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .nb-margin-rule { animation: none; transform: scaleY(1); }
        }

        .nb-shell {
          position: relative;
          max-width: 980px;
          margin: 0 auto;
          padding: 4.5rem 1.75rem 5rem 6.5rem;
        }

        /* ---------- header ---------- */
        .nb-tab {
          display: inline-block;
          font-family: var(--font-hand), cursive;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--nb-ink);
          background: var(--nb-yellow);
          padding: 0.2rem 0.9rem 0.35rem;
          transform: rotate(-2.5deg);
          box-shadow: 0 1px 2px rgba(0,0,0,0.12);
          margin-bottom: 1.4rem;
        }

        .notebook-page-root h1 {
          font-weight: 700;
          font-size: clamp(2.2rem, 4.6vw, 3.1rem);
          line-height: 1.12;
          letter-spacing: -0.01em;
          color: var(--nb-ink);
        }

        .nb-tagline {
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--nb-ink-dim);
          max-width: 68ch;
          margin-top: 1.2rem;
        }

        .nb-tagline strong { color: var(--nb-ink); }

        /* ---------- category filter pills ---------- */
        .nb-category-nav {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
          margin-top: 2.5rem;
          margin-bottom: 2.5rem;
          align-items: center;
        }

        .nb-category-btn {
          background: #fff;
          color: var(--nb-ink);
          border: 1px solid var(--nb-card-line);
          padding: 0.45rem 1.1rem;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          user-select: none;
          display: inline-flex;
          align-items: center;
        }

        .nb-category-btn:hover {
          background: var(--nb-yellow);
          border-color: var(--nb-ink);
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
        }

        .nb-category-btn-active {
          background: var(--nb-ink) !important;
          color: #ffffff !important;
          border-color: var(--nb-ink) !important;
          box-shadow: 0 2px 5px rgba(29, 53, 87, 0.2);
          transform: translateY(-1px);
        }

        /* ---------- articles dynamic grid ---------- */
        .nb-articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(420px, 100%), 1fr));
          gap: 1.75rem;
        }

        .nb-article-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.85rem 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 3px 10px rgba(29, 53, 87, 0.05);
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
          cursor: pointer;
        }

        .nb-article-card:hover {
          transform: translateY(-3px);
          border-color: var(--nb-ink);
          box-shadow: 0 10px 22px rgba(29, 53, 87, 0.09);
        }

        .nb-article-card::before {
          content: "";
          position: absolute;
          top: -8px;
          left: 32px;
          width: 50px;
          height: 18px;
          background: rgba(29, 53, 87, 0.1);
          transform: rotate(-2deg);
        }

        .nb-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .nb-category-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--nb-margin);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: var(--nb-paper);
          border: 1px solid var(--nb-card-line);
          padding: 0.2rem 0.6rem;
        }

        .nb-read-time {
          font-family: var(--font-hand), cursive;
          font-size: 1.05rem;
          color: var(--nb-ink-dim);
          white-space: nowrap;
        }

        .nb-card-title {
          font-size: 1.22rem;
          font-weight: 700;
          line-height: 1.4;
          color: var(--nb-ink);
          margin-bottom: 0.6rem;
        }

        .nb-card-title a {
          transition: color 0.15s ease;
        }

        .nb-card-title a:hover {
          color: var(--nb-margin);
        }

        .nb-summary {
          font-size: 0.92rem;
          color: var(--nb-ink-dim);
          line-height: 1.65;
          margin: 0 0 1.25rem 0;
          flex-grow: 1;
        }

        .nb-card-footer {
          border-top: 1px dashed var(--nb-card-line);
          padding-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nb-btn-read {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: var(--nb-ink);
          color: #ffffff !important;
          border: none;
          font-weight: 600;
          font-size: 0.86rem;
          padding: 0.55rem 1.15rem;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .nb-btn-read:hover {
          background: var(--nb-margin);
          transform: translateY(-1px);
        }

        /* ---------- loading & empty states ---------- */
        .nb-status-box {
          text-align: center;
          padding: 4rem 2rem;
          background: #fff;
          border: 1px dashed var(--nb-card-line);
          color: var(--nb-ink-dim);
        }

        .nb-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--nb-card-line);
          border-top-color: var(--nb-margin);
          border-radius: 50%;
          animation: nb-spin 0.8s linear infinite;
          margin: 0 auto 1rem auto;
        }

        @keyframes nb-spin {
          to { transform: rotate(360deg); }
        }

        /* ---------- responsive ---------- */
        @media (max-width: 760px) {
          .nb-spine, .nb-margin-rule { display: none; }
          .nb-shell { padding: 3.25rem 1.25rem 3.5rem; }
          .nb-articles-grid { grid-template-columns: 1fr; }
          .nb-article-card { padding: 1.5rem 1.25rem 1.25rem; }
          .nb-btn-read { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Decorative spine & red margin rule */}
      <div className="nb-spine" aria-hidden="true" />
      <div className="nb-margin-rule" aria-hidden="true" />

      <div className="nb-shell">
        {/* Header Section */}
        <header id="articles-header">
          <span className="nb-tab">Articles &amp; Guides</span>
          <h1 id="articles-title">Educational Articles &amp; Guides</h1>
          <p className="nb-tagline" id="articles-desc">
            Deep-dives into concepts, exam preparation roadmaps, and final year projects written by engineering experts.
          </p>
        </header>

        {/* Category Filter Row */}
        <nav className="nb-category-nav" id="category-filter-row" aria-label="Article Categories">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`nb-category-btn ${selectedCategory === cat ? "nb-category-btn-active" : ""}`}
              id={`btn-category-${cat.toLowerCase().replace(" ", "-")}`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Dynamic Articles Grid */}
        {isLoading ? (
          <div className="nb-status-box">
            <div className="nb-spinner" aria-hidden="true" />
            <h3>Loading articles library...</h3>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="nb-status-box">
            <h3>No articles found in this category.</h3>
          </div>
        ) : (
          <main className="nb-articles-grid" id="articles-grid">
            {filteredArticles.map((art) => (
              <article
                className="nb-article-card"
                key={art.id}
                id={art.id}
                onClick={() => router.push(`/articles/${art.id}`)}
              >
                <div className="nb-card-top">
                  <span className="nb-category-tag">{art.category}</span>
                  <span className="nb-read-time">{art.readTime}</span>
                </div>

                <h2 className="nb-card-title">
                  <Link
                    href={`/articles/${art.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {art.title}
                  </Link>
                </h2>

                <p className="nb-summary">{art.summary}</p>

                <div className="nb-card-footer">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/articles/${art.id}`);
                    }}
                    className="nb-btn-read"
                    id={`btn-read-full-${art.id}`}
                  >
                    Read Full Article
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </main>
        )}
      </div>
    </div>
  );
}
