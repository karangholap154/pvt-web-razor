import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }} id="privacy-header">
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }} id="privacy-title">Privacy Policy</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Last Updated: May 25, 2026</p>
      </header>

      <main style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.7", color: "var(--text-secondary)" }} id="privacy-body">
        <p>
          At <strong>Private Academy</strong>, we prioritize the privacy of our visitors. This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to keep it secure.
        </p>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>1. Information We Collect</h2>
          <p>
            We do not require users to register or sign in to browse our library or download notes. The only personal information we collect is what you voluntarily provide when submitting the contact form or applying for a career opening (such as your name, email address, and message contents).
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>2. How We Use Your Information</h2>
          <p>
            We use the information we collect solely to:
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Respond directly to your inquiries, suggestions, or bug reports.</li>
            <li>Process contributor applications and project submissions.</li>
            <li>Monitor platform usage anonymously to improve site speeds and layout responsiveness.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>3. Cookies & Tracking</h2>
          <p>
            Private Academy is designed as a zero-friction educational tool. We do not set tracking cookies or engage in user-profiling advertising campaigns. We may compile generic, anonymous server stats to track search queries and ensure note downloads are functioning correctly.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>4. Third-Party Services</h2>
          <p>
            Our notes grid displays video tutorials embedded from YouTube. These third-party services may collect data (like your IP address) in accordance with their respective privacy standards when you click to play a video. We recommend reviewing their privacy policies directly.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>5. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact us at: <a href="mailto:privateacademy.in@gmail.com" style={{ color: "var(--accent)", fontWeight: 600 }}>privateacademy.in@gmail.com</a>.
          </p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginTop: "1rem" }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 600 }}>← Return to Home</Link>
      </footer>
    </div>
  );
}
