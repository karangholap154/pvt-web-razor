import type { Metadata } from "next";
import { BRANCHES } from "../../data/mockData";
import { Work_Sans, Caveat } from "next/font/google";

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
  title: "About Us | Private Academy Engineering",
  description: "Learn about Private Academy Engineering — a student-first engineering study platform built to provide branch-wise notes, exam preparation guides, and video walkthroughs.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Private Academy Engineering",
    description: "A comprehensive study resource platform built for engineering students across leading universities.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Private Academy Engineering",
    description: "A comprehensive study resource platform built for engineering students across leading universities.",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Private Academy Engineering",
    "description": "A comprehensive study resource platform built for engineering students across leading universities.",
    "url": "https://www.privateacademy.in/about",
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "Private Academy Engineering",
      "founder": {
        "@type": "Person",
        "name": "Karan Gholap",
        "jobTitle": "Founder & Software Developer",
        "sameAs": [
          "https://linkedin.com/in/karangholap",
          "https://x.com/TheKaranGholap",
          "https://peerlist.io/karangholap",
          "https://www.karangholap.com/"
        ]
      }
    }
  };

  const universities = [
    { name: "Mumbai University", abbr: "MU" },
    { name: "Savitribai Phule Pune University", abbr: "SPPU" },
    { name: "Nagpur University", abbr: "NU" },
    { name: "Amravati University", abbr: "AU" },
    { name: "Dr. Babasaheb Ambedkar Technological University", abbr: "DBATU" },
    { name: "Shivaji University", abbr: "SUK" }
  ];

  const stats = [
    { num: "2500+", label: "Students helped" },
    { num: "50K+", label: "Downloads" },
    { num: `${BRANCHES.length}+`, label: "Branches covered" },
    { num: "98%", label: "Satisfaction rate" }
  ];

  const values = [
    {
      title: "Excellence",
      desc: "Highest quality, hand-picked study materials to ensure exam readiness.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      title: "Accessibility",
      desc: "Tailored education and organized guides accessible to all registered students.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: "Innovation",
      desc: "Constantly improving the platform tools, interfaces, and experience.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
    {
      title: "Impact",
      desc: "Focused on helping thousands of students achieve their academic goals.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    }
  ];

  const features = [
    "Meticulously curated, syllabus-aligned study notes from top engineering programs",
    "University personalization — select your university once to customize your entire notes dashboard",
    "Organized by branch and semester for absolute ease of navigation",
    "Integrated learning — download high-quality PDFs and watch video walkthroughs on the same screen"
  ];

  const faqs = [
    {
      q: "Are the notes aligned with university syllabus?",
      a: "Yes. All uploaded notes are periodically reviewed by senior contributors to match current university syllabus requirements."
    },
    {
      q: "Can I view PDF previews before downloading?",
      a: "Yes! Every note details page allows you to preview the first 3 pages of the PDF before unlocking or downloading."
    },
    {
      q: "Is checkout secure?",
      a: "Yes. We use Razorpay with PCI-DSS compliance. We never capture or store your payment credentials on our database."
    },
    {
      q: "Can I upload my own study notes?",
      a: "Yes! You can share your verified study notes and earn 70% to 90% revenue share with direct UPI payouts."
    }
  ];

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
          max-width: 62ch;
          margin-top: 1.2rem;
        }

        .nb-tagline strong { color: var(--nb-ink); }

        /* ---------- section heading (shared) ---------- */
        .nb-section-title {
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 1.4rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .nb-section-title::before {
          content: "";
          width: 8px;
          height: 8px;
          background: var(--nb-margin);
          border-radius: 50%;
          flex: none;
        }

        section { margin-top: 4rem; }

        /* ---------- stats ---------- */
        .nb-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1.5rem;
        }

        .nb-stat-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.5rem 1.25rem 1.25rem;
          text-align: center;
          box-shadow: 0 3px 8px rgba(29, 53, 87, 0.06);
        }

        .nb-stat-card:nth-child(odd) { transform: rotate(-1.2deg); }
        .nb-stat-card:nth-child(even) { transform: rotate(1.2deg); }

        .nb-stat-card::before {
          content: "";
          position: absolute;
          top: -0.5rem;
          left: 50%;
          transform: translateX(-50%) rotate(-3deg);
          width: 46px;
          height: 16px;
          background: rgba(29, 53, 87, 0.1);
        }

        .nb-stat-num {
          font-size: 2rem;
          font-weight: 700;
          color: var(--nb-ink);
        }

        .nb-stat-label {
          font-family: var(--font-hand), cursive;
          font-size: 1.15rem;
          color: var(--nb-ink-dim);
          margin-top: 0.15rem;
        }

        /* ---------- branches & universities ---------- */
        .nb-notes { display: flex; flex-direction: column; gap: 2.5rem; }

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

        .nb-tab-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          border-left: 4px solid var(--nb-ink);
          padding: 0.5rem 1rem;
          font-size: 0.88rem;
        }

        .nb-tab-badge b {
          font-size: 0.75rem;
          background: var(--nb-ink);
          color: #fff;
          padding: 0.1rem 0.4rem;
        }

        /* ---------- values (flashcards) ---------- */
        .nb-values {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 1.4rem;
        }

        .nb-flashcard {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.5rem;
          overflow: hidden;
        }

        .nb-flashcard::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 20px 20px 0;
          border-color: transparent var(--nb-paper) transparent transparent;
          filter: drop-shadow(-1px 1px 1px rgba(0,0,0,0.08));
        }

        .nb-flashcard-icon {
          color: var(--nb-margin);
          margin-bottom: 0.9rem;
        }

        .nb-flashcard h3 {
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 0.4rem;
        }

        .nb-flashcard p {
          font-size: 0.87rem;
          line-height: 1.6;
          color: var(--nb-ink-dim);
        }

        /* ---------- features checklist ---------- */
        .nb-features { display: flex; flex-direction: column; gap: 0.9rem; }

        .nb-feature {
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          padding-bottom: 0.9rem;
          border-bottom: 1px dashed var(--nb-card-line);
          font-size: 0.95rem;
          line-height: 1.55;
        }

        .nb-feature:last-child { border-bottom: none; }

        .nb-check { flex: none; margin-top: 0.15rem; color: var(--nb-margin); }

        /* ---------- founder id card ---------- */
        .nb-id-card {
          position: relative;
          max-width: 480px;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          box-shadow: 0 8px 20px rgba(29, 53, 87, 0.1);
        }

        .nb-id-strap {
          height: 14px;
          background: var(--nb-ink);
          position: relative;
        }

        .nb-id-strap::before {
          content: "";
          position: absolute;
          top: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 26px;
          height: 6px;
          border-radius: 3px;
          background: var(--nb-paper);
        }

        .nb-id-body {
          position: relative;
          z-index: 1;
          padding: 1.75rem 1.75rem 2rem;
          text-align: center;
        }

        .nb-id-avatar {
          position: relative;
          z-index: 2;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          margin: -3.4rem auto 1rem;
          background: var(--nb-yellow);
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--nb-ink);
        }

        .nb-id-name { font-weight: 700; font-size: 1.2rem; }

        .nb-id-role {
          font-family: var(--font-hand), cursive;
          font-size: 1.1rem;
          color: var(--nb-margin);
          margin-top: 0.1rem;
        }

        .nb-id-bio {
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--nb-ink-dim);
          margin-top: 0.9rem;
        }

        .nb-id-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
        }

        .nb-id-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid var(--nb-card-line);
          padding: 0.4rem 0.8rem;
        }

        .nb-id-link:hover { border-color: var(--nb-ink); }

        /* ---------- faq ---------- */
        .nb-faq { display: flex; flex-direction: column; gap: 1.5rem; }

        .nb-faq-item { display: flex; gap: 1rem; }

        .nb-faq-q-mark {
          flex: none;
          font-family: var(--font-hand), cursive;
          font-size: 1.6rem;
          color: var(--nb-margin);
          line-height: 1;
        }

        .nb-faq-q { font-weight: 700; font-size: 0.98rem; margin-bottom: 0.35rem; }
        .nb-faq-a { font-size: 0.88rem; line-height: 1.6; color: var(--nb-ink-dim); }

        /* ---------- contact (tear-off ticket) ---------- */
        .nb-ticket {
          position: relative;
          background: #fff;
          border: 2px dashed var(--nb-card-line);
          padding: 2.25rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
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

        .nb-ticket h2 { font-weight: 700; font-size: 1.2rem; }

        .nb-ticket p {
          font-size: 0.92rem;
          color: var(--nb-ink-dim);
          max-width: 480px;
          line-height: 1.6;
        }

        .notebook-page-root .nb-mail-btn,
        .nb-mail-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          background: var(--nb-ink);
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.92rem;
          padding: 0.7rem 1.5rem;
          margin-top: 0.4rem;
        }

        .notebook-page-root .nb-mail-btn:hover,
        .nb-mail-btn:hover {
          background: var(--nb-margin);
          color: #ffffff !important;
        }

        /* ---------- responsive ---------- */
        @media (max-width: 760px) {
          .nb-spine, .nb-margin-rule { display: none; }
          .nb-shell { padding: 3.25rem 1.25rem 3.5rem; }
        }

        @media (max-width: 480px) {
          .nb-mail-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="nb-spine" aria-hidden="true" />
      <div className="nb-margin-rule" aria-hidden="true" />

      <div className="nb-shell">
        <header id="about-header">
          <span className="nb-tab">About the platform</span>
          <h1 id="about-title">Private Academy Engineering</h1>
          <p className="nb-tagline" id="about-tagline">
            A comprehensive study resource platform built for <strong>engineering students across leading universities</strong>, providing branch-wise notes, exam guides, and video tutorials customized to your syllabus.
          </p>
        </header>

        <section className="nb-stats" id="about-stats-section">
          {stats.map((stat, i) => (
            <div className="nb-stat-card" key={i}>
              <div className="nb-stat-num">{stat.num}</div>
              <div className="nb-stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        <section id="about-academic-scope-section">
          <div className="nb-notes">
            <div>
              <h2 className="nb-section-title">Supported branches</h2>
              <input type="checkbox" id="branches-toggle" className="nb-branches-checkbox" aria-label="Toggle all supported branches" />
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
                  <svg className="nb-btn-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </label>
              </div>
            </div>

            <div>
              <h2 className="nb-section-title">Supported universities</h2>
              <div className="nb-sticky-row">
                {universities.map((uni, i) => (
                  <div className="nb-tab-badge" key={i}>
                    <span>{uni.name}</span>
                    <b>{uni.abbr}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about-values-section">
          <h2 className="nb-section-title">Core values</h2>
          <div className="nb-values">
            {values.map((val, i) => (
              <div className="nb-flashcard" key={i}>
                <div className="nb-flashcard-icon">{val.icon}</div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about-features-section">
          <h2 className="nb-section-title">Key features</h2>
          <div className="nb-features">
            {features.map((feature, i) => (
              <div className="nb-feature" key={i}>
                <svg className="nb-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="about-founder-section">
          <h2 className="nb-section-title">Founder profile</h2>
          <div className="nb-id-card">
            <div className="nb-id-strap" />
            <div className="nb-id-body">
              <div className="nb-id-avatar">KG</div>
              <div className="nb-id-name">Karan Gholap</div>
              <div className="nb-id-role">Founder &amp; Software Developer</div>
              <p className="nb-id-bio">
                Created the platform to help engineering students across various universities access notes, tutorials, and question papers in one place. Actively shares work and learnings in the developer and education community.
              </p>
              <div className="nb-id-links">
                <a href="https://linkedin.com/in/karangholap" className="nb-id-link" target="_blank" rel="noopener noreferrer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  LinkedIn
                </a>
                <a href="https://x.com/TheKaranGholap" className="nb-id-link" target="_blank" rel="noopener noreferrer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                  X (Twitter)
                </a>
                <a href="https://peerlist.io/karangholap" className="nb-id-link" target="_blank" rel="noopener noreferrer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 16H9V8h4.5c1.38 0 2.5 1.12 2.5 2.5S14.88 13 13.5 13H12v3z" />
                  </svg>
                  Peerlist
                </a>
                <a href="https://www.karangholap.com/" className="nb-id-link" target="_blank" rel="noopener noreferrer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="about-faq-section">
          <h2 className="nb-section-title">Frequently asked questions</h2>
          <div className="nb-faq">
            {faqs.map((faq, idx) => (
              <div className="nb-faq-item" key={idx}>
                <span className="nb-faq-q-mark" aria-hidden="true">Q</span>
                <div>
                  <div className="nb-faq-q">{faq.q}</div>
                  <div className="nb-faq-a">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about-contact-section">
          <div className="nb-ticket">
            <h2>Get in touch</h2>
            <p>Have feedback, queries, or notes to contribute? We&apos;d love to hear from you. Drop us a line.</p>
            <a href="mailto:info@privateacademy.in" className="nb-mail-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              info@privateacademy.in
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}