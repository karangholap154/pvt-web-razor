import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/legal/legal.module.css";

export const metadata: Metadata = {
  title: "Disclaimer | Private Academy Engineering",
  description: "Read the official Disclaimer regarding academic materials, universities non-affiliation, and curriculum details on Private Academy Engineering.",
  alternates: {
    canonical: "/disclaimer",
  },
  openGraph: {
    title: "Disclaimer | Private Academy Engineering",
    description: "Read the official Disclaimer regarding academic materials and universities non-affiliation on Private Academy Engineering.",
    url: "/disclaimer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer | Private Academy Engineering",
    description: "Read the official Disclaimer regarding academic materials and universities non-affiliation on Private Academy Engineering.",
  },
};

export default function DisclaimerPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={`${styles.animateFade} ${styles.header}`} id="disclaimer-header">
        <div className={`${styles.badgePill} ${styles.badgePillDanger}`}>
          Legal Notice
        </div>
        <h1 className={styles.title} id="disclaimer-title">
          Disclaimer
        </h1>
        <p className={styles.subtitle}>
          Last Updated: July 12, 2026
        </p>
      </header>

      {/* Liability Callout */}
      <div className={`${styles.animateFade} ${styles.calloutBox}`}>
        <div className={styles.calloutTitle}>Critical Disclaimer</div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          All study materials and links published on <strong>Private Academy Engineering</strong> are compiled in good faith for general educational support purposes only. We make no guarantees of academic success or perfect syllabus alignment. Read our affiliation policy below.
        </p>
      </div>

      {/* Table of Contents */}
      <div className={styles.animateFade} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Table of Contents</h3>
        <nav className={styles.tocGrid}>
          <a href="#affiliation" className={styles.tocLink}>1. Strict Non-Affiliation Policy</a>
          <a href="#academic" className={styles.tocLink}>2. Supplementary Notes &amp; Curriculum</a>
          <a href="#performance" className={styles.tocLink}>3. Exam Grades &amp; Performance</a>
          <a href="#links" className={styles.tocLink}>4. External Media &amp; Tutorial Links</a>
          <a href="#errors" className={styles.tocLink}>5. Typographic Errors &amp; Corrections</a>
          <a href="#copyright" className={styles.tocLink}>6. Copyright &amp; Fair Use Notice</a>
        </nav>
      </div>

      {/* Main content grid */}
      <main className={styles.animateFade} style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="disclaimer-body">
        
        {/* Section 1 */}
        <section id="affiliation" className={styles.legalSection}>
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
        <section id="academic" className={styles.legalSection}>
          <h2>
            <span style={{ color: "#ef4444" }}>02.</span> Supplementary Notes &amp; Curriculum
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
        <section id="performance" className={styles.legalSection}>
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
        <section id="links" className={styles.legalSection}>
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
        <section id="errors" className={styles.legalSection}>
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

        {/* Section 6 */}
        <section id="copyright" className={styles.legalSection}>
          <h2>
            <span style={{ color: "#ef4444" }}>06.</span> Copyright &amp; Fair Use Notice
          </h2>
          <p>
            All original study guides, custom handwritten notes, and code summaries on Private Academy Engineering are copyrighted by their respective authors and Private Academy.
          </p>
          <p>
            Previous years&apos; question papers and university syllabus outlines are referenced under <strong>Fair Use</strong> for educational, non-commercial commentary and study reference. If you believe any document hosted on our platform infringes upon your copyright, please contact us at <a href="mailto:info@privateacademy.in" style={{ color: "var(--accent)", fontWeight: 600 }}>info@privateacademy.in</a> with proof of ownership for prompt review and takedown.
          </p>
        </section>

      </main>

      {/* Footer Navigation */}
      <footer className={styles.footer}>
        <Link href="/" className={styles.backBtn}>
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
