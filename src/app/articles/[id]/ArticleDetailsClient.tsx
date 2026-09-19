"use client";

import { useState } from "react";
import Link from "next/link";
import { Work_Sans, Caveat } from "next/font/google";
import { Article } from "../../../data/mockData";

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
          max-width: 860px;
          margin: 0 auto;
          padding: 4rem 1.75rem 6rem 6.5rem;
        }

        /* ---------- back navigation ---------- */
        .nb-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--nb-ink);
          font-size: 0.92rem;
          font-weight: 600;
          margin-bottom: 2rem;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .nb-back-link:hover {
          color: var(--nb-margin);
          transform: translateX(-3px);
        }

        /* ---------- article reading card ---------- */
        .nb-article-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          border-radius: 2px;
          padding: 3rem 2.5rem 2.5rem;
          box-shadow: 0 4px 18px rgba(29, 53, 87, 0.06);
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .nb-article-card::before {
          content: "";
          position: absolute;
          top: -8px;
          left: 40px;
          width: 58px;
          height: 18px;
          background: rgba(29, 53, 87, 0.12);
          transform: rotate(-2deg);
        }

        .nb-header-section {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          border-bottom: 1px dashed var(--nb-card-line);
          padding-bottom: 1.75rem;
        }

        .nb-category-tag {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--nb-margin);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--nb-paper);
          border: 1px solid var(--nb-card-line);
          padding: 0.25rem 0.65rem;
          align-self: flex-start;
        }

        .nb-article-title {
          font-size: clamp(1.85rem, 4.5vw, 2.5rem);
          font-weight: 800;
          line-height: 1.22;
          letter-spacing: -0.02em;
          color: var(--nb-ink);
          margin: 0;
        }

        .nb-meta-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: center;
          font-size: 0.88rem;
          color: var(--nb-ink-dim);
          margin-top: 0.25rem;
        }

        .nb-meta-read {
          font-family: var(--font-hand), cursive;
          font-size: 1.1rem;
          color: var(--nb-ink);
        }

        .nb-meta-divider {
          color: var(--nb-card-line);
        }

        /* ---------- article readable body ---------- */
        .nb-article-body {
          font-size: 1.06rem;
          line-height: 1.85;
          color: var(--nb-ink);
          white-space: pre-line;
          word-break: break-word;
        }

        .nb-article-body h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--nb-ink);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }

        .nb-article-body h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--nb-ink);
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        /* ---------- footer share section ---------- */
        .nb-share-section {
          border-top: 1px dashed var(--nb-card-line);
          padding-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
        }

        .nb-btn-secondary {
          background: #fff;
          color: var(--nb-ink);
          font-weight: 600;
          font-size: 0.88rem;
          padding: 0.65rem 1.25rem;
          border: 1px solid var(--nb-card-line);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .nb-btn-secondary:hover {
          border-color: var(--nb-ink);
          background: var(--nb-paper);
          transform: translateY(-1px);
        }

        /* ---------- responsive ---------- */
        @media (max-width: 760px) {
          .nb-spine, .nb-margin-rule { display: none; }
          .nb-shell { padding: 2.75rem 1.25rem 4rem; }
          .nb-article-card { padding: 2rem 1.5rem 1.75rem; }
        }

        @media (max-width: 480px) {
          .nb-article-card { padding: 1.5rem 1.15rem 1.25rem; gap: 1.5rem; }
          .nb-article-body { font-size: 0.98rem; line-height: 1.75; }
          .nb-btn-secondary { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Decorative spine & red margin rule */}
      <div className="nb-spine" aria-hidden="true" />
      <div className="nb-margin-rule" aria-hidden="true" />

      <div className="nb-shell">
        {/* Back Link */}
        <Link href="/articles" className="nb-back-link" id="back-to-articles-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Articles
        </Link>

        {/* Reading Article Card */}
        <article className="nb-article-card">
          <header className="nb-header-section">
            <span className="nb-category-tag" id="article-details-category">
              {article.category}
            </span>
            <h1 className="nb-article-title" id="article-details-title">
              {article.title}
            </h1>
            <div className="nb-meta-row">
              <span>Written by Academic Expert</span>
              <span className="nb-meta-divider" aria-hidden="true">•</span>
              <span className="nb-meta-read">{article.readTime}</span>
            </div>
          </header>

          <div className="nb-article-body" id="article-details-body">
            {article.content}
          </div>

          <footer className="nb-share-section">
            <button
              onClick={handleCopyShareLink}
              className="nb-btn-secondary"
              id="btn-share-article"
            >
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--nb-margin)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Link Copied!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  Share Article
                </>
              )}
            </button>
          </footer>
        </article>
      </div>
    </div>
  );
}
