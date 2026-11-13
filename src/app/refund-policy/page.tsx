import React from "react";
import type { Metadata } from "next";
import styles from "@/components/legal/legal.module.css";
import LegalLayout from "@/components/legal/LegalLayout";

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

const TOC = [
  { id: "digital-nature", label: "Digital Products & Non-Refundability", num: "01" },
  { id: "eligible-exceptions", label: "Eligible Technical Exceptions", num: "02" },
  { id: "failed-transactions", label: "Failed Debits & Gateway Status", num: "03" },
  { id: "timelines", label: "Processing & Payout Timelines", num: "04" },
  { id: "cancellation", label: "Order Cancellation Guidelines", num: "05" },
  { id: "support-contact", label: "Refund Inquiries & Grievances", num: "06" },
];

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Cancellation & Refund Policy"
      lastUpdated="AUGUST 18, 2026"
      documentSpec="REFUND_TERMS_SPEC_03"
      summaryTitle="Policy Overview"
      summaryContent={
        <p style={{ margin: 0 }}>
          At <strong>Private Academy Engineering</strong>, we strive to ensure an honest, transparent purchase experience. Because all materials consist of instant digital PDF downloads and access unlocks, please review our refund criteria below regarding final sales and valid technical exceptions.
        </p>
      }
      toc={TOC}
      currentRoute="/refund-policy"
    >
      {/* Section 1 */}
      <section id="digital-nature" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>01.</span> Digital Products &amp; Non-Refundability
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
          <span className={styles.sectionNum}>02.</span> Eligible Technical Exceptions
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
          <span className={styles.sectionNum}>03.</span> Failed Debits &amp; Razorpay Status
        </h2>
        <p>
          Sometimes money is debited from your bank account or UPI app, but the transaction fails to register on our server due to bank server timeouts:
        </p>
        <ul>
          <li>In such cases, payment gateways automatically initiate a reversal. Your bank will credit the funds back to your original source account within <strong>3 to 5 working days</strong>.</li>
          <li>If your bank statement reflects a deduction without a corresponding Private Academy order receipt, please forward your Razorpay Payment ID or UPI reference number to <a href="mailto:info@privateacademy.in" style={{ color: "var(--blue-500, #2447F5)", fontWeight: 600 }}>info@privateacademy.in</a> for manual verification.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section id="timelines" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>04.</span> Refund Processing &amp; Payout Timelines
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
          <span className={styles.sectionNum}>05.</span> Order Cancellation Rules
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
          <span className={styles.sectionNum}>06.</span> Refund Support &amp; Grievances
        </h2>
        <p>
          To request a refund review or resolve a billing issue, please reach out to our team with your transaction details:
        </p>
        <ul>
          <li><strong>Email Support</strong>: <a href="mailto:info@privateacademy.in" style={{ color: "var(--blue-500, #2447F5)", fontWeight: 600 }}>info@privateacademy.in</a></li>
          <li><strong>Required Information</strong>: Registered Account Email, Razorpay Order ID / Payment ID, Date of Transaction, and a brief description of the issue.</li>
          <li><strong>SLA</strong>: Support inquiries regarding payments are investigated and responded to within <strong>24 to 48 hours</strong>.</li>
        </ul>
      </section>
    </LegalLayout>
  );
}
