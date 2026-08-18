import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Private Academy Engineering",
  description: "Read the Shipping & Delivery Policy for Private Academy Engineering to understand instant digital PDF fulfillment, access timelines, and zero shipping charges.",
  alternates: {
    canonical: "/shipping-policy",
  },
  openGraph: {
    title: "Shipping & Delivery Policy | Private Academy Engineering",
    description: "Read the Shipping & Delivery Policy for Private Academy Engineering.",
    url: "/shipping-policy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping & Delivery Policy | Private Academy Engineering",
    description: "Read the Shipping & Delivery Policy for Private Academy Engineering.",
  },
};

export default function ShippingPolicyPage() {
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
      <header className="animate-fade" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }} id="shipping-header">
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
          Fulfillment Terms
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="shipping-title">
          Shipping &amp; Delivery Policy
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Last Updated: August 18, 2026
        </p>
      </header>

      {/* Summary Callout */}
      <div className="animate-fade callout-box">
        <div className="callout-title">Digital Fulfillment Overview</div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          All study materials, engineering question banks, and notes available on <strong>Private Academy Engineering</strong> are 100% digital. No physical goods or paper hardcopies are shipped or delivered to your postal address.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Table of Contents</h3>
        <nav className="toc-grid">
          <a href="#digital-fulfillment" className="toc-link">1. Electronic Access &amp; Delivery Method</a>
          <a href="#delivery-timeline" className="toc-link">2. Delivery Timelines</a>
          <a href="#shipping-charges" className="toc-link">3. Shipping &amp; Handling Fees</a>
          <a href="#access-issues" className="toc-link">4. Delivery Troubleshooting &amp; Support</a>
        </nav>
      </div>

      {/* Main content grid */}
      <main className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="shipping-body">
        
        {/* Section 1 */}
        <section id="digital-fulfillment" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>01.</span> Electronic Access &amp; Delivery Method
          </h2>
          <p>
            Private Academy Engineering operates exclusively as a digital educational resource platform:
          </p>
          <ul>
            <li><strong>Digital Files</strong>: All notes, exam guides, subject modules, and study packages are provided as downloadable digital Portable Document Format (PDF) files or viewable web documents.</li>
            <li><strong>Fulfillment Channel</strong>: Upon completing a successful transaction through our official payment gateway (Razorpay), document unlocks are tied immediately to your authenticated user account profile.</li>
            <li><strong>Access Portals</strong>: You can access and download your unlocked materials directly through the platform dashboard or note view page while logged into your registered profile.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="delivery-timeline" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>02.</span> Delivery Timelines
          </h2>
          <p>
            We prioritize instantaneous access so engineering students can start studying immediately:
          </p>
          <ul>
            <li><strong>Instant Delivery</strong>: Under normal server operating conditions, delivery occurs <strong>instantly (within seconds)</strong> upon payment authorization webhook confirmation from Razorpay.</li>
            <li><strong>Maximum Fulfillment SLA</strong>: In rare cases of database sync delays or network latencies, access confirmation will complete within a maximum of <strong>24 hours</strong>.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="shipping-charges" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>03.</span> Shipping &amp; Handling Fees
          </h2>
          <p>
            Because our services involve zero physical dispatch:
          </p>
          <ul>
            <li><strong>No Shipping Charges</strong>: There are <strong>₹0 (Zero) shipping, courier, or delivery fees</strong> associated with any product or digital unlock on Private Academy Engineering.</li>
            <li><strong>No Physical Products</strong>: We do not offer physical textbooks, printed spiral notes, or hardware flash drives. Please do not provide physical mailing addresses expectantly for postal delivery.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="access-issues" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>04.</span> Delivery Troubleshooting &amp; Support
          </h2>
          <p>
            If you encounter any issues receiving your digital files after a successful payment:
          </p>
          <ul>
            <li>Ensure you are logged into the exact account profile email used during checkout.</li>
            <li>Refresh your browser session or clear your session cache.</li>
            <li>If access is still locked after payment deduction, please email our support team at <a href="mailto:privateacademy.in@gmail.com" style={{ color: "var(--accent)", fontWeight: 600 }}>privateacademy.in@gmail.com</a> with your Payment ID. We will manually verify the payment webhook and grant document permissions within <strong>12 to 24 hours</strong>.</li>
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
