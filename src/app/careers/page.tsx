import Link from "next/link";
import cardStyles from "../page.module.css"; // Reuse card effects

interface JobRole {
  id: string;
  title: string;
  department: string;
  location: string;
  stipend: string;
  description: string;
  requirements: string[];
}

const jobOpenings: JobRole[] = [
  {
    id: "job-sme",
    title: "Subject Matter Expert (Notes Creator)",
    department: "Academic Content",
    location: "Remote / Part-time",
    stipend: "₹8,000 - ₹15,000 / month",
    description: "Write clear, structured, and exam-oriented study blueprints and formula sheets for engineering courses.",
    requirements: [
      "Must have scored 8.5+ SGPA/CGPA in the relevant engineering subject.",
      "Excellent handwriting or ability to type neat LaTeX/Markdown documents.",
      "Currently pursuing or completed B.E. / B.Tech in Computer, IT, AIML, Mechanical, or Chemical Engineering."
    ]
  },
  {
    id: "job-video",
    title: "Video Tutorial Creator",
    department: "Multimedia & Video",
    location: "Remote / Flexible Hours",
    stipend: "₹1,200 - ₹2,500 / video module",
    description: "Record concise 10-15 minute screen-cast video tutorials explaining complex concepts and solving numericals.",
    requirements: [
      "Clear verbal communication in English/Hindi.",
      "Access to a decent microphone, stylus tablet (for writing explanations), and screen recording software.",
      "Ability to break down heavy derivations or compiler algorithms into plain visual steps."
    ]
  },
  {
    id: "job-dev",
    title: "Platform Frontend Contributor",
    department: "Engineering",
    location: "Remote / Internship",
    stipend: "₹10,000 / month + Certificate",
    description: "Maintain and upgrade the Private Academy platform, develop interactive mock testing modules, and optimize core web vitals.",
    requirements: [
      "Solid hands-on experience with Next.js, React, TypeScript, and CSS Modules.",
      "Familiarity with Git branching, pull request workflows, and component testing.",
      "Understanding of SEO, responsive layouts, and modern accessibility guidelines."
    ]
  }
];

export default function CareersPage() {
  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "3.5rem" }}>
      {/* Title */}
      <header style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }} id="careers-header">
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em" }} id="careers-title">Careers at Private Academy</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Help us build the next generation of engineering learning resources. We look for passionate educators and builders.
        </p>
      </header>

      {/* Intro section */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }} id="careers-culture-section">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Why Contribute Here?</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1rem" }}>
          Private Academy is a growing community hub. By joining us as a content creator or platform developer, you directly 
          influence the study routines of thousands of students. We offer flexible remote work, fair competitive stipends, 
          and letter of recommendation credentials to all active student coordinators.
        </p>
      </section>

      {/* Jobs Listing */}
      <section style={{ display: "flex", flexDirection: "column", gap: "2rem" }} id="openings-section">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Active Openings</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {jobOpenings.map((job) => (
            <article
              key={job.id}
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem"
              }}
              id={job.id}
            >
              {/* Job Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>{job.title}</h3>
                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600, marginTop: "0.25rem" }}>
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border)",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "999px",
                    color: "var(--text-primary)"
                  }}
                >
                  {job.stipend}
                </span>
              </div>

              {/* Description */}
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                {job.description}
              </p>

              {/* Requirements list */}
              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>Requirements:</h4>
                <ul style={{ listStyleType: "disc", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {job.requirements.map((req, index) => (
                    <li key={index} style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply action */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
                <Link
                  href={`/contact?subject=Application for ${encodeURIComponent(job.title)}`}
                  className={cardStyles.btnPrimary}
                  style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}
                  id={`btn-apply-job-${job.id}`}
                >
                  Apply for this Role
                </Link>
              </div>

            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
