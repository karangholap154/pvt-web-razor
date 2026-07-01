import { supabase } from "../../utils/supabaseClient";

interface Project {
  id: string;
  title: string;
  branch: string;
  techStack: string[];
  description: string;
  githubUrl: string;
}

export default async function ProjectsPage() {
  let projects: Project[] = [];
  
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      console.warn("Failed to fetch projects from Supabase.", error);
    } else if (data) {
      projects = data.map((item) => ({
        id: item.id,
        title: item.title,
        branch: item.branch || "IT",
        techStack: item.tech_stack || [],
        description: item.description || "",
        githubUrl: item.github_url || ""
      }));
    }
  } catch (err) {
    console.error("General error loading projects from Supabase.", err);
  }

  return (
    <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "4rem" }}>
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
          background: rgba(24, 24, 27, 0.2);
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          background: rgba(251, 191, 36, 0.05);
          box-shadow: 0 10px 20px -10px rgba(251, 191, 36, 0.3);
        }
        .info-card {
          border: 1px solid var(--border);
          background: rgba(24, 24, 27, 0.15);
          border-radius: var(--radius);
        }
        .focus-badge {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          padding: 0.5rem 1.15rem;
          border-radius: 999px;
          transition: var(--transition);
        }
        .focus-badge:hover {
          background: var(--accent-light);
          border-color: var(--accent);
          color: var(--text-primary);
          transform: translateY(-1px);
        }
        .step-card {
          border: 1px solid var(--border);
          background: rgba(24, 24, 27, 0.15);
          position: relative;
          transition: all 0.3s ease;
        }
        .step-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent);
        }
        .step-num {
          position: absolute;
          top: -12px;
          left: 20px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent);
          color: #09090b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          box-shadow: 0 0 12px rgba(251, 191, 36, 0.4);
        }
        .project-card {
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: var(--transition);
          box-shadow: var(--shadow);
          justify-content: space-between;
        }
        .project-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          box-shadow: 0 12px 20px -10px rgba(251, 191, 36, 0.3);
        }
        .project-tech-tag {
          font-size: 0.725rem;
          background-color: var(--accent-light);
          border: 1px solid rgba(251, 191, 36, 0.2);
          color: var(--accent);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-weight: 600;
        }
        .preview-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
          border: 1px solid var(--border);
          font-weight: 600;
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          transition: var(--transition);
          cursor: pointer;
          text-align: center;
          width: 100%;
        }
        .preview-btn:hover {
          background-color: var(--text-primary);
          color: var(--background);
          transform: translateY(-1px);
        }
        .contact-cta {
          border: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(251, 146, 60, 0.05) 100%);
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
          background: linear-gradient(90deg, var(--accent), #fb923c);
        }
        .contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 700;
          transition: var(--transition);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .email-btn {
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          border: 1px solid var(--border);
        }
        .email-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: var(--text-secondary);
          transform: translateY(-1px);
        }
        .wa-btn {
          background-color: #25D366;
          color: #fff;
        }
        .wa-btn:hover {
          background-color: #20ba56;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Hero Header */}
      <header className="animate-fade" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2.5rem", textAlign: "center" }} id="projects-header">
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
          marginBottom: "1.25rem",
          letterSpacing: "0.02em",
          textTransform: "uppercase"
        }}>
          Projects
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="projects-title">
          Micro &amp; Mini Projects —{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent), #fb923c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Private Academy Engineering
          </span>
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", marginTop: "1rem", maxWidth: "680px", margin: "1rem auto 0", lineHeight: 1.6 }} id="projects-tagline">
          Tailored project support for <strong>IT engineering students</strong>, covering every semester. Projects come with full source code and documentation.
        </p>
      </header>

      {/* Stats Section */}
      <section className="animate-fade" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }} id="projects-stats-section">
        {[
          { num: "8+", label: "Live demos" },
          { num: "Every", label: "Semester-ready" },
          { num: "Full", label: "Source + docs" }
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ padding: "1.75rem", borderRadius: "var(--radius)", textAlign: "center" }}>
            <div style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{stat.num}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.35rem", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em" }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Focus Areas & What They Offer */}
      <div className="animate-fade" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
        
        {/* What They Offer */}
        <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>What We Offer</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              "Micro and mini projects matched to your semester and syllabus",
              "Full source code + documentation provided",
              "Helps you learn, present, and extend the project confidently"
            ].map((offer, i) => (
              <div key={i} className="info-card" style={{ display: "flex", gap: "0.75rem", padding: "1rem", alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent)", marginTop: "0.15rem" }}>✓</span>
                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{offer}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Focus Areas */}
        <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Focus Areas</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignContent: "flex-start" }}>
            {["Web development", "Mobile development", "Python projects", "React & modern JS", "Other domains"].map((focus, i) => (
              <span key={i} className="focus-badge">
                {focus}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* How to Get a Project (3-Step Guide) */}
      <section className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="projects-steps-section">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>How to Get a Project</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.75rem", marginTop: "0.5rem" }}>
          {[
            {
              step: "1",
              title: "Contact them",
              desc: "Share your branch, semester, and tech preferences via email or WhatsApp"
            },
            {
              step: "2",
              title: "Get matched",
              desc: "They recommend a suitable micro or mini project fitting your syllabus and stack"
            },
            {
              step: "3",
              title: "Receive deliverables",
              desc: "Source code + clear documentation to study and demonstrate"
            }
          ].map((item, i) => (
            <div key={i} className="step-card" style={{ padding: "2rem 1.5rem 1.5rem", borderRadius: "var(--radius)" }}>
              <div className="step-num">{item.step}</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem", marginTop: "0.5rem" }}>{item.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Projects Grid */}
      <section className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }} id="projects-listings-section">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>Live Demos Showcase</h2>

        {projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text-secondary)" }}>
            <h3>No projects available at this time.</h3>
          </div>
        ) : (
          <main style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }} id="projects-grid">
            {projects.map((proj) => (
              <article 
                className="project-card" 
                key={proj.id} 
                id={proj.id}
              >
                <div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="project-tech-tag"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{proj.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>{proj.description}</p>
                </div>
                
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-btn"
                  id={`btn-live-${proj.id}`}
                  style={{ marginTop: "1rem" }}
                >
                  Visit Live Demo
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </article>
            ))}
          </main>
        )}
      </section>

      {/* Support / Contact Section */}
      <section className="animate-fade contact-cta" style={{ padding: "2.5rem", borderRadius: "var(--radius-lg)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }} id="projects-contact-section">
        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>Request a Project</h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", maxWidth: "520px", lineHeight: "1.6" }}>
          Ready to get your project files? Reach out to us with your specifications and we will match you with the right build.
        </p>
        
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
          <a 
            href="mailto:privateacademy.in@gmail.com" 
            className="contact-btn email-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email Support
          </a>
          <a 
            href="https://wa.me/919423930547" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="contact-btn wa-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp 1
          </a>
          <a 
            href="https://wa.me/918421955664" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="contact-btn wa-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp 2
          </a>
        </div>
      </section>
    </div>
  );
}
