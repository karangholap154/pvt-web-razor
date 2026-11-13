import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/legal/legal.module.css";
import LegalLayout from "@/components/legal/LegalLayout";

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

const TOC = [
  { id: "acceptance", label: "Acceptance of Terms & Profiles", num: "01" },
  { id: "license", label: "Document License & Restrictive Use", num: "02" },
  { id: "payments", label: "Razorpay Orders & Refund Rules", num: "03" },
  { id: "academic", label: "Code of Conduct & Integrity", num: "04" },
  { id: "security", label: "Account Prohibitions & Scraping", num: "05" },
  { id: "liability", label: "Limitations & Site Warranties", num: "06" },
];

export default function TermsAndConditionPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      lastUpdated="JULY 12, 2026"
      documentSpec="TERMS_AGREEMENT_SPEC_02"
      summaryTitle="Notice to All Users"
      summaryContent={
        <p style={{ margin: 0 }}>
          By creating an account, selecting an engineering curriculum, or unlocking study notes on <strong>Private Academy Engineering</strong>, you signify your full agreement to comply with these terms. Please review our document licensing rules, intellectual property protection, and refund policies carefully.
        </p>
      }
      toc={TOC}
      currentRoute="/terms-and-condition"
    >
      {/* Section 1 */}
      <section id="acceptance" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>01.</span> Acceptance of Terms &amp; Profiles
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
          <span className={styles.sectionNum}>02.</span> Document License &amp; Restrictive Use
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
          <span className={styles.sectionNum}>03.</span> Razorpay Orders &amp; Refund Rules
        </h2>
        <p>
          Access to certain premium notes requires payment processed via Razorpay:
        </p>
        <ul>
          <li><strong>Order Completion</strong>: An unlock code or PDF link is activated immediately upon successful transaction verification through Razorpay&apos;s API.</li>
          <li><strong>Digital Refund Rules</strong>: Since notes are delivered as instant digital downloads (PDF files), transactions are governed by our standalone <Link href="/refund-policy" style={{ color: "var(--blue-500, #2447F5)", fontWeight: 600 }}>Cancellation &amp; Refund Policy</Link>.</li>
          <li><strong>Delivery &amp; Fulfillment</strong>: Electronic delivery of study materials is governed by our standalone <Link href="/shipping-policy" style={{ color: "var(--blue-500, #2447F5)", fontWeight: 600 }}>Shipping &amp; Delivery Policy</Link>.</li>
          <li><strong>Technical Issues</strong>: In the event of double-billing or payment status errors (where bank balances are debited but note access is not granted), contact our team with invoice logs at <a href="mailto:info@privateacademy.in" style={{ color: "var(--blue-500, #2447F5)", fontWeight: 600 }}>info@privateacademy.in</a>. We will manually verify and resolve access settings within 24 hours.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section id="academic" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>04.</span> Code of Conduct &amp; Academic Integrity
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
          <span className={styles.sectionNum}>05.</span> Account Prohibitions &amp; Scraping
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
          <span className={styles.sectionNum}>06.</span> Limitations &amp; Site Warranties
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
    </LegalLayout>
  );
}
