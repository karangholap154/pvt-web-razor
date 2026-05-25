import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }} id="disclaimer-header">
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }} id="disclaimer-title">Disclaimer</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Last Updated: May 25, 2026</p>
      </header>

      <main style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.7", color: "var(--text-secondary)" }} id="disclaimer-body">
        <p>
          All information on <strong>Private Academy</strong> is published in good faith and for general educational purposes only.
        </p>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>1. No Educational Warranties</h2>
          <p>
            While we strive to compile accurate, clear, and up-to-date study guides and notes, we make no warranties about the completeness, reliability, or absolute accuracy of this content. Engineering curricula can vary widely between universities and change frequently. Always cross-reference notes with your official university syllabus and prescribed textbooks.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>2. Grade & Academic Performance</h2>
          <p>
            Private Academy is a supplementary learning utility. We are not responsible or liable for any low performance, exam grades, or failures resulting from the use of our study notes, practice questions, or video summaries. Success in engineering requires deep conceptual work, practice, and instruction.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>3. External Links</h2>
          <p>
            Our library includes embeds and links to external video platforms (such as YouTube). We have no control over the content, ads, or changes made by channel owners on these platforms. A link to a tutorial does not imply endorsement of all content published by that channel.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>4. Errors & Omissions</h2>
          <p>
            Study notes are written by humans (students and experts) and may contain typographic errors, incorrect mathematical signs, or outdated code snippets. If you spot an error, please report it immediately through our <Link href="/contact" style={{ color: "var(--accent)", fontWeight: 600 }}>Contact Page</Link> so we can correct the file.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>5. Contact Channel</h2>
          <p>
            Should you require any more information or have questions about our disclaimer, please contact us by email at: <a href="mailto:privateacademy.in@gmail.com" style={{ color: "var(--accent)", fontWeight: 600 }}>privateacademy.in@gmail.com</a>.
          </p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginTop: "1rem" }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 600 }}>← Return to Home</Link>
      </footer>
    </div>
  );
}
