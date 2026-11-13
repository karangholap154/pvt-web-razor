import React from "react";
import type { Metadata } from "next";
import styles from "@/components/legal/legal.module.css";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Private Academy Engineering",
  description: "Read the Privacy Policy for Private Academy Engineering to understand how we collect, store, and process your academic settings and transaction data.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Private Academy Engineering",
    description: "Read the Privacy Policy for Private Academy Engineering.",
    url: "/privacy-policy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Private Academy Engineering",
    description: "Read the Privacy Policy for Private Academy Engineering.",
  },
};

const TOC = [
  { id: "info-collect", label: "Personal Information We Collect", num: "01" },
  { id: "info-usage", label: "Data Usage & Customization", num: "02" },
  { id: "financials", label: "Razorpay Payments & Security", num: "03" },
  { id: "databases", label: "Supabase Infrastructure & RLS", num: "04" },
  { id: "cookies", label: "Functional Cookies & Storage", num: "05" },
  { id: "thirdparty", label: "Third-Party Media Embeds", num: "06" },
  { id: "retention", label: "Data Retention & Deletion Rights", num: "07" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="JULY 12, 2026"
      documentSpec="DATA_PRIVACY_SPEC_01"
      summaryTitle="Executive Summary"
      summaryContent={
        <p style={{ margin: 0 }}>
          At <strong>Private Academy Engineering</strong>, we prioritize the confidentiality of your academic settings, study history, and transactions. We enforce a strict <strong>zero-advertising</strong> and <strong>no-third-party-profiling</strong> commitment. Your educational data is never sold, traded, or monetized for commercial advertising.
        </p>
      }
      toc={TOC}
      currentRoute="/privacy-policy"
    >
      {/* Section 1 */}
      <section id="info-collect" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>01.</span> Personal Information We Collect
        </h2>
        <p>
          To provide a personalized dashboard of study materials, Private Academy Engineering utilizes authentication. The following points represent the parameters we gather:
        </p>
        <ul>
          <li><strong>Account Profiles</strong>: Your Email Address and Full Name provided during credentials registration or login.</li>
          <li><strong>Academic Selection</strong>: Your chosen engineering branch (e.g. Computer Engineering, Information Technology, AIML, Mechanical, Chemical) and active university selection. This preference is stored in your profile settings.</li>
          <li><strong>Direct Communications</strong>: Correspondence, note requests, or feedback emails submitted directly to our support channels.</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section id="info-usage" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>02.</span> Data Usage &amp; Platform Customization
        </h2>
        <p>
          We process your information exclusively to support your learning experience. Under no circumstances do we sell, lease, or distribute user records to marketing networks. We use your data to:
        </p>
        <ul>
          <li>Personalize your dashboard view to filter notes, tutorials, and materials relevant to your university syllabus.</li>
          <li>Grant access to premium guides and verify notes unlock history linked to your account profile.</li>
          <li>Track down platform performance metrics, database query speeds, and API latency trends to improve overall site experience.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section id="financials" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>03.</span> Razorpay Payments &amp; Security
        </h2>
        <p>
          Private Academy Engineering integrates <strong>Razorpay</strong> as the official payment gateway for premium document unlocks. We enforce strict transactional safeguards:
        </p>
        <ul>
          <li><strong>No Financial Storage</strong>: All critical card numbers, CVV codes, bank logins, or net banking keys are processed directly by Razorpay&apos;s secure, encrypted servers. <strong>We never capture, view, or store payment details on our databases.</strong></li>
          <li><strong>Standard Compliance</strong>: Razorpay processes transactions in adherence to the Payment Card Industry Data Security Standard (PCI-DSS) and uses tokenized SSL handshakes.</li>
          <li><strong>Verification Records</strong>: Our server stores only the transaction ID, receipt reference number, and timestamp generated by Razorpay&apos;s API to confirm payment validation and grant access to the notes.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section id="databases" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>04.</span> Supabase Storage &amp; Infrastructure
        </h2>
        <p>
          Our core backend infrastructure is built on <strong>Supabase</strong>. All database transactions are managed securely:
        </p>
        <ul>
          <li><strong>Database Storage</strong>: Account credentials, university selections, and transaction references are securely stored in our relational PostgreSQL database managed by Supabase.</li>
          <li><strong>Row-Level Security (RLS)</strong>: Access to profile variables, purchase details, and document listings is strictly guarded by server-side RLS policies. Only the logged-in user can access their individual transaction logs.</li>
          <li><strong>Storage Buckets</strong>: Study guides and notes are housed in secure, isolated Supabase public CDN buckets.</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section id="cookies" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>05.</span> Session Cookies &amp; Local Variables
        </h2>
        <p>
          We do not deploy marketing trackers or track you across the web. We only use functional session cookies to keep you logged in and database preferences to persist your settings:
        </p>
        <ul>
          <li><strong>Session Authentication Cookie</strong>: Secure session cookies (prefixed with <code>sb-</code>) are created by Supabase Auth to maintain and verify your active logged-in session. These cookies are read exclusively by our server endpoints to authorize access.</li>
          <li><strong>Database Preferences</strong>: Selected default semesters, branches, and university selections are saved securely in your user profile database table in Supabase rather than utilizing local browser cookies or third-party storage.</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section id="thirdparty" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>06.</span> Third-Party Media &amp; YouTube Embeds
        </h2>
        <p>
          Some exam preparation guides and explanations display embedded video tutorials hosted on YouTube. When you click play on these embeds:
        </p>
        <ul>
          <li>YouTube may log your interaction, IP address, and browser configurations according to Google&apos;s standard privacy guidelines.</li>
          <li>We do not control YouTube tracking or advertising scripts. You can inspect YouTube&apos;s cookie specifications directly on Google&apos;s privacy portal.</li>
        </ul>
      </section>

      {/* Section 7 */}
      <section id="retention" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>07.</span> Data Retention &amp; Deletion Requests
        </h2>
        <p>
          Your account data and university configuration are retained as long as your profile remains active. We respect your rights to digital privacy:
        </p>
        <ul>
          <li><strong>Account Deletion</strong>: You may request complete deletion of your account profile, notes unlock records, and setting preferences at any time.</li>
          <li><strong>Direct Support</strong>: To request account termination, email us directly at <a href="mailto:info@privateacademy.in" style={{ color: "var(--blue-500, #2447F5)", fontWeight: 600 }}>info@privateacademy.in</a>. All requested database records are purged from our live Supabase tables within 48 hours of verification.</li>
        </ul>
      </section>
    </LegalLayout>
  );
}
