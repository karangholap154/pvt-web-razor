import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "3.5rem" }}>
      {/* Title */}
      <header style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }} id="about-header">
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em" }} id="about-title">About Private Academy</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Empowering engineering students through modular resources, curated note modules, and streamlined guides.
        </p>
      </header>

      {/* Grid of Story & Mission */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem" }} id="about-mission-section">
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Our Mission</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1rem" }}>
            At Private Academy, we believe that high-quality engineering notes shouldn&apos;t be hidden behind complex portals or heavy logins. 
            Our mission is simple: to build a lightning-fast, open-access repository of branch-wise lectures, exam-ready documents, 
            and tutorial guides to help you master challenging courses in less time.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>How We Help</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1rem" }}>
            We collaborate with senior students, subject matter experts, and professors across top universities in India to 
            organize notes by branch and semester. By filtering out the noise and providing direct downloads alongside video tutorials, 
            students can focus strictly on what matters for their conceptual understanding and GPA.
          </p>
        </div>
      </section>

      {/* Highlight Stats */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", padding: "2rem", backgroundColor: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }} id="about-stats-section">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--accent)" }}>10,000+</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem", textTransform: "uppercase", fontWeight: 600 }}>Active Students</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--accent)" }}>500+</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem", textTransform: "uppercase", fontWeight: 600 }}>Study Guides</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--accent)" }}>5+</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem", textTransform: "uppercase", fontWeight: 600 }}>Core Branches</div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} id="about-values-section">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Our Core Beliefs</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          
          <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>1. Zero friction access</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Notes must be downloaded with a single click. No forced sign-ups, paywalls, or endless ads.
            </p>
          </div>

          <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>2. Multimodal learning</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Combine textual blueprints, formulas, and diagrams with quick video explainers for holistic absorption.
            </p>
          </div>

          <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>3. Open contributions</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Any student can contribute verified notes and help peer circles. Community is our primary fuel.
            </p>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <footer style={{ borderTop: "1px solid var(--border)", paddingTop: "2.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }} id="about-footer-section">
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Ready to get started?</h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", maxWidth: "500px", lineHeight: "1.6" }}>
          Head back to the library to search for specific note modules or browse our compiled articles database.
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <Link href="/" style={{ backgroundColor: "var(--text-primary)", color: "var(--background)", fontWeight: 600, padding: "0.75rem 1.5rem", borderRadius: "var(--radius)" }}>
            Explore Library
          </Link>
          <Link href="/contact" style={{ backgroundColor: "var(--card-bg)", color: "var(--text-primary)", fontWeight: 600, padding: "0.75rem 1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            Talk to Us
          </Link>
        </div>
      </footer>
    </div>
  );
}
