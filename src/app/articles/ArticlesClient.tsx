"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./articles.module.css";
import { Article } from "../../data/mockData";
import { supabase } from "../../utils/supabaseClient";
import { calculateReadTime } from "@/utils/text";
import {
  LuBookOpen,
  LuClock,
  LuSearch,
  LuX,
  LuRss,
  LuArrowRight,
  LuCheck,
} from "react-icons/lu";

interface ArticlesClientProps {
  initialArticles?: Article[];
}

// Fallback curated engineering study guides if database has not been populated
const DEFAULT_ARTICLES: Article[] = [
  {
    id: "art-mu-applied-math-roadmap",
    title: "Mumbai University Applied Mathematics: Strategy to Score 70+ in Semester Finals",
    category: "Guidance",
    readTime: "6 min read",
    summary: "Comprehensive unit-wise breakdown, scoring question trends, Laplace transforms shortcuts, and matrix eigen value proofs tailored for state university syllabus.",
    content: "Applied Mathematics IV is notorious across engineering colleges for its rigorous syllabus...",
  },
  {
    id: "art-computer-networks-3-days",
    title: "How to Clear Computer Networks (CN) in 3 Days Before University Finals",
    category: "Guidance",
    readTime: "5 min read",
    summary: "The exact 72-hour revision playbook covering OSI vs TCP/IP, IP subnetting math, routing protocols, and high-frequency university viva diagrams.",
    content: "When you have 72 hours before your Computer Networks theory examination...",
  },
  {
    id: "art-capstone-project-selection",
    title: "Final Year Engineering Project Selection: The 5-Criteria Evaluation Framework",
    category: "Project Ideas",
    readTime: "8 min read",
    summary: "How to pick a micro or major capstone project that satisfies university rubrics, impresses external viva examiners, and builds a real portfolio.",
    content: "Every year thousands of 7th-semester engineering students fall into the trap of picking over-ambitious projects...",
  },
  {
    id: "art-git-github-viva-mastery",
    title: "Mastering Git, GitHub & Branch Workflows for Practical Lab Vivas",
    category: "Tutorial",
    readTime: "7 min read",
    summary: "Everything external examiners test during web development and open-source lab vivas: merge conflicts, rebase vs merge, and GitHub pull requests.",
    content: "During engineering practical exams, examiners rarely ask you to recite definitions...",
  },
  {
    id: "art-docker-low-spec-laptops",
    title: "Setting Up Lightweight Docker & Container Environments on Student Laptops",
    category: "Software Tips",
    readTime: "5 min read",
    summary: "Performance optimization tweaks, RAM capping, and Alpine Linux container setups to run modern developer stacks smoothly on 8GB RAM laptops.",
    content: "Engineering students often struggle with resource-heavy virtualization during lab assignments...",
  },
  {
    id: "art-dbms-normalization-simplified",
    title: "Database Normalization (1NF to BCNF) Made Visual with Relational Schemas",
    category: "Tutorial",
    readTime: "6 min read",
    summary: "Step-by-step breakdown of functional dependencies, anomaly elimination, and schema decomposition with real-world student portal tables.",
    content: "Normalization questions appear in almost every engineering DBMS semester question paper...",
  },
];

const CATEGORIES = ["All", "Guidance", "Tutorial", "Project Ideas", "Software Tips"];

export default function ArticlesClient({ initialArticles }: ArticlesClientProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(
    initialArticles && initialArticles.length > 0 ? initialArticles : DEFAULT_ARTICLES
  );
  const [isLoading, setIsLoading] = useState(!initialArticles || initialArticles.length === 0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

        if (error || !data || data.length === 0) {
          // Keep rich default fallback articles
          setArticles(DEFAULT_ARTICLES);
        } else {
          setArticles(
            data.map((item) => ({
              id: item.id,
              title: item.title,
              readTime: item.read_time || calculateReadTime(""),
              category: item.category as Article["category"],
              summary: item.summary || "",
              content: "",
            }))
          );
        }
      } catch (err) {
        console.error("General error loading articles from Supabase.", err);
        setArticles(DEFAULT_ARTICLES);
      } finally {
        setIsLoading(false);
      }
    }

    loadArticles();
  }, [initialArticles]);

  // Filter articles based on Category and Search Query
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory =
        selectedCategory === "All" || art.category === selectedCategory;

      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchSummary = (art.summary || "").toLowerCase().includes(q);
        const matchCat = (art.category || "").toLowerCase().includes(q);
        matchesSearch = matchTitle || matchSummary || matchCat;
      }

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Featured article is the first filtered item, remaining are displayed in the 3-column grid
  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : [];

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
    <div className={styles.pageRoot}>
      <div className={styles.graphPaperGrid} aria-hidden="true" />

      <main className={styles.container}>
        {/* ================================================================
            1. HERO HEADER (DESIGN.MD SECTION 4.10)
            ================================================================ */}
        <header className={styles.heroHeader} aria-labelledby="articles-page-title">
          <div className={styles.headerTopRow}>
            <div className={styles.eyebrowTag}>
              <LuBookOpen size={13} />
              <span>ENGINEERING REPOSITORY • OPEN GUIDES</span>
            </div>

            <Link
              href="/articles/rss.xml"
              className={styles.rssHeaderLink}
              title="Subscribe to RSS Feed"
            >
              <LuRss size={12} style={{ color: "#EA580C" }} />
              <span>RSS Feed ↗</span>
            </Link>
          </div>

          <h1 id="articles-page-title" className={styles.heroTitle}>
            Engineering Articles &amp; <mark className={styles.highlighter}>Exam Guides</mark>.
          </h1>

          <p className={styles.heroTagline}>
            Deep-dives into syllabus concepts, university examination roadmaps, and final year project guides written by senior student contributors and academic experts.
          </p>
        </header>

        {/* ================================================================
            2. CONTROLS DESK (SEARCH & CATEGORY FILTERS)
            ================================================================ */}
        <section className={styles.controlsDesk} aria-label="Article Filters">
          <div className={styles.searchRow}>
            <div className={styles.searchBox}>
              <LuSearch size={16} style={{ color: "#94A3B8", flexShrink: 0 }} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search articles by keyword, syllabus topic, or exam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search articles"
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <LuX size={15} />
                </button>
              )}
            </div>

            <span className={styles.articleCountBadge}>
              {filteredArticles.length} {filteredArticles.length === 1 ? "GUIDE" : "GUIDES"} AVAILABLE
            </span>
          </div>

          {/* Category Selector Pills */}
          <nav className={styles.categoryRow} aria-label="Filter by Topic">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`${styles.categoryBtn} ${isActive ? styles.categoryBtnActive : ""}`}
                  id={`btn-category-${cat.toLowerCase().replace(" ", "-")}`}
                >
                  {isActive && <LuCheck size={12} />}
                  <span>{cat === "All" ? "All Topics" : cat}</span>
                </button>
              );
            })}
          </nav>
        </section>

        {/* ================================================================
            3. FEATURED ARTICLE HERO SHEET (DESIGN.MD SECTION 4.10)
            ================================================================ */}
        {featuredArticle && (
          <section className={styles.featuredContainer} aria-labelledby="featured-guide-heading">
            <span id="featured-guide-heading" className={styles.featuredEyebrow}>
              FEATURED ACADEMIC GUIDE
            </span>

            <Link
              href={`/articles/${featuredArticle.id}`}
              className={styles.featuredCard}
              id={`featured-card-${featuredArticle.id}`}
            >
              <div className={styles.featuredMetaRow}>
                <span className={styles.categoryTag}>{featuredArticle.category}</span>
                <span className={styles.readTimeBadge}>
                  <LuClock size={12} />
                  <span>{featuredArticle.readTime}</span>
                </span>
                <span className={styles.readTimeBadge}>• PRIVATE ACADEMY EDITORIAL</span>
              </div>

              <h2 className={styles.featuredTitle}>{featuredArticle.title}</h2>

              <p className={styles.featuredSummary}>{featuredArticle.summary}</p>

              <div className={styles.featuredFooter}>
                <span className={styles.readActionBtn}>
                  <span>Read Complete Guide</span>
                  <LuArrowRight size={14} />
                </span>
                <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, color: "var(--slate-400, #94A3B8)" }}>
                  SYLLABUS VERIFIED
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* ================================================================
            4. 3-COLUMN ARTICLE GRID (DESIGN.MD SECTION 4.10)
            ================================================================ */}
        <section className={styles.articlesSection} aria-labelledby="all-guides-heading">
          {gridArticles.length > 0 && (
            <div className={styles.featuredEyebrow} id="all-guides-heading">
              ACADEMIC REPOSITORY ({gridArticles.length})
            </div>
          )}

          {filteredArticles.length === 0 ? (
            <div className={styles.emptyStateContainer}>
              <div className={styles.emptyStateSheet} aria-hidden="true">
                <div className={styles.emptySkeletonBar} style={{ width: "80%" }} />
                <div className={styles.emptySkeletonBar} style={{ width: "60%" }} />
                <div className={styles.emptySkeletonBar} style={{ width: "70%" }} />
              </div>
              <h3 className={styles.emptyTitle}>No matching articles found</h3>
              <p className={styles.emptySubtitle}>
                We couldn&apos;t find any articles matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try resetting your filters or search terms.
              </p>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.grid} id="articles-grid">
              {gridArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/articles/${art.id}`}
                  className={styles.card}
                  id={`article-card-${art.id}`}
                >
                  {/* 16:9 Cover Thumbnail Header */}
                  <div className={styles.cardCoverThumbnail} aria-hidden="true">
                    <div className={styles.coverGridPattern} />
                    <div className={styles.coverMarginLine} />

                    <div className={styles.coverHeaderPill}>
                      <span className={styles.categoryTag}>{art.category}</span>
                      <span className={styles.readTimeBadge}>
                        <LuClock size={11} />
                        <span>{art.readTime}</span>
                      </span>
                    </div>

                    <div className={styles.coverWatermark}>VOL-01 • PRIVATE ACADEMY</div>
                  </div>

                  {/* Card Body */}
                  <div className={styles.cardBody}>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{art.title}</h3>
                      <p className={styles.cardSummary}>{art.summary}</p>
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.cardReadLink}>
                        <span>Read Guide</span>
                        <LuArrowRight size={13} />
                      </span>
                      <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, color: "var(--slate-400, #94A3B8)" }}>
                        EXAM READY
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
