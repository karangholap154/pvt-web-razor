import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/legal/legal.module.css";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Private Academy Engineering",
  description: "Read the Cancellation and Refund Policy for digital study note purchases and transactions on Private Academy Engineering.",
  alternates: {
    canonical: "/refund-policy",
  },
  openGraph: {
    title: "Cancellation & Refund Policy | Private Academy Engineering",
    description: "Read the Cancellation and Refund Policy for digital study note purchases on Private Academy Engineering.",
    url: "/refund-policy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cancellation & Refund Policy | Private Academy Engineering",
    description: "Read the Cancellation and Refund Policy for digital study note purchases on Private Academy Engineering.",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={`${styles.animateFade} ${styles.header}`} id="refund-header">
        <div className={styles.badgePill}>
          Payment Terms
        </div>
        <h1 className={styles.title} id="refund-title">
          Cancellation &amp; Refund Policy
        </h1>
        <p className={styles.subtitle}>
          Last Updated: August 18, 2026
        </p>
      </header>

      {/* Summary Callout */}
      <div className={`${styles.animateFade} ${styles.calloutBox}`}>
        <div className={styles.calloutTitle}>Policy Overview</div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          At <strong>Private Academy Engineering</strong>, we strive to ensure a smooth purchase experience for all engineering study materials. Because our products consist of instant digital file downloads and access unlocks, please review our refund guidelines below.
        </p>
      </div>

      {/* Table of Contents */}
      <div className={styles.animateFade} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Table of Contents</h3>
        <nav className={styles.tocGrid}>
          <a href="#digital-nature" className={styles.tocLink}>1. Digital Products &amp; Non-Refundability</a>
          <a href="#eligible-exceptions" className={styles.tocLink}>2. Eligible Refund Circumstances</a>
          <a href="#failed-transactions" className={styles.tocLink}>3. Failed Debits &amp; Razorpay Status</a>
          <a href="#timelines" className={styles.tocLink}>4. Refund Processing &amp; Payout Timelines</a>
          <a href="#cancellation" className={styles.tocLink}>5. Order Cancellation Rules</a>
          <a href="#support-contact" className={styles.tocLink}>6. Refund Support &amp; Grievances</a>
        </nav>
      </div>

      {/* Main content grid */}
      <main className={styles.animateFade} style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="refund-body">
        
        {/* Section 1 */}
        <section id="digital-nature" className={styles.legalSection}>
          <h2>
            <span style={{ color: "var(--accent)" }}>01.</span> Digital Products &amp; Non-Refundability
          </h2>
          <p>
            Private Academy Engineering provides downloadable study guides, engineering lecture notes, question paper solutions, and PDF materials.
          </p>
          <ul>
            <li><strong>Instant Delivery</strong>: Upon successful payment verification via Razorpay, instant access/download capability is granted to your user profile and registered email address.</li>
            <li><strong>Final Sale Policy</strong>: Due to the nature of digital goods, which cannot be returned once delivered or accessed, <strong>all completed note unlock purchases are final and non-refundable</strong> under normal circumstances.</li>
            <li>We do not process refunds for change-of-mind, academic exam schedule changes, syllabus updates after purchase, or purchasing the incorrect module by user selection error.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="eligible-exceptions" className={styles.legalSection}>
          <h2>
            <span style={{ color: "var(--accent)" }}>02.</span> Eligible Refund Circumstances
          </h2>
          <p>
            We will process a full refund or issue store credit under the following valid technical exceptions:
          </p>
          <ul>
            <li><strong>Duplicate Charges</strong>: If you were charged multiple times for the exact same document transaction due to a network glitch or payment gateway retry error.</li>
            <li><strong>Unfulfilled Access</strong>: If your account was charged by Razorpay but our system failed to grant access to the purchased study material within 24 hours, and our technical support team is unable to resolve access to the document.</li>
            <li><strong>Corrupted or Unreadable Files</strong>: If the delivered document file is missing content, damaged, or unreadable, and we fail to provide a working copy within 48 hours of your support ticket.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="failed-transactions" className={styles.legalSection}>
          <h2>
            <span style={{ color: "var(--accent)" }}>03.</span> Failed Debits &amp; Razorpay Status
          </h2>
          <p>
            Sometimes money is debited from your bank account or UPI app, but the transaction fails to register on our server due to bank server timeouts:
          </p>
          <ul>
            <li>In such cases, payment gateways automatically initiate a reversal. Your bank will credit the funds back to your original source account within <strong>3 to 5 working days</strong>.</li>
            <li>If your bank statement reflects a deduction without a corresponding Private Academy order receipt, please forward your Razorpay Payment ID or UPI reference number to <a href="mailto:info@privateacademy.in" style={{ color: "var(--accent)", fontWeight: 600 }}>info@privateacademy.in</a> for manual verification.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="timelines" className={styles.legalSection}>
          <h2>
            <span style={{ color: "var(--accent)" }}>04.</span> Refund Processing &amp; Payout Timelines
          </h2>
          <p>
            When a refund is approved by our support team:
          </p>
          <ul>
            <li><strong>Mode of Refund</strong>: The refund will be credited directly back to the original payment method used during checkout (e.g. UPI, NetBanking, Credit/Debit Card, Wallet) via the Razorpay Payment Gateway API.</li>
            <li><strong>Turnaround Time</strong>: Once initiated by us, it typically takes <strong>5 to 7 business days</strong> for the refunded amount to reflect in your bank account, depending on your card issuer or banking partner&apos;s processing policies.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="cancellation" className={styles.legalSection}>
          <h2>
            <span style={{ color: "var(--accent)" }}>05.</span> Order Cancellation Rules
          </h2>
          <p>
            Because digital PDF unlocks are fulfilled automatically and immediately upon payment confirmation:
          </p>
          <ul>
            <li>Orders cannot be cancelled once payment processing is completed and file access has been unlocked.</li>
            <li>If you initiate a payment but close the checkout screen before completion, the transaction is automatically cancelled without debit.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="support-contact" className={styles.legalSection}>
          <h2>
            <span style={{ color: "var(--accent)" }}>06.</span> Refund Support &amp; Grievances
          </h2>
          <p>
            To request a refund review or resolve a billing issue, please reach out to our team with your transaction details:
          </p>
          <ul>
            <li><strong>Email Support</strong>: <a href="mailto:info@privateacademy.in" style={{ color: "var(--accent)", fontWeight: 600 }}>info@privateacademy.in</a></li>
            <li><strong>Required Information</strong>: Registered Account Email, Razorpay Order ID / Payment ID, Date of Transaction, and a brief description of the issue.</li>
            <li><strong>SLA</strong>: Support inquiries regarding payments are investigated and responded to within <strong>24 to 48 hours</strong>.</li>
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
