import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/legal/legal.module.css";
import LegalLayout from "@/components/legal/LegalLayout";

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

const TOC = [
  { id: "affiliation", label: "Strict Non-Affiliation Policy", num: "01" },
  { id: "academic", label: "Supplementary Notes & Curriculum", num: "02" },
  { id: "performance", label: "Exam Grades & Academic Results", num: "03" },
  { id: "links", label: "External Media & Tutorial Links", num: "04" },
  { id: "errors", label: "Typographic Errors & Corrections", num: "05" },
  { id: "copyright", label: "Copyright & Fair Use Notice", num: "06" },
];

export default function DisclaimerPage() {
  return (
    <LegalLayout
      title="Academic Disclaimer"
      lastUpdated="JULY 12, 2026"
      documentSpec="INSTITUTIONAL_DISCLAIMER_SPEC_05"
      summaryTitle="Critical Non-Affiliation Notice"
      summaryContent={
        <p style={{ margin: 0 }}>
          All study materials, blueprints, and code references published on <strong>Private Academy Engineering</strong> are independent student resources compiled for supplemental study. Private Academy is <strong>not</strong> an authorized affiliate of any university board. Please review our institutional non-affiliation disclosures below.
        </p>
      }
      toc={TOC}
      currentRoute="/disclaimer"
    >
      {/* Section 1 */}
      <section id="affiliation" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>01.</span> Strict Non-Affiliation Policy
        </h2>
        <p>
          Private Academy Engineering is an independent educational portal owned and operated by students and developer contributors.
        </p>
        <p style={{ fontWeight: 600, color: "var(--ink-900, #0B1020)" }}>
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
          <span className={styles.sectionNum}>02.</span> Supplementary Notes &amp; Curriculum
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
          <span className={styles.sectionNum}>03.</span> Exam Grades &amp; Performance
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
          <span className={styles.sectionNum}>04.</span> External Media &amp; Tutorial Links
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
          <span className={styles.sectionNum}>05.</span> Typographic Errors &amp; Corrections
        </h2>
        <p>
          Study notes are drafted, edited, and submitted by student contributors and software developers. They may contain mathematical typos, incorrect logic symbols, or obsolete software configurations.
        </p>
        <p>
          If you identify a calculation mistake, layout error, or incorrect fact, please report it immediately through our <Link href="/contact" style={{ color: "var(--blue-500, #2447F5)", fontWeight: 600 }}>Contact Page</Link>. We will update the corresponding PDF file in our Supabase Storage bucket as soon as the correction is verified.
        </p>
      </section>

      {/* Section 6 */}
      <section id="copyright" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>06.</span> Copyright &amp; Fair Use Notice
        </h2>
        <p>
          All original study guides, custom handwritten notes, and code summaries on Private Academy Engineering are copyrighted by their respective authors and Private Academy.
        </p>
        <p>
          Previous years&apos; question papers and university syllabus outlines are referenced under <strong>Fair Use</strong> for educational, non-commercial commentary and study reference. If you believe any document hosted on our platform infringes upon your copyright, please contact us at <a href="mailto:info@privateacademy.in" style={{ color: "var(--blue-500, #2447F5)", fontWeight: 600 }}>info@privateacademy.in</a> with proof of ownership for prompt review and takedown.
        </p>
      </section>
    </LegalLayout>
  );
}
