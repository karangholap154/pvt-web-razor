import React from "react";
import type { Metadata } from "next";
import { Work_Sans, Caveat } from "next/font/google";
import { BRANCHES } from "../../data/mockData";

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

export const metadata: Metadata = {
  title: "Contact Us | Private Academy Engineering",
  description: "Get in touch with Private Academy Engineering. Request specific study notes, report issues, suggest improvements, or join our community groups.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Private Academy Engineering",
    description: "Get in touch with Private Academy Engineering. Request specific study notes, report issues, suggest improvements, or join our community groups.",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Private Academy Engineering",
    description: "Get in touch with Private Academy Engineering.",
  },
};

// Custom SVG Icons
const FaTelegram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const FaWhatsapp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const FaYoutube = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const FaInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FaLinkedin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FaTwitter = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const SOCIAL_PLATFORMS = [
  {
    name: "Telegram",
    badge: "2.5K+ Members",
    desc: "Instant updates — t.me/mumcomputer",
    link: "https://t.me/mumcomputer",
    color: "#0284c7",
    icon: FaTelegram,
  },
  {
    name: "WhatsApp",
    badge: "Active Group",
    desc: "Study group for discussions",
    link: "https://chat.whatsapp.com/EYeOgxDw8qp6oRMlnTjlfI",
    color: "#16a34a",
    icon: FaWhatsapp,
  },
  {
    name: "YouTube",
    badge: "Video Content",
    desc: "Video tutorials — @pvtacademy",
    link: "https://www.youtube.com/@pvtacademy",
    color: "#dc2626",
    icon: FaYoutube,
  },
  {
    name: "Instagram",
    badge: "Daily Updates",
    desc: "@privateacademy.in",
    link: "https://www.instagram.com/privateacademy.in",
    color: "#db2777",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    badge: "Professional",
    desc: "linkedin.com/company/privateacademy",
    link: "https://www.linkedin.com/company/privateacademy",
    color: "#2563eb",
    icon: FaLinkedin,
  },
  {
    name: "X (Twitter)",
    badge: "Latest News",
    desc: "@PVTAcademyEdu",
    link: "https://x.com/PVTAcademyEdu",
    color: "#1d3557",
    icon: FaTwitter,
  },
];

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Private Academy Engineering",
    "description": "Support for engineering students across all academic queries and study material needs.",
    "url": "https://www.privateacademy.in/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Private Academy Engineering",
      "email": "info@privateacademy.in",
      "location": {
        "@type": "Place",
        "name": "Maharashtra, India",
      },
    },
  };

  const stickyTones = ["nb-tone-yellow", "nb-tone-mint", "nb-tone-pink"];

  return (
    <div className={`${workSans.variable} ${caveat.variable} notebook-page-root`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
        }

        .notebook-page-root a { color: inherit; }

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
          max-width: 900px;
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
          line-height: 1.1;
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

        /* ---------- section heading ---------- */
        .nb-section-title {
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 1.4rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--nb-ink);
        }

        .nb-section-title::before {
          content: "";
          width: 8px;
          height: 8px;
          background: var(--nb-margin);
          border-radius: 50%;
          flex: none;
        }

        section { margin-top: 3.5rem; }

        /* ---------- contact info cards ---------- */
        .nb-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .nb-info-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.4rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 3px 8px rgba(29, 53, 87, 0.05);
        }

        .nb-info-icon {
          color: var(--nb-margin);
          display: flex;
          flex-shrink: 0;
        }

        .nb-info-label {
          font-size: 0.75rem;
          color: var(--nb-ink-dim);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .nb-info-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--nb-ink);
          margin-top: 0.15rem;
          word-break: break-word;
        }

        .nb-info-value a {
          text-decoration: none;
        }

        .nb-info-value a:hover {
          color: var(--nb-margin);
        }

        /* ---------- quick actions ---------- */
        .nb-action-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .nb-action-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-decoration: none;
          box-shadow: 0 3px 8px rgba(29, 53, 87, 0.05);
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .nb-action-card:hover {
          transform: translateY(-3px);
          border-color: var(--nb-ink);
          box-shadow: 0 8px 18px rgba(29, 53, 87, 0.09);
        }

        .nb-action-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nb-action-icon {
          color: var(--nb-margin);
          display: flex;
        }

        .nb-action-badge {
          font-family: var(--font-hand), cursive;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--nb-ink);
          background: var(--nb-yellow);
          padding: 0.15rem 0.55rem;
          transform: rotate(-2deg);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .nb-action-title {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--nb-ink);
        }

        .nb-action-desc {
          font-size: 0.88rem;
          color: var(--nb-ink-dim);
          line-height: 1.5;
        }

        /* ---------- community & social platforms ---------- */
        .nb-social-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }

        .nb-social-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.4rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          text-decoration: none;
          box-shadow: 0 3px 8px rgba(29, 53, 87, 0.05);
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .nb-social-card:hover {
          transform: translateY(-3px);
          border-color: var(--nb-ink);
          box-shadow: 0 8px 18px rgba(29, 53, 87, 0.09);
        }

        .nb-social-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
        }

        .nb-social-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--nb-ink);
          min-width: 0;
        }

        .nb-social-brand span {
          white-space: nowrap;
        }

        .nb-social-badge {
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--nb-paper);
          border: 1px solid var(--nb-card-line);
          padding: 0.2rem 0.55rem;
          color: var(--nb-ink-dim);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .nb-social-desc {
          font-size: 0.9rem;
          color: var(--nb-ink-dim);
          line-height: 1.55;
          flex-grow: 1;
        }

        .nb-social-cta {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--nb-ink);
          margin-top: 0.25rem;
        }

        .nb-social-card:hover .nb-social-cta {
          color: var(--nb-margin);
        }

        /* ---------- supported branches (sticky notes with show more/less) ---------- */
        .nb-sticky-row {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: 0.9rem;
        }

        .nb-sticky {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--nb-ink);
          padding: 0.55rem 1rem;
          box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        }

        .nb-sticky:nth-child(3n+1) { background: var(--nb-yellow); transform: rotate(-2deg); }
        .nb-sticky:nth-child(3n+2) { background: var(--nb-mint); transform: rotate(1.5deg); }
        .nb-sticky:nth-child(3n) { background: var(--nb-pink); transform: rotate(-1deg); }

        .nb-branches-checkbox {
          position: absolute;
          opacity: 0;
          pointer-events: none;
          width: 0;
          height: 0;
          margin: 0;
        }

        .nb-branches-checkbox:not(:checked) ~ .nb-sticky-row .nb-extra-branch {
          display: none !important;
        }

        .nb-sticky-btn {
          cursor: pointer;
          border: 1.5px dashed var(--nb-ink-dim);
          background: #fff !important;
          color: var(--nb-ink);
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          user-select: none;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 600;
          transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
        }

        .nb-sticky-btn:hover {
          background: var(--nb-yellow) !important;
          border-color: var(--nb-ink);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
        }

        .nb-branches-checkbox:focus-visible ~ .nb-sticky-row .nb-sticky-btn {
          outline: 2px solid var(--nb-margin);
          outline-offset: 3px;
        }

        .nb-branches-checkbox:not(:checked) ~ .nb-sticky-row .nb-btn-open {
          display: none;
        }

        .nb-branches-checkbox:not(:checked) ~ .nb-sticky-row .nb-btn-closed {
          display: inline;
        }

        .nb-branches-checkbox:checked ~ .nb-sticky-row .nb-extra-branch {
          display: block;
        }

        .nb-branches-checkbox:checked ~ .nb-sticky-row .nb-btn-closed {
          display: none;
        }

        .nb-branches-checkbox:checked ~ .nb-sticky-row .nb-btn-open {
          display: inline;
        }

        .nb-branches-checkbox:checked ~ .nb-sticky-row .nb-btn-arrow {
          transform: rotate(180deg);
        }

        .nb-btn-arrow {
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        /* ---------- direct contact (tear-off ticket) ---------- */
        .nb-ticket {
          position: relative;
          background: #fff;
          border: 2px dashed var(--nb-card-line);
          padding: 2.25rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .nb-ticket::before,
        .nb-ticket::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 24px;
          height: 24px;
          background: var(--nb-paper);
          border-radius: 50%;
          transform: translateY(-50%);
        }

        .nb-ticket::before { left: -12px; }
        .nb-ticket::after { right: -12px; }

        .nb-direct-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          width: 100%;
          max-width: 600px;
        }

        .nb-direct-item {
          background: var(--nb-paper);
          border: 1px solid var(--nb-card-line);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          align-items: center;
          text-align: center;
        }

        .nb-direct-label {
          font-size: 0.85rem;
          color: var(--nb-ink-dim);
          font-weight: 600;
        }

        .nb-direct-link {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--nb-ink);
          text-decoration: none;
        }

        .nb-direct-link:hover {
          color: var(--nb-margin);
        }

        /* ---------- responsive ---------- */
        @media (max-width: 760px) {
          .nb-spine, .nb-margin-rule { display: none; }
          .nb-shell { padding: 3.25rem 1.25rem 3.5rem; }
          .nb-info-grid, .nb-action-grid, .nb-social-grid {
            grid-template-columns: 1fr;
          }
          .nb-direct-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Decorative spine & red margin rule */}
      <div className="nb-spine" aria-hidden="true" />
      <div className="nb-margin-rule" aria-hidden="true" />

      <div className="nb-shell">
        {/* Header Section */}
        <header id="contact-header">
          <span className="nb-tab">Contact Info</span>
          <h1 id="contact-title">Contact — Private Academy Engineering</h1>
          <p className="nb-tagline" id="contact-desc">
            Support for engineering students across all academic queries and study material needs. Response time: <strong>within 24 hours</strong>.
          </p>
        </header>

        <main id="contact-main">
          {/* Contact Details Grid */}
          <section>
            <h2 className="nb-section-title">Contact Info</h2>
            <div className="nb-info-grid">
              {/* Email */}
              <div className="nb-info-card">
                <div className="nb-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div className="nb-info-label">Email Address</div>
                  <div className="nb-info-value">
                    <a href="mailto:info@privateacademy.in">info@privateacademy.in</a>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="nb-info-card">
                <div className="nb-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="nb-info-label">Location</div>
                  <div className="nb-info-value">Maharashtra, India</div>
                </div>
              </div>

              {/* Response Time */}
              <div className="nb-info-card">
                <div className="nb-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <div className="nb-info-label">Response Time</div>
                  <div className="nb-info-value">Within 24 hours</div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="nb-section-title">Quick Actions</h2>
            <div className="nb-action-grid">
              {[
                {
                  title: "Need Specific Notes?",
                  desc: "Request materials not available on the website",
                  subject: "Note Request",
                },
                {
                  title: "Report an Issue",
                  desc: "Broken link or incorrect info",
                  subject: "Issue Report",
                },
                {
                  title: "Suggest Improvements",
                  desc: "Ideas to improve the platform",
                  subject: "Suggestion",
                },
              ].map((action, idx) => (
                <a
                  key={idx}
                  href={`mailto:info@privateacademy.in?subject=${encodeURIComponent(action.subject)}`}
                  className="nb-action-card"
                >
                  <div className="nb-action-card-header">
                    <span className="nb-action-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <span className="nb-action-badge">{action.subject}</span>
                  </div>
                  <div>
                    <div className="nb-action-title">{action.title}</div>
                    <div className="nb-action-desc">{action.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Community & Social Platforms Grid */}
          <section>
            <h2 className="nb-section-title">Community &amp; Social Platforms</h2>
            <div className="nb-social-grid">
              {SOCIAL_PLATFORMS.map((soc, idx) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={idx}
                    href={soc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nb-social-card"
                  >
                    <div className="nb-social-card-header">
                      <div className="nb-social-brand">
                        <span style={{ color: soc.color, display: "flex" }}>
                          <Icon />
                        </span>
                        <span>{soc.name}</span>
                      </div>
                      <span className="nb-social-badge">{soc.badge}</span>
                    </div>
                    <div className="nb-social-desc">{soc.desc}</div>
                    <div className="nb-social-cta">
                      <span>Join Channel</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          {/* Supported Branches */}
          <section>
            <h2 className="nb-section-title">Supported Branches</h2>
            <input
              type="checkbox"
              id="branches-toggle"
              className="nb-branches-checkbox"
              aria-label="Toggle all supported branches"
            />
            <div className="nb-sticky-row">
              {BRANCHES.slice(0, 6).map((branch, i) => (
                <div className={`nb-sticky ${stickyTones[i % stickyTones.length]}`} key={branch}>
                  {branch}
                </div>
              ))}
              {BRANCHES.slice(6).map((branch, i) => (
                <div className={`nb-sticky nb-extra-branch ${stickyTones[(i + 6) % stickyTones.length]}`} key={branch}>
                  {branch}
                </div>
              ))}
              <label htmlFor="branches-toggle" className="nb-sticky nb-sticky-btn">
                <span className="nb-btn-closed">many more...</span>
                <span className="nb-btn-open">Show less</span>
                <svg
                  className="nb-btn-arrow"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </label>
            </div>
          </section>

          {/* Direct Contact */}
          <section>
            <h2 className="nb-section-title">Direct Contact</h2>
            <div className="nb-ticket">
              <div className="nb-direct-grid">
                <div className="nb-direct-item">
                  <span className="nb-direct-label">Email Support:</span>
                  <a href="mailto:info@privateacademy.in" className="nb-direct-link">
                    info@privateacademy.in
                  </a>
                </div>
                <div className="nb-direct-item">
                  <span className="nb-direct-label">Telegram Channel:</span>
                  <a href="https://t.me/mumcomputer" target="_blank" rel="noopener noreferrer" className="nb-direct-link">
                    t.me/mumcomputer
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
