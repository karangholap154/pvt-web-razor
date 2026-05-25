import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "4.5rem" }}>
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: floatIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .stat-card {
          transition: all 0.3s ease;
          border: 1px solid var(--border);
          background: rgba(30, 41, 59, 0.2);
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.05);
          box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.3);
        }
        .value-card {
          transition: all 0.3s ease;
          border: 1px solid var(--border);
          background: rgba(30, 41, 59, 0.2);
        }
        .value-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.2);
          background: rgba(30, 41, 59, 0.4);
        }
        .branch-badge, .uni-badge {
          transition: all 0.2s ease;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
        }
        .branch-badge:hover, .uni-badge:hover {
          background: var(--accent-light);
          border-color: var(--accent);
          color: var(--text-primary);
          transform: translateY(-1px);
        }
        .founder-card {
          border: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.3) 100%);
        }
        .founder-social-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.2s ease;
        }
        .founder-social-btn:hover {
          color: var(--text-primary);
          border-color: var(--accent);
          background: var(--accent-light);
          transform: translateY(-2px);
        }
        .contact-cta {
          border: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%);
          position: relative;
          overflow: hidden;
        }
        .contact-cta::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent), #a78bfa);
        }
        .contact-mail-btn {
          margin-top: 0.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--accent);
          color: #fff;
          font-weight: 700;
          padding: 0.8rem 1.75rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }
        .contact-mail-btn:hover {
          background-color: var(--accent-hover);
        }
      `}</style>

      {/* Hero Header */}
      <header className="animate-fade" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2.5rem", textAlign: "center" }} id="about-header">
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
          marginBottom: "1.25rem",
          letterSpacing: "0.02em",
          textTransform: "uppercase"
        }}>
          About the Platform
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="about-title">
          Private Academy{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent), #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Engineering
          </span>
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", marginTop: "1rem", maxWidth: "720px", margin: "1rem auto 0", lineHeight: 1.6 }} id="about-tagline">
          A comprehensive study resource platform built for <strong>engineering students across leading universities</strong>, providing branch-wise notes, exam guides, and video tutorials customized to your syllabus.
        </p>
      </header>

      {/* Stats Section */}
      <section className="animate-fade" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }} id="about-stats-section">
        {[
          { num: "2500+", label: "Students Helped" },
          { num: "50K+", label: "Downloads" },
          { num: "5", label: "Branches Covered" },
          { num: "98%", label: "Satisfaction Rate" }
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ padding: "1.75rem", borderRadius: "var(--radius)", textAlign: "center" }}>
            <div style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{stat.num}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.35rem", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em" }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Supported Branches & Universities */}
      <section className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }} id="about-academic-scope-section">
        {/* Branches */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>Supported Branches</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            {["Computer Engineering", "Information Technology", "AIML", "Mechanical", "Chemical"].map((branch, i) => (
              <div key={i} className="branch-badge" style={{ padding: "0.5rem 1.15rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                {branch}
              </div>
            ))}
          </div>
        </div>

        {/* Universities */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>Supported Universities</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            {[
              { name: "Mumbai University", abbr: "MU" },
              { name: "Savitribai Phule Pune University", abbr: "SPPU" },
              { name: "Nagpur University", abbr: "NU" },
              { name: "Amravati University", abbr: "AU" },
              { name: "Dr. Babasaheb Ambedkar Technological University", abbr: "DBATU" },
              { name: "Shivaji University", abbr: "SUK" }
            ].map((uni, i) => (
              <div key={i} className="uni-badge" style={{ padding: "0.5rem 1.15rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>{uni.name}</span>
                <span style={{ fontSize: "0.75rem", padding: "0.1rem 0.4rem", borderRadius: "4px", backgroundColor: "var(--border)", color: "var(--text-primary)" }}>{uni.abbr}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }} id="about-values-section">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>Core Values</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
          {[
            {
              title: "Excellence",
              desc: "Highest quality, hand-picked study materials to ensure exam readiness.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
              color: "#fbbf24"
            },
            {
              title: "Accessibility",
              desc: "Tailored education and organized guides accessible to all registered students.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
              color: "#34d399"
            },
            {
              title: "Innovation",
              desc: "Constantly improving the platform tools, interfaces, and experience.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              ),
              color: "#60a5fa"
            },
            {
              title: "Impact",
              desc: "Focused on helping thousands of students achieve their academic goals.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              ),
              color: "#f87171"
            }
          ].map((val, i) => (
            <div key={i} className="value-card" style={{ padding: "1.5rem", borderRadius: "var(--radius)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: val.color, marginBottom: "1rem" }}>
                {val.icon}
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{val.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }} id="about-features-section">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>Key Features</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
          {[
            "Meticulously curated, syllabus-aligned study notes from top engineering programs",
            "University personalization — select your university once to customize your entire notes dashboard",
            "Organized by branch and semester for absolute ease of navigation",
            "Integrated learning — download high-quality PDFs and watch video walkthroughs on the same screen"
          ].map((feature, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1.25rem 1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "rgba(30, 41, 59, 0.1)" }}>
              <div style={{ color: "var(--accent)", marginTop: "0.15rem", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.5 }}>
                {feature}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Section */}
      <section className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }} id="about-founder-section">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>Founder Profile</h2>
        
        <div className="founder-card" style={{ padding: "2.5rem", borderRadius: "var(--radius-lg)", display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Left Side: Avatar/Brand Placeholder */}
          <div style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: 800,
            color: "#fff",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
            flexShrink: 0,
            margin: "0 auto"
          }}>
            KG
          </div>
          
          {/* Right Side: Bio & Details */}
          <div style={{ flex: 1, minWidth: "260px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>Karan Gholap</h3>
              <div style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600, marginTop: "0.15rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Founder & Software Developer
              </div>
            </div>
            
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Created the platform to help engineering students across various universities access notes, tutorials, and question papers in one place. Actively shares work and learnings in the developer and education community.
            </p>

            {/* Social Portals */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
              <a href="https://linkedin.com/in/karangholap" className="founder-social-btn" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
              <a href="https://x.com/TheKaranGholap" className="founder-social-btn" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
                X (Twitter)
              </a>
              <a href="https://peerlist.io/karangholap" className="founder-social-btn" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 16H9V8h4.5c1.38 0 2.5 1.12 2.5 2.5S14.88 13 13.5 13H12v3z" />
                </svg>
                Peerlist
              </a>
              <a href="https://www.karangholap.com/" className="founder-social-btn" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Support / Contact Section */}
      <section className="animate-fade contact-cta" style={{ padding: "2.5rem", borderRadius: "var(--radius-lg)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }} id="about-contact-section">
        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>Get in Touch</h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", maxWidth: "520px", lineHeight: "1.6" }}>
          Have feedback, queries, or notes to contribute? We&apos;d love to hear from you. Drop us a line.
        </p>
        <a 
          href="mailto:privateacademy.in@gmail.com" 
          className="contact-mail-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          privateacademy.in@gmail.com
        </a>
      </section>
    </div>
  );
}
