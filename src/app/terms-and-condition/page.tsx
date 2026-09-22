import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/legal/legal.module.css";

export const metadata: Metadata = {
  title: "Terms and Conditions | Private Academy Engineering",
  description: "Review the Terms and Conditions for accessing notes, purchasing study guides, and using Private Academy Engineering.",
  alternates: {
    canonical: "/terms-and-condition",
  },
  openGraph: {
    title: "Terms and Conditions | Private Academy Engineering",
    description: "Review the Terms and Conditions for accessing notes and using Private Academy Engineering.",
    url: "/terms-and-condition",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | Private Academy Engineering",
    description: "Review the Terms and Conditions for accessing notes and using Private Academy Engineering.",
  },
};

export default function TermsAndConditionPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={`${styles.animateFade} ${styles.header}`} id="terms-header">
        <div className={styles.badgePill}>
          Platform Rules
        </div>
        <h1 className={styles.title} id="terms-title">
          Terms &amp; Conditions
        </h1>
        <p className={styles.subtitle}>
          Last Updated: July 12, 2026
        </p>
      </header>

      {/* Summary Callout */}
      <div className={`${styles.animateFade} ${styles.calloutBox}`}>
        <div className={styles.calloutTitle}>Important Notice</div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          By creating an account, selecting a university curriculum, or purchasing study note unlocks on <strong>Private Academy Engineering</strong>, you signify your complete agreement to comply with these terms. Please read the document below carefully, specifically our intellectual property and refund policy sections.
        </p>
      </div>

      {/* Table of Contents */}
      <div className={styles.animateFade} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Table of Contents</h3>
        <nav className={styles.tocGrid}>
          <a href="#acceptance" className={styles.tocLink}>1. Acceptance of Terms &amp; Profiles</a>
          <a href="#license" className={styles.tocLink}>2. Document License &amp; Restrictive Use</a>
          <a href="#payments" className={styles.tocLink}>3. Razorpay Orders &amp; Refund Rules</a>
          <a href="#academic" className={styles.tocLink}>4. Code of Conduct &amp; Academic Integrity</a>
          <a href="#security" className={styles.tocLink}>5. Account Prohibitions &amp; Scraping</a>
          <a href="#liability" className={styles.tocLink}>6. Limitations &amp; Site Warranties</a>
        </nav>
      </div>

      {/* Main content grid */}
      <main className={styles.animateFade} style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="terms-body">
        
        {/* Section 1 */}
        <section id="acceptance" className={styles.legalSection}>
          <h2>
            <span style={{ color: "var(--accent)" }}>01.</span> Acceptance of Terms &amp; Profiles
          </h2>
          <p>
            By accessing Private Academy Engineering, you warrant that you are legally capable of agreeing to these Terms (or have parental/guardian consent if under 18 years of age). To customize your notes library, you are required to register an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete email credentials.</li>
            <li>Maintain the confidentiality of your session token and dashboard details.</li>
            <li>Accept full responsibility for all activities, database unlocks, or submissions made under your account credentials.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="license" className={styles.legalSection}>
          <h2>
            <span style={{ color: "var(--accent)" }}>02.</span> Document License &amp; Restrictive Use
          </h2>
          <p>
            All study materials, engineering guides, and compiled PDFs hosted on our platforms are protected by intellectual property rules.
          </p>
          <p>
            We grant you a <strong>limited, personal, non-exclusive, non-transferable, and revocable license</strong> to view and download study files for individual, non-commercial academic preparation. You may <strong>NOT</strong>:
          </p>
          <ul>
            <li>Resell, repackage, lease, or commercially distribute our notes or PDF documents.</li>
            <li>Republish the study materials on other public learning directories or file-sharing websites (e.g. Scribd, Studocu, course groups) without prior written permission.</li>
            <li>Remove any authorship tags, founder notes, or trademarked branding from the document pages.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="payments" className={styles.legalSection}>
          <h2>
            <span style={{ color: "var(--accent)" }}>03.</span> Razorpay Orders &amp; Refund Rules
          </h2>
          <p>
            Access to certain premium notes requires payment processed via Razorpay:
          </p>
          <ul>
            <li><strong>Order Completion</strong>: An unlock code or PDF link is activated immediately upon successful transaction verification through Razorpay&apos;s API.</li>
            <li><strong>Digital Refund Rules</strong>: Since notes are delivered as instant digital downloads (PDF files), transactions are governed by our standalone <Link href="/refund-policy" style={{ color: "var(--accent)", fontWeight: 600 }}>Cancellation &amp; Refund Policy</Link>.</li>
            <li><strong>Delivery &amp; Fulfillment</strong>: Electronic delivery of study materials is governed by our standalone <Link href="/shipping-policy" style={{ color: "var(--accent)", fontWeight: 600 }}>Shipping &amp; Delivery Policy</Link>.</li>
            <li><strong>Technical Issues</strong>: In the event of double-billing or payment status errors (where bank balances are debited but note access is not granted), contact our team with invoice logs at <a href="mailto:info@privateacademy.in" style={{ color: "var(--accent)", fontWeight: 600 }}>info@privateacademy.in</a>. We will manually verify and resolve access settings within 24 hours.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="academic" className={styles.legalSection}>
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
        <section id="security" className={styles.legalSection}>
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
        <section id="liability" className={styles.legalSection}>
          <h2>
            <span style={{ color: "var(--accent)" }}>06.</span> Limitations &amp; Site Warranties
          </h2>
          <p>
            The platform is provided on an <strong>&quot;as is&quot;</strong> and <strong>&quot;as available&quot;</strong> basis. Private Academy Engineering makes no warranties that:
          </p>
          <ul>
            <li>The platform will remain completely free of errors, typos, or database service interruptions.</li>
            <li>The files downloaded are completely free of typing or mathematical calculation errors (see our Disclaimer).</li>
            <li>The CDN file server will be continuously accessible without downtime. We hold no liability for study interruptions during server maintenance periods.</li>
          </ul>
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
