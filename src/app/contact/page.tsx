import React from "react";

export const metadata = {
  title: "Contact Us | Private Academy Engineering",
  description: "Get in touch with Private Academy Engineering. Request specific study notes, report issues, suggest improvements, or join our community groups.",
};

// Custom SVG Icons
const FaTelegram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const FaWhatsapp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const FaYoutube = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const FaInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FaLinkedin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FaTwitter = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const SOCIAL_PLATFORMS = [
  { 
    name: "Telegram", 
    badge: "2.5K+ Members", 
    desc: "Instant updates — t.me/mumcomputer", 
    link: "https://t.me/mumcomputer",
    color: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.05)",
    glow: "rgba(56, 189, 248, 0.12)",
    badgeBg: "rgba(56, 189, 248, 0.1)",
    badgeBorder: "rgba(56, 189, 248, 0.2)",
    icon: FaTelegram
  },
  { 
    name: "WhatsApp", 
    badge: "Active Group", 
    desc: "Study group for discussions", 
    link: "https://chat.whatsapp.com/EYeOgxDw8qp6oRMlnTjlfI",
    color: "#4ade80",
    bg: "rgba(74, 222, 128, 0.05)",
    glow: "rgba(74, 222, 128, 0.12)",
    badgeBg: "rgba(74, 222, 128, 0.1)",
    badgeBorder: "rgba(74, 222, 128, 0.2)",
    icon: FaWhatsapp
  },
  { 
    name: "YouTube", 
    badge: "Video Content", 
    desc: "Video tutorials — @pvtacademy", 
    link: "https://www.youtube.com/@pvtacademy",
    color: "#f87171",
    bg: "rgba(248, 113, 113, 0.05)",
    glow: "rgba(248, 113, 113, 0.12)",
    badgeBg: "rgba(248, 113, 113, 0.1)",
    badgeBorder: "rgba(248, 113, 113, 0.2)",
    icon: FaYoutube
  },
  { 
    name: "Instagram", 
    badge: "Daily Updates", 
    desc: "@privateacademy.in", 
    link: "https://www.instagram.com/privateacademy.in",
    color: "#f472b6",
    bg: "rgba(244, 114, 182, 0.05)",
    glow: "rgba(244, 114, 182, 0.12)",
    badgeBg: "rgba(244, 114, 182, 0.1)",
    badgeBorder: "rgba(244, 114, 182, 0.2)",
    icon: FaInstagram
  },
  { 
    name: "LinkedIn", 
    badge: "Professional", 
    desc: "linkedin.com/company/privateacademy", 
    link: "https://www.linkedin.com/company/privateacademy",
    color: "#60a5fa",
    bg: "rgba(96, 165, 250, 0.05)",
    glow: "rgba(96, 165, 250, 0.12)",
    badgeBg: "rgba(96, 165, 250, 0.1)",
    badgeBorder: "rgba(96, 165, 250, 0.2)",
    icon: FaLinkedin
  },
  { 
    name: "X (Twitter)", 
    badge: "Latest News", 
    desc: "@PVTAcademyEdu", 
    link: "https://x.com/PVTAcademyEdu",
    color: "#e2e8f0",
    bg: "rgba(226, 232, 240, 0.04)",
    glow: "rgba(226, 232, 240, 0.12)",
    badgeBg: "rgba(226, 232, 240, 0.08)",
    badgeBorder: "rgba(226, 232, 240, 0.15)",
    icon: FaTwitter
  }
];

export default function ContactPage() {
  return (
    <div style={{ 
      width: "100%", 
      maxWidth: "1000px", 
      margin: "0 auto", 
      padding: "4rem 1.5rem", 
      display: "flex", 
      flexDirection: "column", 
      gap: "4rem" 
    }}>
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: floatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .info-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: rgba(30, 41, 59, 0.2);
          transition: var(--transition);
        }
        .info-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.04);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.08);
        }
        .action-card {
          border: 1px solid var(--border);
          background: rgba(30, 41, 59, 0.15);
          border-radius: var(--radius);
          transition: var(--transition);
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.5rem;
          height: 100%;
        }
        .action-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.04);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.08);
        }
        .action-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }
        .action-card-badge {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--accent);
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          background: rgba(99, 102, 241, 0.06);
          transition: var(--transition);
        }
        .action-card:hover .action-card-badge {
          background: var(--accent);
          color: #ffffff;
          border-color: var(--accent);
        }
        .social-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: rgba(30, 41, 59, 0.15);
          transition: var(--transition);
          text-decoration: none;
          height: 100%;
        }
        .social-card:hover {
          transform: translateY(-4px);
          border-color: var(--brand-color) !important;
          background: var(--brand-bg) !important;
          box-shadow: 0 8px 24px -4px var(--brand-glow) !important;
        }
        .branch-tag {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          transition: var(--transition);
        }
        .branch-tag:hover {
          background: var(--accent-light);
          border-color: var(--accent);
          color: var(--text-primary);
          transform: translateY(-1px);
        }
        .fallback-contact-box {
          padding: 1.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.3) 100%);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .social-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .info-grid, .action-grid, .fallback-contact-box {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
        @media (max-width: 600px) {
          .social-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Header Section */}
      <header className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem", textAlign: "center", alignItems: "center" }} id="contact-header">
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
          marginBottom: "0.75rem",
          letterSpacing: "0.02em",
          textTransform: "uppercase"
        }}>
          Contact Info
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="contact-title">
          Contact —{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent), #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Private Academy Engineering
          </span>
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "1rem", maxWidth: "780px", lineHeight: 1.6 }} id="contact-desc">
          Support for engineering students across all academic queries and study material needs. Response time: <strong>within 24 hours</strong>.
        </p>
      </header>

      {/* Main Grid Content */}
      <main className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }} id="contact-main">
        
        {/* Contact Details Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Contact Info</h2>
          <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {/* Email */}
            <div className="info-card">
              <div style={{ color: "var(--accent)", display: "flex", flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.02em" }}>Email Address</div>
                <a href="mailto:privateacademy.in@gmail.com" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", textDecoration: "none" }}>
                  privateacademy.in@gmail.com
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="info-card">
              <div style={{ color: "var(--accent)", display: "flex", flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.02em" }}>Location</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Mumbai, Maharashtra, India (Remote)
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="info-card">
              <div style={{ color: "var(--accent)", display: "flex", flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.02em" }}>Response Time</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Within 24 hours
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Quick Actions</h2>
          <div className="action-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {[
              {
                title: "Need Specific Notes?",
                desc: "Request materials not available on the website",
                subject: "Note Request"
              },
              {
                title: "Report an Issue",
                desc: "Broken link or incorrect info",
                subject: "Issue Report"
              },
              {
                title: "Suggest Improvements",
                desc: "Ideas to improve the platform",
                subject: "Suggestion"
              }
            ].map((action, idx) => (
              <a
                key={idx}
                href={`mailto:privateacademy.in@gmail.com?subject=${encodeURIComponent(action.subject)}`}
                className="action-card"
              >
                <div className="action-card-header">
                  <span style={{ color: "var(--accent)", display: "flex" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <span className="action-card-badge">
                    {action.subject}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.25rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>{action.title}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{action.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Community & Social Platforms Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Community &amp; Social Platforms
          </h2>
          <div className="social-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {SOCIAL_PLATFORMS.map((soc, idx) => {
              const Icon = soc.icon;
              return (
                <a
                  key={idx}
                  href={soc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card"
                  style={{
                    // Pass dynamic CSS variable hover styles
                    "--brand-color": soc.color,
                    "--brand-bg": soc.bg,
                    "--brand-glow": soc.glow
                  } as React.CSSProperties}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ color: soc.color, display: "flex" }}>
                        <Icon />
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
                        {soc.name}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: "0.7rem", 
                      padding: "0.2rem 0.5rem", 
                      borderRadius: "4px", 
                      backgroundColor: soc.badgeBg, 
                      color: soc.color, 
                      border: `1px solid ${soc.badgeBorder}`,
                      fontWeight: 600,
                      whiteSpace: "nowrap"
                    }}>
                      {soc.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4, flexGrow: 1 }}>
                    {soc.desc}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem", fontWeight: 600, color: soc.color, marginTop: "0.25rem" }}>
                    <span>Join Channel</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: "inline-block" }}>
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Supported Branches */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Supported Branches
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["Computer Engineering", "Information Technology", "AIML", "Mechanical", "Chemical"].map((branch, idx) => (
              <span key={idx} className="branch-tag">
                {branch}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Direct Contacts Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Direct Contact
          </h2>
          <div className="fallback-contact-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 500 }}>Email Support:</span>
              <a href="mailto:privateacademy.in@gmail.com" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>
                privateacademy.in@gmail.com
              </a>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 500 }}>Telegram Channel:</span>
              <a href="https://t.me/mumcomputer" target="_blank" rel="noopener noreferrer" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>
                t.me/mumcomputer
              </a>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
