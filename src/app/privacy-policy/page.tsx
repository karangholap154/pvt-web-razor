import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Private Academy Engineering",
  description: "Read the Privacy Policy for Private Academy Engineering to understand how we collect, store, and process your academic settings and transaction data.",
};

export default function PrivacyPolicyPage() {
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
      <header className="animate-fade" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }} id="privacy-header">
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
          Legal Document
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="privacy-title">
          Privacy Policy
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Last Updated: May 25, 2026
        </p>
      </header>

      {/* Summary Callout */}
      <div className="animate-fade callout-box">
        <div className="callout-title">Summary Statement</div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          At <strong>Private Academy Engineering</strong>, we prioritize the protection and confidentiality of your account details, academic settings, and payment transactions. This policy outlines exactly what information we handle, how it is processed, and our strict commitment to zero tracking and advertising profiling.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Table of Contents</h3>
        <nav className="toc-grid">
          <a href="#info-collect" className="toc-link">1. Personal Information We Collect</a>
          <a href="#info-usage" className="toc-link">2. Data Usage & Platform Customization</a>
          <a href="#financials" className="toc-link">3. Razorpay Payments & Security</a>
          <a href="#databases" className="toc-link">4. Supabase Storage & Infrastructure</a>
          <a href="#cookies" className="toc-link">5. Session Cookies & Local Variables</a>
          <a href="#thirdparty" className="toc-link">6. Third-Party Media & YouTube Embeds</a>
          <a href="#retention" className="toc-link">7. Data Retention & Deletion Requests</a>
        </nav>
      </div>

      {/* Main content grid */}
      <main className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="privacy-body">
        
        {/* Section 1 */}
        <section id="info-collect" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>01.</span> Personal Information We Collect
          </h2>
          <p>
            To provide a personalized dashboard of study materials, Private Academy Engineering utilizes authentication. The following points represent the parameters we gather:
          </p>
          <ul>
            <li><strong>Account Profiles</strong>: Your Email Address and Full Name provided during credentials registration or login.</li>
            <li><strong>Academic Selection</strong>: Your chosen engineering branch (e.g. Computer, IT, AIML) and active university selection. This preference is stored in your profile settings.</li>
            <li><strong>Direct Communications</strong>: Correspondence, note requests, or feedback emails submitted directly to our support channels.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="info-usage" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>02.</span> Data Usage & Platform Customization
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
        <section id="financials" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>03.</span> Razorpay Payments & Security
          </h2>
          <p>
            Private Academy Engineering integrates <strong>Razorpay</strong> as the official payment gateway for premium document unlocks. We enforce strict transactional safeguards:
          </p>
          <ul>
            <li><strong>No Financial Storage</strong>: All critical card numbers, CVV codes, bank logins, or net banking keys are processed directly by Razorpay's secure, encrypted servers. <strong>We never capture, view, or store payment details on our databases.</strong></li>
            <li><strong>Standard Compliance</strong>: Razorpay processes transactions in adherence to the Payment Card Industry Data Security Standard (PCI-DSS) and uses tokenized SSL handshakes.</li>
            <li><strong>Verification Records</strong>: Our server stores only the transaction ID, receipt reference number, and timestamp generated by Razorpay's API to confirm payment validation and grant access to the notes.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="databases" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>04.</span> Supabase Storage & Infrastructure
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
        <section id="cookies" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>05.</span> Session Cookies & Local Variables
          </h2>
          <p>
            We do not deploy marketing trackers or track you across the web. We only use functional session cookies and local storage tokens to keep you logged in:
          </p>
          <ul>
            <li><strong>Session Authentication Cookie</strong>: A cookie (`session_email`) stores the active logged-in user identifier. This cookie is read exclusively by our server endpoints to verify active sessions.</li>
            <li><strong>Local Settings</strong>: Selected semesters, branches, or themes are stored locally in the browser to maintain persistent display preferences.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="thirdparty" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>06.</span> Third-Party Media & YouTube Embeds
          </h2>
          <p>
            Some exam preparation guides and explanations display embedded video tutorials hosted on YouTube. When you click play on these embeds:
          </p>
          <ul>
            <li>YouTube may log your interaction, IP address, and browser configurations according to Google's standard privacy guidelines.</li>
            <li>We do not control YouTube tracking or advertising scripts. You can inspect YouTube's cookie specifications directly on Google's privacy portal.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="retention" className="legal-section">
          <h2>
            <span style={{ color: "var(--accent)" }}>07.</span> Data Retention & Deletion Requests
          </h2>
          <p>
            Your account data and university configuration are retained as long as your profile remains active. We respect your rights to digital privacy:
          </p>
          <ul>
            <li><strong>Account Deletion</strong>: You may request complete deletion of your account profile, notes unlock records, and setting preferences at any time.</li>
            <li><strong>Direct Support</strong>: To request account termination, email us directly at <a href="mailto:privateacademy.in@gmail.com" style={{ color: "var(--accent)", fontWeight: 600 }}>privateacademy.in@gmail.com</a>. All requested database records are purged from our live Supabase tables within 48 hours of verification.</li>
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
