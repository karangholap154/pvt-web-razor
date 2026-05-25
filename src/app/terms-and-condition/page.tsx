import Link from "next/link";

export default function TermsAndConditionPage() {
  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }} id="terms-header">
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }} id="terms-title">Terms & Conditions</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Last Updated: May 25, 2026</p>
      </header>

      <main style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.7", color: "var(--text-secondary)" }} id="terms-body">
        <p>
          Welcome to <strong>Private Academy</strong>. By accessing our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
        </p>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>1. Acceptance of Terms</h2>
          <p>
            By browsing our library and downloading files, you signify your acceptance of these Terms. If you do not agree, please discontinue use of this platform. We reserve the right to modify these terms at any time without prior notice.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>2. Intellectual Property & Use License</h2>
          <p>
            Unless otherwise stated, all study materials, notes, articles, and code showcases on Private Academy are provided under an educational license. You may:
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Download and print PDF files for personal, non-commercial academic study.</li>
            <li>Share links to notes and articles with other students.</li>
          </ul>
          <p style={{ marginTop: "0.5rem" }}>
            You may <strong>NOT</strong> resell, repackage, or distribute our documents on commercial networks or platforms for monetary gain.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>3. Contributor Guidelines</h2>
          <p>
            If you submit notes or projects to our team via the contact channels:
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>You warrant that you hold the legal right to distribute the material.</li>
            <li>You grant Private Academy a perpetual, royalty-free, non-exclusive license to present the material.</li>
            <li>You agree not to upload files containing viruses, malicious code, or copyrighted book scans.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>4. Termination of Access</h2>
          <p>
            We reserve the right to restrict access to our download portals or forms if we detect script abuses, automated scraping attacks, or violations of these terms.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>5. Contact & Questions</h2>
          <p>
            For any queries regarding these terms, please contact: <a href="mailto:privateacademy.in@gmail.com" style={{ color: "var(--accent)", fontWeight: 600 }}>privateacademy.in@gmail.com</a>.
          </p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginTop: "1rem" }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 600 }}>← Return to Home</Link>
      </footer>
    </div>
  );
}
