import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Private Academy Engineering",
  description: "Read the Cancellation & Refund Policy for Private Academy Engineering to understand refund eligibility, digital product delivery, duplicate charge resolutions, and Razorpay processing timelines.",
  alternates: {
    canonical: "/refund-policy",
  },
  openGraph: {
    title: "Cancellation & Refund Policy | Private Academy Engineering",
    description: "Read the Cancellation & Refund Policy for Private Academy Engineering.",
    url: "/refund-policy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cancellation & Refund Policy | Private Academy Engineering",
    description: "Read the Cancellation & Refund Policy for Private Academy Engineering.",
  },
};

export default function RefundPolicyPage() {
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
          background: rgba(251, 191, 36, 0.05);
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
      <header className="animate-fade" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }} id="refund-header">
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(251, 191, 36, 0.1)",
          border: "1px solid rgba(251, 191, 36, 0.25)",
          borderRadius: "999px",
          padding: "0.4rem 1rem",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "#facc15",
          marginBottom: "1rem",
          letterSpacing: "0.02em",
          textTransform: "uppercase"
        }}>
          Payment Terms
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="refund-title">
          Cancellation &amp; Refund Policy
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Last Updated: August 18, 2026
        </p>
      </header>

      {/* Summary Callout */}
      <div className="animate-fade callout-box">
        <div className="callout-title">Policy Overview</div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          At <strong>Private Academy Engineering</strong>, we strive to ensure a smooth purchase experience for all engineering study materials. Because our products consist of instant digital file downloads and access unlocks, please review our refund guidelines below.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Table of Contents</h3>
        <nav className="toc-grid">
          <a href="#digital-nature" className="toc-link">1. Digital Products &amp; Non-Refundability</a>
          <a href="#eligible-exceptions" className="toc-link">2. Eligible Refund Circumstances</a>
          <a href="#failed-transactions" className="toc-link">3. Failed Debits &amp; Razorpay Status</a>
          <a href="#timelines" className="toc-link">4. Refund Processing &amp; Payout Timelines</a>
          <a href="#cancellation" className="toc-link">5. Order Cancellation Rules</a>
          <a href="#support-contact" className="toc-link">6. Refund Support &amp; Grievances</a>
        </nav>
      </div>

      {/* Main content grid */}
      <main className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="refund-body">
        
        {/* Section 1 */}
        <section id="digital-nature" className="legal-section">
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
        <section id="eligible-exceptions" className="legal-section">
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
        <section id="failed-transactions" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>03.</span> Failed Debits &amp; Razorpay Status
          </h2>
          <p>
            Sometimes money is debited from your bank account or UPI app, but the transaction fails to register on our server due to bank server timeouts:
          </p>
          <ul>
            <li>In such cases, payment gateways automatically initiate a reversal. Your bank will credit the funds back to your original source account within <strong>3 to 5 working days</strong>.</li>
            <li>If your bank statement reflects a deduction without a corresponding Private Academy order receipt, please forward your Razorpay Payment ID or UPI reference number to <a href="mailto:privateacademy.in@gmail.com" style={{ color: "var(--accent)", fontWeight: 600 }}>privateacademy.in@gmail.com</a> for manual verification.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="timelines" className="legal-section">
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
        <section id="cancellation" className="legal-section">
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
        <section id="support-contact" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>06.</span> Refund Support &amp; Grievances
          </h2>
          <p>
            To request a refund review or resolve a billing issue, please reach out to our team with your transaction details:
          </p>
          <ul>
            <li><strong>Email Support</strong>: <a href="mailto:privateacademy.in@gmail.com" style={{ color: "var(--accent)", fontWeight: 600 }}>privateacademy.in@gmail.com</a></li>
            <li><strong>Required Information</strong>: Registered Account Email, Razorpay Order ID / Payment ID, Date of Transaction, and a brief description of the issue.</li>
            <li><strong>SLA</strong>: Support inquiries regarding payments are investigated and responded to within <strong>24 to 48 hours</strong>.</li>
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
