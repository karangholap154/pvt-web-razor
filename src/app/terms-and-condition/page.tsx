import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Private Academy Engineering",
  description: "Read the Terms & Conditions of Private Academy Engineering to understand user account registration, PDF licensing, payments, and digital refund rules.",
};

export default function TermsAndConditionPage() {
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
          background: rgba(30, 41, 59, 0.15);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2.25rem 2rem;
          transition: var(--transition);
        }
        .legal-section:hover {
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.02);
          box-shadow: 0 8px 24px -8px rgba(99, 102, 241, 0.12);
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
          background: rgba(99, 102, 241, 0.05);
          border-left: 4px solid var(--accent);
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
      <header className="animate-fade" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }} id="terms-header">
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(99, 102, 241, 0.1)",
          border: "1px solid rgba(99, 102, 241, 0.25)",
          borderRadius: "999px",
          padding: "0.4rem 1rem",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "#818cf8",
          marginBottom: "1rem",
          letterSpacing: "0.02em",
          textTransform: "uppercase"
        }}>
          Platform Rules
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="terms-title">
          Terms &amp; Conditions
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Last Updated: May 25, 2026
        </p>
      </header>

      {/* Summary Callout */}
      <div className="animate-fade callout-box">
        <div className="callout-title">Important Notice</div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          By creating an account, selecting a university curriculum, or purchasing study note unlocks on <strong>Private Academy Engineering</strong>, you signify your complete agreement to comply with these terms. Please read the document below carefully, specifically our intellectual property and refund policy sections.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Table of Contents</h3>
        <nav className="toc-grid">
          <a href="#acceptance" className="toc-link">1. Acceptance of Terms &amp; Profiles</a>
          <a href="#license" className="toc-link">2. Document License &amp; Restrictive Use</a>
          <a href="#payments" className="toc-link">3. Razorpay Orders &amp; Refund Rules</a>
          <a href="#academic" className="toc-link">4. Code of Conduct &amp; Academic Integrity</a>
          <a href="#security" className="toc-link">5. Account Prohibitions &amp; Scraping</a>
          <a href="#liability" className="toc-link">6. Limitations &amp; Site Warranties</a>
        </nav>
      </div>

      {/* Main content grid */}
      <main className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="terms-body">
        
        {/* Section 1 */}
        <section id="acceptance" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>01.</span> Acceptance of Terms &amp; Profiles
          </h2>
          <p>
            By accessing Private Academy Engineering, you warrant that you are legally capable of agreeing to these Terms. To customize your notes library, you are required to register an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete email credentials.</li>
            <li>Maintain the confidentiality of your session token and dashboard details.</li>
            <li>Accept full responsibility for all activities, database unlocks, or submissions made under your account credentials.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="license" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>02.</span> Document License &amp; Restrictive Use
          </h2>
          <p>
            All study materials, engineering guides, and compiled PDFs hosted on our platforms are protected by intellectual property rules.
          </p>
          <p>
            We grant you a **limited, personal, non-exclusive, non-transferable, and revocable license** to view and download study files for individual, non-commercial academic preparation. You may **NOT**:
          </p>
          <ul>
            <li>Resell, repackage, lease, or commercially distribute our notes or PDF documents.</li>
            <li>Republish the study materials on other public learning directories or file-sharing websites (e.g. Scribd, Studocu, course groups) without prior written permission.</li>
            <li>Remove any authorship tags, founder notes, or trademarked branding from the document pages.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="payments" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>03.</span> Razorpay Orders &amp; Refund Rules
          </h2>
          <p>
            Access to certain premium notes requires payment processed via Razorpay:
          </p>
          <ul>
            <li><strong>Order Completion</strong>: An unlock code or PDF link is activated immediately upon successful transaction verification through Razorpay&apos;s API.</li>
            <li><strong>Digital Refund Rules</strong>: Since notes are delivered as instant digital downloads (PDF files), <strong>all transactions are final and non-refundable</strong> once a file has been successfully unlocked. We cannot process refunds for change-of-mind, syllabus mismatches, or exam cancellations.</li>
            <li><strong>Technical Issues</strong>: In the event of double-billing or payment status errors (where bank balances are debited but note access is not granted), contact our team with invoice logs at <a href="mailto:privateacademy.in@gmail.com" style={{ color: "var(--accent)", fontWeight: 600 }}>privateacademy.in@gmail.com</a>. We will manually verify and resolve access settings within 24 hours.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="academic" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>04.</span> Code of Conduct &amp; Academic Integrity
          </h2>
          <p>
            Private Academy Engineering serves as a supplementary study utility. We promote strict academic integrity:
          </p>
          <ul>
            <li>Our notes and solutions are designed to explain complex engineering theorems and code structures.</li>
            <li>You agree not to use our documents, source codes, or project deliverables for plagiarism, exam cheating, or violating the official academic honor code of your university.</li>
            <li>Any student caught using the materials in a manner that constitutes academic dishonesty does so at their own risk. We hold no liability for institutional disciplinary measures.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="security" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>05.</span> Account Prohibitions &amp; Scraping
          </h2>
          <p>
            To protect our database limits and the platform&apos;s stability, you agree not to:
          </p>
          <ul>
            <li>Deploy automated scripts, bots, scrapers, or browser extensions to bulk-download documents, scrape search terms, or duplicate data.</li>
            <li>Share account credentials to circumvent unlock payment barriers or share links to premium guides.</li>
            <li>Attack the platform via denial of service (DoS/DDoS) actions, SQL injections, or database security probing.</li>
          </ul>
          <p>
            Violation of these rules will result in immediate session termination, deletion of the user account profile, and a block on the associated IP subnet.
          </p>
        </section>

        {/* Section 6 */}
        <section id="liability" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>06.</span> Limitations &amp; Site Warranties
          </h2>
          <p>
            The platform is provided on an **&quot;as is&quot;** and **&quot;as available&quot;** basis. Private Academy Engineering makes no warranties that:
          </p>
          <ul>
            <li>The platform will remain completely free of errors, typos, or database service interruptions.</li>
            <li>The files downloaded are completely free of typing or mathematical calculation errors (see our Disclaimer).</li>
            <li>The CDN file server will be continuously accessible without downtime. We hold no liability for study interruptions during server maintenance periods.</li>
          </ul>
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
