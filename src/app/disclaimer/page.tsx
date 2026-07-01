import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Disclaimer | Private Academy Engineering",
  description: "Read the Disclaimer of Private Academy Engineering outlining our university non-affiliation, academic warranties, and error reporting procedures.",
};

export default function DisclaimerPage() {
  return (
    <div style={{ 
      width: "100%", 
      maxWidth: "900px", 
      margin: "0 auto", 
      padding: "4rem 1.5rem", 
      display: "flex", 
      flexDirection: "column", 
      gap: "3rem" 
    }}>
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: floatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .legal-section {
          background: rgba(24, 24, 27, 0.15);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2.25rem 2rem;
          transition: var(--transition);
        }
        .legal-section:hover {
          border-color: var(--accent);
          background: rgba(251, 191, 36, 0.02);
          box-shadow: 0 8px 24px -8px rgba(251, 191, 36, 0.12);
        }
        .legal-section h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .legal-section p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        .legal-section p:last-child {
          margin-bottom: 0;
        }
        .legal-section li {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .legal-section ul {
          margin: 0.75rem 0 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .toc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
        .toc-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .toc-link:hover {
          color: var(--accent);
          transform: translateX(4px);
        }
        .callout-box {
          background: rgba(239, 68, 68, 0.05);
          border-left: 4px solid #ef4444;
          border-radius: 0 var(--radius) var(--radius) 0;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1rem;
        }
        .callout-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--card-bg);
          color: var(--text-primary);
          border: 1px solid var(--border);
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius);
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition);
          cursor: pointer;
          text-decoration: none;
          align-self: flex-start;
        }
        .back-btn:hover {
          background-color: var(--border);
          transform: translateY(-2px);
          border-color: var(--accent);
        }
      `}</style>

      {/* Header */}
      <header className="animate-fade" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }} id="disclaimer-header">
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          borderRadius: "999px",
          padding: "0.4rem 1rem",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "#f87171",
          marginBottom: "1rem",
          letterSpacing: "0.02em",
          textTransform: "uppercase"
        }}>
          Legal Notice
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="disclaimer-title">
          Disclaimer
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Last Updated: May 25, 2026
        </p>
      </header>

      {/* Liability Callout */}
      <div className="animate-fade callout-box">
        <div className="callout-title">Critical Disclaimer</div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          All study materials and links published on <strong>Private Academy Engineering</strong> are compiled in good faith for general educational support purposes only. We make no guarantees of academic success or perfect syllabus alignment. Read our affiliation policy below.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Table of Contents</h3>
        <nav className="toc-grid">
          <a href="#affiliation" className="toc-link">1. Strict Non-Affiliation Policy</a>
          <a href="#academic" className="toc-link">2. Supplementary Notes &amp; Curricula</a>
          <a href="#performance" className="toc-link">3. Exam Grades &amp; Performance</a>
          <a href="#links" className="toc-link">4. External Media &amp; Tutorial Links</a>
          <a href="#errors" className="toc-link">5. Typographic Errors &amp; Corrections</a>
        </nav>
      </div>

      {/* Main content grid */}
      <main className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="disclaimer-body">
        
        {/* Section 1 */}
        <section id="affiliation" className="legal-section">
          <h2>
            <span style={{ color: "#ef4444" }}>01.</span> Strict Non-Affiliation Policy
          </h2>
          <p>
            Private Academy Engineering is an independent educational portal owned and operated by students and developer contributors.
          </p>
          <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            We are NOT affiliated with, officially sponsored by, endorsed by, or partnered with:
          </p>
          <ul>
            <li>Mumbai University (MU)</li>
            <li>Savitribai Phule Pune University (SPPU)</li>
            <li>Dr. Babasaheb Ambedkar Technological University (DBATU)</li>
            <li>Nagpur University (NU), Shivaji University (SUK), or Amravati University (AU)</li>
            <li>Any other affiliated college, governmental academic board, or institution.</li>
          </ul>
          <p>
            All university names, acronyms, course descriptions, and logos referenced on our platform remain the trademarks and registered properties of their respective academic authorities. Reference to these names is made solely for cataloging and identifying the relevant syllabus structure for students.
          </p>
        </section>

        {/* Section 2 */}
        <section id="academic" className="legal-section">
          <h2>
            <span style={{ color: "#ef4444" }}>02.</span> Supplementary Notes &amp; Curriculam
          </h2>
          <p>
            Our study guides, question papers, and code summaries represent supplementary materials designed to support self-guided study.
          </p>
          <ul>
            <li>Curriculum requirements can vary from year to year. Contributor notes may not instantly reflect the most recent syllabus changes, credit schemes, or updated marking schemes.</li>
            <li>Students are strongly advised to always cross-reference notes downloaded from our platform with the official textbooks, lecture guides, and notices issued by their college professors.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="performance" className="legal-section">
          <h2>
            <span style={{ color: "#ef4444" }}>03.</span> Exam Grades &amp; Performance
          </h2>
          <p>
            Private Academy Engineering holds no responsibility or liability for academic results:
          </p>
          <ul>
            <li>We do not guarantee passing grades, specific GPA scores, or placement success.</li>
            <li>Using our guides, practice exams, or code snippets does not guarantee that similar questions will appear on official college exam papers.</li>
            <li>Success in engineering exams relies on comprehensive study, attending lectures, and practicing practical exercises.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="links" className="legal-section">
          <h2>
            <span style={{ color: "#ef4444" }}>04.</span> External Media &amp; Tutorial Links
          </h2>
          <p>
            Our platform contains embedded video tutorial players (YouTube) and links to external developer code repositories (GitHub):
          </p>
          <ul>
            <li>We do not review, endorse, or verify all statements, advertisements, or codes published by third-party creators.</li>
            <li>A link to a YouTube channel or tutorial video does not imply that the platform represents or takes responsibility for that third party&apos;s future updates or changes.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="errors" className="legal-section">
          <h2>
            <span style={{ color: "#ef4444" }}>05.</span> Typographic Errors &amp; Corrections
          </h2>
          <p>
            Study notes are drafted, edited, and submitted by student contributors and software developers. They may contain mathematical typos, incorrect logic symbols, or obsolete software configurations.
          </p>
          <p>
            If you identify a calculation mistake, layout error, or incorrect fact, please report it immediately through our <Link href="/contact" style={{ color: "var(--accent)", fontWeight: 600 }}>Contact Page</Link>. We will update the corresponding PDF file in our Supabase Storage bucket as soon as the correction is verified.
          </p>
        </section>

      </main>

      {/* Footer Navigation */}
      <footer style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", display: "flex", gap: "1rem" }}>
        <Link href="/" className="back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </Link>
      </footer>
    </div>
  );
}
