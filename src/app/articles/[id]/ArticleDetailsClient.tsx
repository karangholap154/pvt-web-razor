"use client";

import { useState } from "react";
import Link from "next/link";
import { Article } from "../../../data/mockData";
import styles from "./articlesPage.module.css";

interface ArticleDetailsClientProps {
  article: Article;
}

export default function ArticleDetailsClient({ article }: ArticleDetailsClientProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyShareLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <Link href="/articles" className={styles.backLink} id="back-to-articles-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Articles
      </Link>

      {/* Article Content Layout */}
      <article className={styles.articleCard}>
        {/* Header Metadata */}
        <header className={styles.headerSection}>
          <span className={styles.categoryTag} id="article-details-category">
            {article.category}
          </span>
          <h1 className={styles.title} id="article-details-title">
            {article.title}
          </h1>
          <div className={styles.metaRow}>
            <span>Written by Academic Expert</span>
            <span className={styles.divider}>•</span>
            <span>{article.readTime}</span>
          </div>
        </header>

        {/* Article Body */}
        <div className={styles.articleBody} id="article-details-body">
          {article.content}
        </div>

        {/* Share Section */}
        <footer className={styles.shareSection}>
          <button
            onClick={handleCopyShareLink}
            className={styles.btnSecondary}
            id="btn-share-article"
          >
            {copied ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Link Copied!
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                Share Article
              </>
            )}
          </button>
        </footer>
      </article>
    </div>
  );
}
