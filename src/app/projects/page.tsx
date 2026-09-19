import type { Metadata } from "next";
import { Work_Sans, Caveat } from "next/font/google";
import { supabaseAdmin } from "../../utils/supabaseAdmin";

export const revalidate = 3600; // Cache static page for 1 hour with ISR revalidation

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
  title: "Engineering Micro & Mini Projects with Source Code | Private Academy",
  description: "Explore IT engineering micro and mini projects for every semester with full source code, live demos, and documentation.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Engineering Micro & Mini Projects with Source Code | Private Academy",
    description: "Explore IT engineering micro and mini projects for every semester with full source code, live demos, and documentation.",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Micro & Mini Projects with Source Code | Private Academy",
    description: "Explore IT engineering micro and mini projects for every semester with full source code, live demos, and documentation.",
  },
};

interface Project {
  id: string;
  title: string;
  branch: string;
  techStack: string[];
  description: string;
  githubUrl: string;
}

export default async function ProjectsPage() {
  let projects: Project[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      console.warn("Failed to fetch projects from Supabase.", error);
    } else if (data) {
      projects = data.map((item) => ({
        id: item.id,
        title: item.title,
        branch: item.branch || "Information Technology",
        techStack: item.tech_stack || [],
        description: item.description || "",
        githubUrl: item.github_url || "",
      }));
    }
  } catch (err) {
    console.error("General error loading projects from Supabase.", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Engineering Micro & Mini Projects Showcase",
    "description": "IT engineering micro and mini projects with source code and documentation.",
    "url": "https://www.privateacademy.in/projects",
    "itemListElement": projects.map((proj, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "SoftwareSourceCode",
        "name": proj.title,
        "description": proj.description,
        "programmingLanguage": proj.techStack.join(", "),
        "codeRepository": proj.githubUrl,
      },
    })),
  };

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

        /* ---------- 2-column info & focus areas ---------- */
        .nb-split-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3.5rem;
        }

        .nb-offers-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .nb-offer-card {
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 0.95rem 1.15rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          box-shadow: 0 2px 6px rgba(29, 53, 87, 0.04);
        }

        .nb-offer-check {
          color: var(--nb-margin);
          font-weight: 700;
          font-size: 1rem;
          line-height: 1;
          margin-top: 0.1rem;
        }

        .nb-offer-text {
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--nb-ink-dim);
        }

        .nb-focus-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          align-content: flex-start;
        }

        .nb-focus-pill {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--nb-ink);
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 0.45rem 0.9rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
        }

        .nb-focus-pill:hover {
          background: var(--nb-yellow);
          border-color: var(--nb-ink);
          transform: translateY(-1px);
        }

        /* ---------- 3-step guide ---------- */
        .nb-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.4rem;
        }

        .nb-step-card {
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.6rem 1.4rem;
          position: relative;
          box-shadow: 0 3px 8px rgba(29, 53, 87, 0.05);
        }

        .nb-step-num {
          font-family: var(--font-hand), cursive;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--nb-margin);
          line-height: 1;
          margin-bottom: 0.4rem;
        }

        .nb-step-title {
          font-weight: 700;
          font-size: 1.08rem;
          margin-bottom: 0.4rem;
          color: var(--nb-ink);
        }

        .nb-step-desc {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--nb-ink-dim);
        }

        /* ---------- project cards grid ---------- */
        .nb-projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1.5rem;
        }

        .nb-project-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.6rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.25rem;
          box-shadow: 0 3px 10px rgba(29, 53, 87, 0.05);
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .nb-project-card:hover {
          transform: translateY(-3px);
          border-color: var(--nb-ink);
          box-shadow: 0 8px 18px rgba(29, 53, 87, 0.09);
        }

        .nb-project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-bottom: 0.75rem;
        }

        .nb-project-tag {
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--nb-paper);
          border: 1px solid var(--nb-card-line);
          padding: 0.15rem 0.5rem;
          color: var(--nb-ink-dim);
        }

        .nb-project-title {
          font-size: 1.18rem;
          font-weight: 700;
          color: var(--nb-ink);
          margin-bottom: 0.45rem;
          line-height: 1.3;
        }

        .nb-project-desc {
          font-size: 0.88rem;
          color: var(--nb-ink-dim);
          line-height: 1.6;
        }

        .notebook-page-root .nb-preview-btn,
        .nb-preview-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          color: var(--nb-ink);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.88rem;
          padding: 0.65rem 1.25rem;
          width: 100%;
          text-align: center;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }

        .notebook-page-root .nb-preview-btn:hover,
        .nb-preview-btn:hover {
          background: var(--nb-ink);
          color: #ffffff !important;
          border-color: var(--nb-ink);
        }

        /* ---------- empty state ---------- */
        .nb-empty-box {
          text-align: center;
          padding: 3.5rem 2rem;
          background: #fff;
          border: 1px dashed var(--nb-card-line);
          color: var(--nb-ink-dim);
        }

        /* ---------- contact cta ticket ---------- */
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

        .nb-ticket h2 { font-weight: 700; font-size: 1.3rem; color: var(--nb-ink); }

        .nb-ticket p {
          font-size: 0.92rem;
          color: var(--nb-ink-dim);
          max-width: 520px;
          line-height: 1.6;
        }

        .nb-cta-btn-group {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.4rem;
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
          padding: 0.7rem 1.4rem;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .notebook-page-root .nb-mail-btn:hover,
        .nb-mail-btn:hover {
          background: var(--nb-margin);
          color: #ffffff !important;
          transform: translateY(-1px);
        }

        .notebook-page-root .nb-wa-btn,
        .nb-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          background: #16a34a;
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.92rem;
          padding: 0.7rem 1.4rem;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .notebook-page-root .nb-wa-btn:hover,
        .nb-wa-btn:hover {
          background: #15803d;
          color: #ffffff !important;
          transform: translateY(-1px);
        }

        /* ---------- responsive ---------- */
        @media (max-width: 760px) {
          .nb-spine, .nb-margin-rule { display: none; }
          .nb-shell { padding: 3.25rem 1.25rem 3.5rem; }
          .nb-projects-grid { grid-template-columns: 1fr; }
          .nb-cta-btn-group { width: 100%; flex-direction: column; }
          .nb-mail-btn, .nb-wa-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Decorative spine & red margin rule */}
      <div className="nb-spine" aria-hidden="true" />
      <div className="nb-margin-rule" aria-hidden="true" />

      <div className="nb-shell">
        {/* Hero Header */}
        <header id="projects-header">
          <span className="nb-tab">Projects</span>
          <h1 id="projects-title">Micro &amp; Mini Projects — Private Academy Engineering</h1>
          <p className="nb-tagline" id="projects-tagline">
            Tailored project support for <strong>IT engineering students</strong>, covering every semester. Projects come with full source code and documentation.
          </p>
        </header>

        {/* Stats Section */}
        <section className="nb-stats" id="projects-stats-section">
          {[
            { num: "8+", label: "Live demos" },
            { num: "Every", label: "Semester-ready" },
            { num: "Full", label: "Source + docs" },
          ].map((stat, i) => (
            <div key={i} className="nb-stat-card">
              <div className="nb-stat-num">{stat.num}</div>
              <div className="nb-stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Focus Areas & What We Offer */}
        <div className="nb-split-grid">
          {/* What We Offer */}
          <section style={{ margin: 0 }}>
            <h2 className="nb-section-title">What We Offer</h2>
            <div className="nb-offers-list">
              {[
                "Micro and mini projects matched to your semester and syllabus",
                "Full source code + documentation provided",
                "Helps you learn, present, and extend the project confidently",
              ].map((offer, i) => (
                <div key={i} className="nb-offer-card">
                  <span className="nb-offer-check" aria-hidden="true">✓</span>
                  <span className="nb-offer-text">{offer}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Focus Areas */}
          <section style={{ margin: 0 }}>
            <h2 className="nb-section-title">Focus Areas</h2>
            <div className="nb-focus-tags">
              {[
                "Web development",
                "Mobile development",
                "Python projects",
                "React & modern JS",
                "Machine Learning & AI",
                "Cloud & DevOps",
                "IoT & Embedded Systems",
                "Cybersecurity",
                "Database & Backend Systems",
                "Other domains"
              ].map((focus, i) => (
                <span key={i} className="nb-focus-pill">
                  {focus}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* How to Get a Project (3-Step Guide) */}
        <section id="projects-steps-section">
          <h2 className="nb-section-title">How to Get a Project</h2>
          <div className="nb-steps-grid">
            {[
              {
                step: "1",
                title: "Contact them",
                desc: "Share your branch, semester, and tech preferences via email or WhatsApp",
              },
              {
                step: "2",
                title: "Get matched",
                desc: "They recommend a suitable micro or mini project fitting your syllabus and stack",
              },
              {
                step: "3",
                title: "Receive deliverables",
                desc: "Source code + clear documentation to study and demonstrate",
              },
            ].map((item, i) => (
              <div key={i} className="nb-step-card">
                <div className="nb-step-num">{item.step}</div>
                <h3 className="nb-step-title">{item.title}</h3>
                <p className="nb-step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live Projects Grid */}
        <section id="projects-listings-section">
          <h2 className="nb-section-title">Live Demos Showcase</h2>

          {projects.length === 0 ? (
            <div className="nb-empty-box">
              <h3>No projects available at this time.</h3>
            </div>
          ) : (
            <main className="nb-projects-grid" id="projects-grid">
              {projects.map((proj) => (
                <article className="nb-project-card" key={proj.id} id={proj.id}>
                  <div>
                    <div className="nb-project-tags">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="nb-project-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h3 className="nb-project-title">{proj.title}</h3>
                    <p className="nb-project-desc">{proj.description}</p>
                  </div>

                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nb-preview-btn"
                    id={`btn-live-${proj.id}`}
                  >
                    Visit Live Demo
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </article>
              ))}
            </main>
          )}
        </section>

        {/* Support / Contact Section */}
        <section id="projects-contact-section">
          <div className="nb-ticket">
            <h2>Request a Project</h2>
            <p>
              Ready to get your project files? Reach out to us with your specifications and we will match you with the right build.
            </p>

            <div className="nb-cta-btn-group">
              <a href="mailto:info@privateacademy.in" className="nb-mail-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email Support
              </a>
              <a
                href="https://wa.me/919423930547"
                target="_blank"
                rel="noopener noreferrer"
                className="nb-wa-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                WhatsApp 1
              </a>
              <a
                href="https://wa.me/918421955664"
                target="_blank"
                rel="noopener noreferrer"
                className="nb-wa-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                WhatsApp 2
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
