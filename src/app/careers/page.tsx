import type { Metadata } from "next";
import Link from "next/link";
import { Work_Sans, Caveat } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "Careers & Internships | Private Academy",
  description: "Join the Private Academy Engineering team! Explore remote internships for Content Creators, Educational Specialists, and Marketing Interns.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers & Internships | Private Academy",
    description: "Join the Private Academy Engineering team! Remote internships with competitive stipends.",
    url: "/careers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers & Internships | Private Academy",
    description: "Join the Private Academy Engineering team! Remote internships with competitive stipends.",
  },
};

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
    title: "Content Creator & Educational Specialist",
    badge: "Featured",
    department: "Content",
    type: "Internship",
    location: "Remote",
    experience: "0-1 years",
    salary: "5-7k/month",
    description: "Create high-quality educational content and study materials for engineering students across various universities.",
    requirements: [
      "Engineering degree (Computer/IT/AIML preferred)",
      "Excellent written and verbal communication",
      "Experience in content creation or teaching",
      "Knowledge of leading engineering university curricula",
      "Video editing and graphic design skills",
    ],
    responsibilities: [
      "Create study notes and educational materials",
      "Develop video tutorials and explanations",
      "Review and update existing content",
      "Collaborate with subject matter experts",
      "Ensure content quality and accuracy",
    ],
    benefits: [
      "Impact thousands of students",
      "Creative content creation tools",
      "Professional development opportunities",
      "Flexible schedule",
      "Performance incentives",
    ],
  },
  {
    id: 2,
    title: "Marketing Intern",
    department: "Marketing",
    type: "Internship",
    location: "Remote",
    experience: "0-1 years",
    salary: "5-7k/month",
    description: "Help grow our community and reach more students through digital marketing and social media.",
    requirements: [
      "Currently pursuing or recently completed degree",
      "Strong social media presence and understanding",
      "Basic knowledge of digital marketing",
      "Creative thinking and content creation skills",
      "Excellent communication skills",
    ],
    responsibilities: [
      "Manage social media accounts",
      "Create engaging content for various platforms",
      "Assist with marketing campaigns",
      "Analyze social media metrics",
      "Support community engagement initiatives",
    ],
    benefits: [
      "Hands-on marketing experience",
      "Mentorship from senior team members",
      "Flexible internship schedule",
      "Certificate of completion",
      "Potential for full-time offer",
    ],
  },
];

export default function CareersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Active Careers & Internships at Private Academy",
    "itemListElement": jobOpenings.map((job, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "employmentType": "INTERN",
        "hiringOrganization": {
          "@type": "Organization",
          "name": "Private Academy Engineering",
          "logo": "https://www.privateacademy.in/pvtimg.png",
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "Maharashtra",
            "addressCountry": "IN",
          },
        },
        "applicantLocationRequirements": {
          "@type": "Country",
          "name": "India",
        },
        "jobLocationType": "TELECOMMUTE",
      },
    })),
  };

  return (
    <div className={`${workSans.variable} ${caveat.variable} notebook-page-root`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        .notebook-page-root {
          --nb-paper: #fbfaf4;
          --nb-rule: #dbe6ef;
          --nb-margin: #c94f4f;
          --nb-ink: #1d3557;
          --nb-ink-dim: #5c7089;
          --nb-yellow: #ffe98a;
          --nb-mint: #bfe3d0;
          --nb-pink: #f6c9d3;
          --nb-card-line: #d9d2bd;

          position: relative;
          width: 100%;
          background:
            repeating-linear-gradient(to bottom, transparent 0 31px, var(--nb-rule) 31px 32px),
            var(--nb-paper);
          color: var(--nb-ink);
          font-family: var(--font-body), sans-serif;
          overflow: hidden;
        }

        .notebook-page-root a { color: inherit; }

        .notebook-page-root a:focus-visible,
        .notebook-page-root button:focus-visible {
          outline: 2px solid var(--nb-margin);
          outline-offset: 3px;
        }

        .nb-spine {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 58px;
          background:
            radial-gradient(circle at 50% 50%, var(--nb-paper) 0 5px, #c7cfd6 5px 6.5px, transparent 6.5px);
          background-size: 100% 34px;
          background-repeat: repeat-y;
          border-right: 1px solid var(--nb-rule);
        }

        .nb-margin-rule {
          position: absolute;
          top: 0;
          left: 92px;
          width: 2px;
          height: 100%;
          background: var(--nb-margin);
          opacity: 0.55;
          transform-origin: top;
          animation: nb-grow-line 1s ease-out both;
        }

        @keyframes nb-grow-line {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .nb-margin-rule { animation: none; transform: scaleY(1); }
        }

        .nb-shell {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          padding: 4.5rem 1.75rem 5rem 6.5rem;
        }

        /* ---------- header ---------- */
        .nb-tab {
          display: inline-block;
          font-family: var(--font-hand), cursive;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--nb-ink);
          background: var(--nb-yellow);
          padding: 0.2rem 0.9rem 0.35rem;
          transform: rotate(-2.5deg);
          box-shadow: 0 1px 2px rgba(0,0,0,0.12);
          margin-bottom: 1.4rem;
        }

        .notebook-page-root h1 {
          font-weight: 700;
          font-size: clamp(2.2rem, 4.6vw, 3.1rem);
          line-height: 1.1;
          letter-spacing: -0.01em;
          color: var(--nb-ink);
        }

        .nb-tagline {
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--nb-ink-dim);
          max-width: 62ch;
          margin-top: 1.2rem;
        }

        /* ---------- section heading ---------- */
        .nb-section-title {
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 1.4rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .nb-section-title::before {
          content: "";
          width: 8px;
          height: 8px;
          background: var(--nb-margin);
          border-radius: 50%;
          flex: none;
        }

        section { margin-top: 4rem; }

        /* ---------- culture card ---------- */
        .nb-culture-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.75rem 1.75rem 1.75rem 2rem;
          border-left: 4px solid var(--nb-margin);
          box-shadow: 0 3px 10px rgba(29, 53, 87, 0.05);
        }

        .nb-culture-card h2 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--nb-ink);
          margin-bottom: 0.6rem;
        }

        .nb-culture-card p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--nb-ink-dim);
          margin: 0;
        }

        /* ---------- job openings list ---------- */
        .nb-jobs-list {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .nb-job-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 2.25rem 2rem 2rem;
          box-shadow: 0 4px 14px rgba(29, 53, 87, 0.06);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .nb-job-card::before {
          content: "";
          position: absolute;
          top: -8px;
          left: 36px;
          width: 54px;
          height: 18px;
          background: rgba(29, 53, 87, 0.12);
          transform: rotate(-2deg);
        }

        .nb-job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        .nb-job-title-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .nb-job-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .nb-job-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--nb-ink);
          letter-spacing: -0.01em;
          margin: 0;
        }

        .nb-job-badge-tag {
          font-family: var(--font-hand), cursive;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--nb-ink);
          background: var(--nb-yellow);
          padding: 0.1rem 0.6rem 0.2rem;
          transform: rotate(-1.5deg);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .nb-job-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .nb-job-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--nb-paper);
          border: 1px solid var(--nb-card-line);
          padding: 0.25rem 0.65rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--nb-ink-dim);
        }

        .nb-salary-dossier {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: var(--nb-paper);
          border: 1px dashed var(--nb-card-line);
          padding: 0.5rem 0.9rem;
        }

        .nb-salary-amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--nb-ink);
        }

        .nb-salary-label {
          font-family: var(--font-hand), cursive;
          font-size: 1rem;
          color: var(--nb-margin);
        }

        .nb-job-desc {
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--nb-ink-dim);
          margin: 0;
        }

        /* ---------- job details 3-column grid ---------- */
        .nb-job-columns {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.75rem;
          background: var(--nb-paper);
          border: 1px solid var(--nb-card-line);
          padding: 1.4rem;
        }

        .nb-job-col-title {
          font-size: 0.88rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--nb-ink);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .nb-job-col-title::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--nb-margin);
        }

        .nb-job-col-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .nb-job-col-item {
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--nb-ink-dim);
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .nb-job-bullet {
          flex: none;
          color: var(--nb-margin);
          font-weight: 700;
          margin-top: -0.1rem;
        }

        /* ---------- job action footer ---------- */
        .nb-job-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          border-top: 1px dashed var(--nb-card-line);
          padding-top: 1.25rem;
        }

        .notebook-page-root .apply-btn,
        .apply-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          background: var(--nb-ink);
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.7rem 1.5rem;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .notebook-page-root .apply-btn:hover,
        .apply-btn:hover {
          background: var(--nb-margin);
          color: #ffffff !important;
          transform: translateY(-1px);
        }

        /* ---------- responsive ---------- */
        @media (max-width: 760px) {
          .nb-spine, .nb-margin-rule { display: none; }
          .nb-shell { padding: 3.25rem 1.25rem 3.5rem; }
          .nb-job-card { padding: 1.5rem 1.25rem; }
          .nb-salary-dossier { align-items: flex-start; text-align: left; width: 100%; }
          .nb-job-footer { justify-content: stretch; }
          .apply-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Decorative spine & red margin rule */}
      <div className="nb-spine" aria-hidden="true" />
      <div className="nb-margin-rule" aria-hidden="true" />

      <div className="nb-shell">
        {/* Header */}
        <header id="careers-header">
          <span className="nb-tab">Careers</span>
          <h1 id="careers-title">Join the Academy Team</h1>
          <p className="nb-tagline" id="careers-tagline">
            Help us build the next generation of engineering learning resources. We look for passionate educators, creative marketers, and builders.
          </p>
        </header>

        {/* Culture Section */}
        <section id="careers-culture-section">
          <div className="nb-culture-card">
            <h2>Why Contribute Here?</h2>
            <p>
              Private Academy is a growing community hub. By joining us as an intern or content creator, you directly influence the study routines of thousands of students. We offer flexible remote work, fair competitive stipends, and letter of recommendation credentials to all active coordinators.
            </p>
          </div>
        </section>

        {/* Active Openings Section */}
        <section id="openings-section">
          <h2 className="nb-section-title">Active Openings</h2>
          <div className="nb-jobs-list">
            {jobOpenings.map((job) => (
              <article className="nb-job-card" key={job.id} id={`job-${job.id}`}>
                {/* Header */}
                <div className="nb-job-header">
                  <div className="nb-job-title-group">
                    <div className="nb-job-title-row">
                      <h3 className="nb-job-title">{job.title}</h3>
                      {job.badge && (
                        <span className="nb-job-badge-tag">{job.badge}</span>
                      )}
                    </div>
                    <div className="nb-job-meta-row">
                      <span className="nb-job-meta-pill">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        {job.department}
                      </span>
                      <span className="nb-job-meta-pill">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {job.type}
                      </span>
                      <span className="nb-job-meta-pill">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="nb-job-meta-pill">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        {job.experience}
                      </span>
                    </div>
                  </div>

                  <div className="nb-salary-dossier">
                    <span className="nb-salary-amount">{job.salary}</span>
                    <span className="nb-salary-label">Stipend</span>
                  </div>
                </div>

                {/* Description */}
                <p className="nb-job-desc">{job.description}</p>

                {/* Requirements / Responsibilities / Benefits Columns */}
                <div className="nb-job-columns">
                  <div>
                    <div className="nb-job-col-title">Requirements</div>
                    <ul className="nb-job-col-list">
                      {job.requirements.map((req, idx) => (
                        <li className="nb-job-col-item" key={idx}>
                          <span className="nb-job-bullet" aria-hidden="true">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="nb-job-col-title">Responsibilities</div>
                    <ul className="nb-job-col-list">
                      {job.responsibilities.map((resp, idx) => (
                        <li className="nb-job-col-item" key={idx}>
                          <span className="nb-job-bullet" aria-hidden="true">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="nb-job-col-title">Benefits</div>
                    <ul className="nb-job-col-list">
                      {job.benefits.map((benefit, idx) => (
                        <li className="nb-job-col-item" key={idx}>
                          <span className="nb-job-bullet" aria-hidden="true">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apply Action */}
                <div className="nb-job-footer">
                  <Link
                    href={`/contact?subject=Application for ${encodeURIComponent(job.title)}`}
                    className="apply-btn"
                    id={`btn-apply-job-${job.id}`}
                  >
                    Apply for this Role
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    </div>
  );
}
