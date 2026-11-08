"use client";

import React, { useState, useMemo } from "react";
import styles from "./Projects.module.css";
import {
  LuSearch,
  LuX,
  LuExternalLink,
  LuCheck,
  LuSend,
  LuMessageCircle,
  LuMail,
  LuCode,
  LuLayers,
} from "react-icons/lu";

export interface ProjectItem {
  id: string;
  title: string;
  branch: string;
  techStack: string[];
  description: string;
  githubUrl: string;
}

interface ProjectsClientProps {
  initialProjects: ProjectItem[];
}

// Fallback curated showcase projects from DESIGN.md Section 4.9 if database is empty
const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "proj-bilix-invoice",
    title: "Bilix Invoice & GST Generator",
    branch: "Information Technology",
    techStack: ["React", "TypeScript", "PDFMake", "Tailwind CSS"],
    description: "Automated GST-compliant invoicing system with real-time tax calculation, currency formatting, and one-click PDF generation.",
    githubUrl: "https://github.com/karangholap154/pvt-web-razor",
  },
  {
    id: "proj-crypto-dashboard",
    title: "Cryptocurrency Analytics Dashboard",
    branch: "Computer Engineering",
    techStack: ["Next.js", "Chart.js", "CoinGecko API", "Tailwind"],
    description: "Live crypto price tracker featuring WebSocket price streams, historical candlestick charts, and currency exchange calculator.",
    githubUrl: "https://github.com/karangholap154/pvt-web-razor",
  },
  {
    id: "proj-easy-health",
    title: "Easy Health Clinic Booking Portal",
    branch: "Information Technology",
    techStack: ["Node.js", "Express", "MongoDB", "React"],
    description: "Doctor appointment management platform with slot reservation, patient token queues, and SMS reminder notifications.",
    githubUrl: "https://github.com/karangholap154/pvt-web-razor",
  },
  {
    id: "proj-run-qr",
    title: "RunQR Dynamic Code Generator",
    branch: "Computer Engineering",
    techStack: ["TypeScript", "Canvas API", "Vite", "PWA"],
    description: "Fast in-browser dynamic QR generator supporting Wi-Fi credentials, UPI payment links, and vector SVG exports.",
    githubUrl: "https://github.com/karangholap154/pvt-web-razor",
  },
  {
    id: "proj-smart-tools",
    title: "Smart Tools Engineering Utility Hub",
    branch: "Computer Engineering",
    techStack: ["Python", "FastAPI", "React", "Docker"],
    description: "Modular developer utility workspace including JSON formatters, RegEx testers, Base64 converters, and syllabus diff checkers.",
    githubUrl: "https://github.com/karangholap154/pvt-web-razor",
  },
  {
    id: "proj-submit-portal",
    title: "Student Assignment Submit Portal",
    branch: "Information Technology",
    techStack: ["Supabase", "Next.js", "PostgreSQL", "Tailwind"],
    description: "Role-based lab assignment submission portal with plagiarism hash checks, deadline enforcement, and grade ledgers.",
    githubUrl: "https://github.com/karangholap154/pvt-web-razor",
  },
];

// Domains mapped according to DESIGN.md Section 4.9
const DOMAINS = [
  "All Domains",
  "Web development",
  "Mobile development",
  "Python projects",
  "React & modern JS",
  "Other domains",
];

const ENGINEERING_BRANCHES = [
  "Information Technology",
  "Computer Engineering",
  "Artificial Intelligence & Data Science",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Other / Multidisciplinary",
];

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  // Use DB projects if populated; fallback to default verified showcase
  const allProjects = useMemo(() => {
    if (initialProjects && initialProjects.length > 0) {
      return initialProjects;
    }
    return DEFAULT_PROJECTS;
  }, [initialProjects]);

  // Filtering & Search State
  const [selectedDomain, setSelectedDomain] = useState<string>("All Domains");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Project Request Form State
  const [formBranch, setFormBranch] = useState<string>("Information Technology");
  const [formSemester, setFormSemester] = useState<string>("Semester 6");
  const [formStack, setFormStack] = useState<string>("");
  const [formDesc, setFormDesc] = useState<string>("");
  const [formContact, setFormContact] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Compute filtered projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((proj) => {
      // Domain filter check
      let matchesDomain = true;
      if (selectedDomain !== "All Domains") {
        const domainLower = selectedDomain.toLowerCase();
        const stackStr = proj.techStack.join(" ").toLowerCase();
        const titleDesc = (proj.title + " " + proj.description).toLowerCase();

        if (domainLower.includes("web")) {
          matchesDomain = stackStr.includes("react") || stackStr.includes("next") || stackStr.includes("node") || stackStr.includes("css") || stackStr.includes("web");
        } else if (domainLower.includes("python")) {
          matchesDomain = stackStr.includes("python") || stackStr.includes("fastapi") || stackStr.includes("flask") || stackStr.includes("django");
        } else if (domainLower.includes("react")) {
          matchesDomain = stackStr.includes("react") || stackStr.includes("next") || stackStr.includes("typescript") || stackStr.includes("vite");
        } else if (domainLower.includes("mobile")) {
          matchesDomain = stackStr.includes("react native") || stackStr.includes("flutter") || stackStr.includes("android") || titleDesc.includes("mobile");
        } else {
          matchesDomain = true;
        }
      }

      // Search query check
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = proj.title.toLowerCase().includes(q);
        const matchDesc = proj.description.toLowerCase().includes(q);
        const matchStack = proj.techStack.some((t) => t.toLowerCase().includes(q));
        const matchBranch = proj.branch.toLowerCase().includes(q);
        matchesSearch = matchTitle || matchDesc || matchStack || matchBranch;
      }

      return matchesDomain && matchesSearch;
    });
  }, [allProjects, selectedDomain, searchQuery]);

  // Form Submission Handler
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare encoded message
    const message = `*Engineering Project Request - Private Academy*\n` +
      `• Branch: ${formBranch}\n` +
      `• Semester: ${formSemester}\n` +
      `• Preferred Tech Stack: ${formStack || "Open / Recommended"}\n` +
      `• Requirements: ${formDesc || "Standard micro/mini project with documentation"}\n` +
      `• Contact: ${formContact || "Not provided"}`;

    // Mark as submitted
    setFormSubmitted(true);

    // Optional quick dispatch to WhatsApp
    const waUrl = `https://wa.me/919423930547?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.pageRoot}>
      <div className={styles.graphPaperGrid} aria-hidden="true" />

      <main className={styles.container}>
        {/* ================================================================
            1. HERO HEADER (DESIGN.MD SECTION 4.9)
            ================================================================ */}
        <header className={styles.heroHeader} aria-labelledby="projects-page-title">
          <div className={styles.eyebrowTag}>
            <LuCode size={13} />
            <span>CAPSTONE &amp; MINI PROJECTS • SOURCE INCLUDED</span>
          </div>

          <h1 id="projects-page-title" className={styles.heroTitle}>
            Micro &amp; mini projects, <mark className={styles.highlighter}>source included</mark>.
          </h1>

          <p className={styles.heroTagline}>
            Tailored engineering project deliverables covering branch, semester, and modern tech stacks. Every project comes with verified source code, architecture documentation, and viva walkthroughs.
          </p>
        </header>

        {/* ================================================================
            2. STATS STRIP (DESIGN.MD SECTION 3.9)
            ================================================================ */}
        <section className={styles.statsStrip} aria-label="Project Repository Overview">
          <div className={styles.statCell}>
            <span className={styles.statNumber}>10+</span>
            <span className={styles.statLabel}>Live Demos Available</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>Sem 1–8</span>
            <span className={styles.statLabel}>Curriculum Aligned</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Source Code &amp; Docs</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>&lt; 24h</span>
            <span className={styles.statLabel}>Turnaround Delivery</span>
          </div>
        </section>

        {/* ================================================================
            3. HOW TO GET A PROJECT (3 STEPS INDEX)
            ================================================================ */}
        <section className={styles.stepsSection} aria-labelledby="steps-title">
          <div className={styles.sectionHeaderRow}>
            <span className={styles.sectionEyebrow}>ACQUISITION PROTOCOL</span>
            <h2 id="steps-title" className={styles.sectionTitle}>
              How to Get a Project
            </h2>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>STEP 01</span>
              <h3 className={styles.stepTitle}>Submit Specifications</h3>
              <p className={styles.stepDesc}>
                Share your engineering branch, semester, preferred programming stack, and project deadline via our request desk or WhatsApp.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepNum}>STEP 02</span>
              <h3 className={styles.stepTitle}>Receive Recommendations</h3>
              <p className={styles.stepDesc}>
                Our team pairs you with a production-ready micro or mini project precisely calibrated to your university exam syllabus.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepNum}>STEP 03</span>
              <h3 className={styles.stepTitle}>Get Deliverables &amp; Docs</h3>
              <p className={styles.stepDesc}>
                Receive clean GitHub repository access, deployment guides, database schemas, and viva presentation notes ready for demonstration.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================
            4. LIVE DEMOS SHOWCASE & CONTROLS DESK
            ================================================================ */}
        <section className={styles.showcaseSection} aria-labelledby="showcase-title">
          <div className={styles.sectionHeaderRow}>
            <span className={styles.sectionEyebrow}>VERIFIED REPOSITORY</span>
            <h2 id="showcase-title" className={styles.sectionTitle}>
              Live Demos Showcase
            </h2>
          </div>

          {/* Controls Desk: Search + Domain Filters */}
          <div className={styles.showcaseControls}>
            <div className={styles.searchAndCountRow}>
              <div className={styles.searchBox}>
                <LuSearch size={16} style={{ color: "#94A3B8", flexShrink: 0 }} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search projects by name, stack (e.g. React, Python), or branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search projects"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearSearchBtn}
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <LuX size={15} />
                  </button>
                )}
              </div>

              <span className={styles.projectCountBadge}>
                {filteredProjects.length} {filteredProjects.length === 1 ? "PROJECT" : "PROJECTS"} LISTED
              </span>
            </div>

            {/* Focus Area Domain Selector */}
            <div className={styles.domainTagsRow} role="radiogroup" aria-label="Filter by Domain">
              {DOMAINS.map((domain) => {
                const isActive = selectedDomain === domain;
                return (
                  <button
                    key={domain}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    className={`${styles.domainFilterBtn} ${isActive ? styles.domainFilterBtnActive : ""}`}
                    onClick={() => setSelectedDomain(domain)}
                  >
                    {isActive && <LuCheck size={12} />}
                    {domain}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3.12 PROJECT INDEX TABLE */}
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <span>IDX</span>
              <span>PROJECT SPECIFICATION</span>
              <span>STACK / ARCHITECTURE</span>
              <span style={{ textAlign: "right" }}>DEMO ACCESS</span>
            </div>

            <div className={styles.tableBody}>
              {filteredProjects.length === 0 ? (
                <div className={styles.emptyStateContainer}>
                  <div className={styles.emptyStateSheet} aria-hidden="true">
                    <div className={styles.emptySkeletonBar} style={{ width: "80%" }} />
                    <div className={styles.emptySkeletonBar} style={{ width: "60%" }} />
                    <div className={styles.emptySkeletonBar} style={{ width: "70%" }} />
                  </div>
                  <h3 className={styles.emptyTitle}>No matching projects found</h3>
                  <p className={styles.emptySubtitle}>
                    We couldn&apos;t find any project matching &ldquo;{searchQuery || selectedDomain}&rdquo;. Request custom source code below and we&apos;ll match your requirements!
                  </p>
                  <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDomain("All Domains");
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredProjects.map((proj, idx) => {
                  const formattedIndex = String(idx + 1).padStart(2, "0");
                  return (
                    <article
                      key={proj.id}
                      id={proj.id}
                      className={styles.projectRow}
                    >
                      {/* Index Col */}
                      <span className={styles.rowIndex}>{formattedIndex}</span>

                      {/* Name & Meta Col */}
                      <div className={styles.nameCol}>
                        <div className={styles.titleMetaRow}>
                          <h3 className={styles.projectTitle}>{proj.title}</h3>
                          <span className={styles.branchChip}>{proj.branch}</span>
                        </div>
                        <p className={styles.projectDesc}>{proj.description}</p>
                      </div>

                      {/* Tech Stack Col */}
                      <div className={styles.stackCol}>
                        {proj.techStack.map((tech) => (
                          <span key={tech} className={styles.techTag}>
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action Col */}
                      <div className={styles.actionCol}>
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.liveDemoBtn}
                          id={`btn-live-${proj.id}`}
                          aria-label={`Visit live demo for ${proj.title}`}
                        >
                          <span>Live Demo</span>
                          <LuExternalLink size={13} />
                        </a>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* ================================================================
            5. REQUEST A PROJECT DESK (DESIGN.MD SECTION 4.9)
            ================================================================ */}
        <section className={styles.requestSection} aria-labelledby="request-desk-title">
          <div className={styles.requestCardDesk}>
            {/* Left Dossier Column */}
            <div className={styles.requestDossier}>
              <div className={styles.dossierContent}>
                <span className={styles.dossierEyebrow}>CUSTOM ENGINEERING MATCH</span>
                <h2 id="request-desk-title" className={styles.dossierTitle}>
                  Can&apos;t find your exact project? Request a custom build.
                </h2>
                <p className={styles.dossierText}>
                  Tell us your branch, semester, and required stack. Our verified team matches you with ready-to-run source code, database scripts, and presentation notes within 24 hours.
                </p>

                <div className={styles.deliverablesList}>
                  <div className={styles.deliverableItem}>
                    <span className={styles.deliverableCheck}><LuCheck size={12} /></span>
                    <span>100% clean, modular source code with setup instructions</span>
                  </div>
                  <div className={styles.deliverableItem}>
                    <span className={styles.deliverableCheck}><LuCheck size={12} /></span>
                    <span>Complete documentation: ER diagrams, DFDs, and viva Q&amp;A</span>
                  </div>
                  <div className={styles.deliverableItem}>
                    <span className={styles.deliverableCheck}><LuCheck size={12} /></span>
                    <span>Semester syllabus compliance for MU, SPPU, DBATU &amp; more</span>
                  </div>
                </div>
              </div>

              {/* Direct Support Contacts */}
              <div className={styles.directContactsBox}>
                <span className={styles.directContactsLabel}>FAST-TRACK DIRECT CONTACT</span>
                <div className={styles.contactPillsRow}>
                  <a
                    href="https://wa.me/919423930547?text=Hi%20Private%20Academy%2C%20I%20want%20to%20request%20an%20engineering%20project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.waContactBtn}
                  >
                    <LuMessageCircle size={14} />
                    <span>WhatsApp Desk 1</span>
                  </a>

                  <a
                    href="https://wa.me/918421955664?text=Hi%20Private%20Academy%2C%20I%20want%20to%20request%20an%20engineering%20project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.waContactBtn}
                  >
                    <LuMessageCircle size={14} />
                    <span>WhatsApp Desk 2</span>
                  </a>

                  <a
                    href="mailto:info@privateacademy.in?subject=Engineering%20Project%20Request"
                    className={styles.emailContactBtn}
                  >
                    <LuMail size={14} />
                    <span>Email Support</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className={styles.requestFormCol}>
              {formSubmitted ? (
                <div className={styles.successBanner} role="status">
                  <div className={styles.successHeader}>
                    <LuCheck size={20} />
                    <span>Request Transmitted!</span>
                  </div>
                  <p className={styles.successText}>
                    Thank you! Your project requirements have been prepared. Our engineering coordinator will review your scope and respond via WhatsApp or email within 24 hours.
                  </p>
                  <div className={styles.successActions}>
                    <button
                      type="button"
                      className={styles.resetBtn}
                      onClick={() => setFormSubmitted(false)}
                    >
                      Submit Another Request
                    </button>
                    <a
                      href="https://wa.me/919423930547"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.waContactBtn}
                    >
                      <LuMessageCircle size={14} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className={styles.formGrid}>
                  {/* Branch Select */}
                  <div className={styles.formGroup}>
                    <label htmlFor="req-branch" className={styles.formLabel}>
                      Branch
                    </label>
                    <select
                      id="req-branch"
                      className={styles.formSelect}
                      value={formBranch}
                      onChange={(e) => setFormBranch(e.target.value)}
                      required
                    >
                      {ENGINEERING_BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Select */}
                  <div className={styles.formGroup}>
                    <label htmlFor="req-sem" className={styles.formLabel}>
                      Semester
                    </label>
                    <select
                      id="req-sem"
                      className={styles.formSelect}
                      value={formSemester}
                      onChange={(e) => setFormSemester(e.target.value)}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={`Semester ${s}`}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Tech Stack */}
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label htmlFor="req-stack" className={styles.formLabel}>
                      <span>Preferred Tech Stack</span>
                      <span className={styles.optionalTag}>Optional</span>
                    </label>
                    <input
                      id="req-stack"
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. React &amp; Node.js, Python / ML, Flutter, IoT, Java"
                      value={formStack}
                      onChange={(e) => setFormStack(e.target.value)}
                    />
                  </div>

                  {/* Project Scope / Description */}
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label htmlFor="req-desc" className={styles.formLabel}>
                      <span>Project Requirements &amp; Scope</span>
                    </label>
                    <textarea
                      id="req-desc"
                      className={styles.formTextarea}
                      placeholder="Describe what kind of micro/mini project you need, any specific topic, or submission constraints..."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  {/* Contact Info */}
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label htmlFor="req-contact" className={styles.formLabel}>
                      <span>Your Email or WhatsApp Phone</span>
                    </label>
                    <input
                      id="req-contact"
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. rahul@gmail.com or +91 98765 43210"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className={styles.fullCol} style={{ marginTop: "4px" }}>
                    <button type="submit" className={styles.submitBtn}>
                      <LuSend size={15} />
                      <span>Submit Project Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
