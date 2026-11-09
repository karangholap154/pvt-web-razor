"use client";

import { useState } from "react";
import Link from "next/link";
import { Article } from "../../../data/mockData";
import styles from "./articlesPage.module.css";
import {
  LuArrowLeft,
  LuClock,
  LuCheck,
  LuShare2,
  LuMessageCircle,
} from "react-icons/lu";

interface ArticleDetailsClientProps {
  article: Article;
}

export default function ArticleDetailsClient({ article }: ArticleDetailsClientProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyShareLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Content formatting helper
  const renderFormattedBody = (content: string) => {
    if (!content) return null;

    // Split by double newlines or single newlines
    const paragraphs = content.split(/\n\s*\n/);

    return paragraphs.map((block, idx) => {
      const trimmed = block.trim();

      // Heading 2 check
      if (trimmed.startsWith("## ")) {
        return <h2 key={idx}>{trimmed.replace("## ", "")}</h2>;
      }
      // Heading 3 check
      if (trimmed.startsWith("### ")) {
        return <h3 key={idx}>{trimmed.replace("### ", "")}</h3>;
      }
      // Blockquote check
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={idx}>
            {trimmed.replace(/^>\s*/gm, "")}
          </blockquote>
        );
      }
      // Code block check
      if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
        const codeContent = trimmed.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "");
        return (
          <pre key={idx}>
            <code>{codeContent}</code>
          </pre>
        );
      }

      // Standard paragraph
      return <p key={idx}>{trimmed}</p>;
    });
  };

  const shareText = encodeURIComponent(`Check out "${article.title}" on Private Academy: ${typeof window !== "undefined" ? window.location.href : ""}`);
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  return (
    <div className={styles.pageRoot}>
      <div className={styles.graphPaperGrid} aria-hidden="true" />

      <main className={styles.container}>
        {/* ================================================================
            1. TOP NAVIGATION & BREADCRUMB
            ================================================================ */}
        <div className={styles.topNavRow}>
          <Link href="/articles" className={styles.backLink} id="back-to-articles-link">
            <LuArrowLeft size={14} />
            <span>Back to All Articles</span>
          </Link>

          <span className={styles.breadcrumbChip}>
            ARTICLES / {article.category.toUpperCase()} / SPEC-GUIDE
          </span>
        </div>

        {/* ================================================================
            2. ARTICLE CARD (READING COLUMN 680px)
            ================================================================ */}
        <article className={styles.articleCard} id={`article-${article.id}`}>
          {/* Header Metadata */}
          <header className={styles.headerSection}>
            <div className={styles.metaTopRow}>
              <span className={styles.categoryTag} id="article-details-category">
                {article.category}
              </span>

              <span className={styles.readTimeBadge}>
                <LuClock size={12} />
                <span>{article.readTime}</span>
              </span>

              <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, color: "var(--slate-400, #94A3B8)" }}>
                • SYLLABUS VERIFIED
              </span>
            </div>

            <h1 className={styles.articleTitle} id="article-details-title">
              {article.title}
            </h1>

            <div className={styles.authorRow}>
              <div className={styles.authorAvatar}>PA</div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Private Academy Academic Team</span>
                <span className={styles.authorRole}>Curriculum &amp; Exam Reviewer</span>
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div className={styles.articleBody} id="article-details-body">
            {renderFormattedBody(article.content)}
          </div>

          {/* Share & Feedback Bar */}
          <footer className={styles.shareBar}>
            <span className={styles.shareLabel}>SHARE THIS GUIDE</span>

            <div className={styles.shareActionsRow}>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className={`${styles.shareBtn} ${copied ? styles.shareBtnActive : ""}`}
                id="btn-copy-share-article"
                aria-label="Copy article link"
              >
                {copied ? <LuCheck size={14} /> : <LuShare2 size={14} />}
                <span>{copied ? "Link Copied!" : "Copy Link"}</span>
              </button>

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareBtn}
                aria-label="Share via WhatsApp"
              >
                <LuMessageCircle size={14} style={{ color: "#16A34A" }} />
                <span>WhatsApp</span>
              </a>

              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareBtn}
                aria-label="Share via Twitter / X"
              >
                <span>X / Twitter</span>
              </a>
            </div>
          </footer>
        </article>

        {/* ================================================================
            3. COMMUNITY CONTRIBUTE CALLOUT (DESIGN.MD SECTION 3.14)
            ================================================================ */}
        <section className={styles.communityBanner} aria-label="Contribute Notes & Guides">
          <div className={styles.bannerLeft}>
            <div className={styles.sectionEyebrow} style={{ color: "#B45309" }}>
              ACADEMIC ECOSYSTEM
            </div>
            <h3 className={styles.bannerTitle}>
              Have good handwritten notes or university guides?
            </h3>
            <p className={styles.bannerDesc}>
              Upload your engineering study notes, earn up to 90% revenue share with direct UPI payouts, and help thousands of batchmates clear university finals.
            </p>
          </div>

          <div className={styles.bannerActions}>
            <Link href="/contribute" className={styles.bannerPrimaryBtn}>
              <span>Start Contributing &rarr;</span>
            </Link>
            <Link
              href="/discussions"
              className={styles.backLink}
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <span>Explore Q&amp;A Doubts</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
