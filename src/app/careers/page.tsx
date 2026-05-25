import Link from "next/link";

interface JobRole {
  id: number;
  title: string;
  badge?: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
}

const jobOpenings: JobRole[] = [
  {
    id: 1,
    title: 'Content Creator & Educational Specialist',
    badge: 'Featured',
    department: 'Content',
    type: 'Internship',
    location: 'Remote',
    experience: '0-1 years',
    salary: '5-7k/month',
    description: 'Create high-quality educational content and study materials for engineering students across various universities.',
    requirements: [
      'Engineering degree (Computer/IT/AIML preferred)',
      'Excellent written and verbal communication',
      'Experience in content creation or teaching',
      'Knowledge of leading engineering university curricula',
      'Video editing and graphic design skills',
    ],
    responsibilities: [
      'Create study notes and educational materials',
      'Develop video tutorials and explanations',
      'Review and update existing content',
      'Collaborate with subject matter experts',
      'Ensure content quality and accuracy',
    ],
    benefits: [
      'Impact thousands of students',
      'Creative content creation tools',
      'Professional development opportunities',
      'Flexible schedule',
      'Performance incentives',
    ],
  },
  {
    id: 2,
    title: 'Marketing Intern',
    department: 'Marketing',
    type: 'Internship',
    location: 'Remote',
    experience: '0-1 years',
    salary: '5-7k/month',
    description: 'Help grow our community and reach more students through digital marketing and social media.',
    requirements: [
      'Currently pursuing or recently completed degree',
      'Strong social media presence and understanding',
      'Basic knowledge of digital marketing',
      'Creative thinking and content creation skills',
      'Excellent communication skills',
    ],
    responsibilities: [
      'Manage social media accounts',
      'Create engaging content for various platforms',
      'Assist with marketing campaigns',
      'Analyze social media metrics',
      'Support community engagement initiatives',
    ],
    benefits: [
      'Hands-on marketing experience',
      'Mentorship from senior team members',
      'Flexible internship schedule',
      'Certificate of completion',
      'Potential for full-time offer',
    ],
  },
];

export default function CareersPage() {
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
        .job-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border);
          background: rgba(30, 41, 59, 0.2);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .job-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.25);
          background: rgba(30, 41, 59, 0.35);
          box-shadow: 0 16px 28px -10px rgba(0, 0, 0, 0.4);
        }
        .apply-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--accent);
          color: #fff;
          font-weight: 700;
          padding: 0.7rem 1.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          transition: var(--transition);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
          cursor: pointer;
        }
        .apply-btn:hover {
          background-color: var(--accent-hover);
          transform: translateY(-1px);
        }
        .meta-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
        }
      `}</style>

      {/* Title */}
      <header className="animate-fade" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2.5rem", textAlign: "center" }} id="careers-header">
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
          Careers
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="careers-title">
          Join the{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent), #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Academy Team
          </span>
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", marginTop: "1rem", maxWidth: "680px", margin: "1rem auto 0", lineHeight: 1.6 }} id="careers-tagline">
          Help us build the next generation of engineering learning resources. We look for passionate educators, creative marketers, and builders.
        </p>
      </header>

      {/* Culture Section */}
      <section className="animate-fade" style={{ padding: "2rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "rgba(30, 41, 59, 0.1)" }} id="careers-culture-section">
        <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-primary)" }}>Why Contribute Here?</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "0.95rem" }}>
          Private Academy is a growing community hub. By joining us as an intern or content creator, you directly influence the study routines of thousands of students. We offer flexible remote work, fair competitive stipends, and letter of recommendation credentials to all active coordinators.
        </p>
      </section>

      {/* Jobs Listing */}
      <section className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="openings-section">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>Active Openings</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {jobOpenings.map((job) => (
            <article
              key={job.id}
              className="job-card"
              style={{
                borderRadius: "var(--radius-lg)",
                padding: "2.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.75rem"
              }}
              id={`job-${job.id}`}
            >
              {/* Job Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>{job.title}</h3>
                    {job.badge && (
                      <span style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        background: "linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)",
                        color: "#fff",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}>
                        {job.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.15rem" }}>
                    <span className="meta-badge">{job.department}</span>
                    <span className="meta-badge">{job.type}</span>
                    <span className="meta-badge">{job.location}</span>
                    <span className="meta-badge">{job.experience}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent)" }}>{job.salary}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>Stipend</span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                {job.description}
              </p>

              {/* Requirements & Responsibilities Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
                {/* Requirements */}
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "var(--accent)" }}>•</span> Requirements
                  </h4>
                  <ul style={{ listStyleType: "none", display: "flex", flexDirection: "column", gap: "0.5rem", padding: 0 }}>
                    {job.requirements.map((req, index) => (
                      <li key={index} style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.5", paddingLeft: "1rem", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: "rgba(255,255,255,0.2)" }}>-</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Responsibilities */}
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "var(--accent)" }}>•</span> Responsibilities
                  </h4>
                  <ul style={{ listStyleType: "none", display: "flex", flexDirection: "column", gap: "0.5rem", padding: 0 }}>
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.5", paddingLeft: "1rem", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: "rgba(255,255,255,0.2)" }}>-</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "var(--accent)" }}>•</span> Benefits
                  </h4>
                  <ul style={{ listStyleType: "none", display: "flex", flexDirection: "column", gap: "0.5rem", padding: 0 }}>
                    {job.benefits.map((benefit, index) => (
                      <li key={index} style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.5", paddingLeft: "1rem", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: "rgba(255,255,255,0.2)" }}>-</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Apply Action */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                <Link
                  href={`/contact?subject=Application for ${encodeURIComponent(job.title)}`}
                  className="apply-btn"
                  id={`btn-apply-job-${job.id}`}
                >
                  Apply for this Role
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
