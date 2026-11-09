"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Careers.module.css";
import {
  LuBriefcase,
  LuClock,
  LuCheck,
  LuChevronDown,
  LuArrowRight,
  LuSparkles,
  LuAward,
  LuSend,
  LuShieldCheck,
} from "react-icons/lu";

export interface JobRole {
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

interface CareersClientProps {
  jobOpenings: JobRole[];
}

const DEPARTMENTS = ["All Roles", "Content", "Marketing"];

export default function CareersClient({ jobOpenings }: CareersClientProps) {
  // Default to expanding the first opening
  const [expandedRoleId, setExpandedRoleId] = useState<number | null>(
    jobOpenings.length > 0 ? jobOpenings[0].id : null
  );
  const [selectedDept, setSelectedDept] = useState("All Roles");

  // Toggle role accordion
  const toggleRole = (id: number) => {
    setExpandedRoleId((prev) => (prev === id ? null : id));
  };

  // Filtered jobs
  const filteredJobs = jobOpenings.filter((job) => {
    if (selectedDept === "All Roles") return true;
    return job.department.toLowerCase() === selectedDept.toLowerCase();
  });

  return (
    <div className={styles.pageRoot}>
      <div className={styles.graphPaperGrid} aria-hidden="true" />

      <main className={styles.container}>
        {/* ================================================================
            1. HERO HEADER (DESIGN.MD SECTION 4.12)
            ================================================================ */}
        <header className={styles.heroHeader} aria-labelledby="careers-page-title">
          <div className={styles.eyebrowTag}>
            <LuBriefcase size={13} />
            <span>OPPORTUNITIES • STUDENT FIRST</span>
          </div>

          <h1 id="careers-page-title" className={styles.heroTitle}>
            Join the <mark className={styles.highlighter}>Academy Team</mark>.
          </h1>

          <p className={styles.heroTagline}>
            Help us build the next generation of verified engineering learning resources. We look for passionate educators, student developers, and community coordinators across all state universities.
          </p>
        </header>

        {/* ================================================================
            2. CULTURE & PERKS STRIP (DESIGN.MD SECTION 3.9)
            ================================================================ */}
        <section className={styles.perksStrip} aria-label="Internship Benefits Overview">
          <div className={styles.perkCell}>
            <span className={styles.perkStat}>100% Remote</span>
            <span className={styles.perkLabel}>Flexible Schedule</span>
            <p className={styles.perkDesc}>Work around your college lectures, unit tests, and semester final exams.</p>
          </div>

          <div className={styles.perkCell}>
            <span className={styles.perkStat}>₹5k–₹7k/mo</span>
            <span className={styles.perkLabel}>Transparent Stipend</span>
            <p className={styles.perkDesc}>Direct UPI monthly compensation plus performance completion bonuses.</p>
          </div>

          <div className={styles.perkCell}>
            <span className={styles.perkStat}>Verified LOR</span>
            <span className={styles.perkLabel}>Academic Credentials</span>
            <p className={styles.perkDesc}>Official internship completion certificate &amp; verified LinkedIn recommendation.</p>
          </div>
        </section>

        {/* ================================================================
            3. OPEN ROLES INDEX SECTION (DESIGN.MD SECTION 4.12 & 3.11)
            ================================================================ */}
        <section className={styles.rolesSection} aria-labelledby="roles-heading">
          <div className={styles.sectionHeaderRow}>
            <span className={styles.sectionEyebrow}>ACTIVE OPENINGS ({filteredJobs.length})</span>
            <h2 id="roles-heading" className={styles.sectionTitle}>
              Available Positions
            </h2>
          </div>

          {/* Department Filter Bar */}
          <div className={styles.filterBar} role="radiogroup" aria-label="Filter by Department">
            {DEPARTMENTS.map((dept) => {
              const isActive = selectedDept === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ""}`}
                  onClick={() => setSelectedDept(dept)}
                >
                  {isActive && <LuCheck size={12} />}
                  <span>{dept}</span>
                </button>
              );
            })}
          </div>

          {/* SECTION 3.11 HAIRLINE INDEX TABLE */}
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <span>ROLE SPECIFICATION</span>
              <span>DEPARTMENT</span>
              <span>TYPE</span>
              <span>STIPEND</span>
              <span style={{ textAlign: "right" }}>DETAILS</span>
            </div>

            <div className={styles.tableBody}>
              {filteredJobs.map((job) => {
                const isExpanded = expandedRoleId === job.id;
                return (
                  <article key={job.id} className={styles.roleItem} id={`job-${job.id}`}>
                    {/* Clickable Row Header */}
                    <div
                      className={`${styles.roleRowHeader} ${isExpanded ? styles.roleRowHeaderActive : ""}`}
                      onClick={() => toggleRole(job.id)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-controls={`drawer-${job.id}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleRole(job.id);
                        }
                      }}
                    >
                      {/* Title & Badge */}
                      <div className={styles.roleTitleCol}>
                        <h3 className={styles.roleTitle}>{job.title}</h3>
                        {job.badge && (
                          <span className={styles.badgeFeatured}>{job.badge}</span>
                        )}
                      </div>

                      {/* Department */}
                      <div className={styles.deptCol}>{job.department}</div>

                      {/* Type */}
                      <div className={styles.typeCol}>{job.type}</div>

                      {/* Stipend */}
                      <div>
                        <span className={styles.stipendPill}>{job.salary}</span>
                      </div>

                      {/* Expand Chevron Action */}
                      <div className={styles.expandCol}>
                        <span>{isExpanded ? "Collapse" : "View"}</span>
                        <LuChevronDown
                          size={15}
                          className={`${styles.chevronIcon} ${isExpanded ? styles.chevronIconRotated : ""}`}
                        />
                      </div>
                    </div>

                    {/* Expandable Role Drawer */}
                    {isExpanded && (
                      <div className={styles.roleDrawer} id={`drawer-${job.id}`}>
                        <p className={styles.drawerDescription}>{job.description}</p>

                        <div className={styles.breakdownGrid}>
                          {/* Requirements */}
                          <div className={styles.breakdownCard}>
                            <h4 className={styles.breakdownTitle}>
                              <LuCheck size={13} />
                              <span>Key Requirements</span>
                            </h4>
                            <ul className={styles.breakdownList}>
                              {job.requirements.map((req, i) => (
                                <li key={i} className={styles.breakdownItem}>
                                  <span className={styles.bulletDot}>•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Responsibilities */}
                          <div className={styles.breakdownCard}>
                            <h4 className={styles.breakdownTitle}>
                              <LuBriefcase size={13} />
                              <span>Responsibilities</span>
                            </h4>
                            <ul className={styles.breakdownList}>
                              {job.responsibilities.map((resp, i) => (
                                <li key={i} className={styles.breakdownItem}>
                                  <span className={styles.bulletDot}>•</span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Benefits */}
                          <div className={styles.breakdownCard}>
                            <h4 className={styles.breakdownTitle}>
                              <LuAward size={13} />
                              <span>Perks &amp; Growth</span>
                            </h4>
                            <ul className={styles.breakdownList}>
                              {job.benefits.map((ben, i) => (
                                <li key={i} className={styles.breakdownItem}>
                                  <span className={styles.bulletDot}>•</span>
                                  <span>{ben}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Apply Action Footer */}
                        <div className={styles.drawerFooter}>
                          <div className={styles.drawerMetaSummary}>
                            <span className={styles.metaChip}>LOCATION: {job.location}</span>
                            <span className={styles.metaChip}>• EXP: {job.experience}</span>
                            <span className={styles.metaChip}>• DIRECT COORDINATOR SUPPORT</span>
                          </div>

                          <Link
                            href={`/contact?subject=Application for ${encodeURIComponent(job.title)}`}
                            className={styles.applyBtn}
                            id={`btn-apply-job-${job.id}`}
                          >
                            <span>Apply for this Role</span>
                            <LuArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================
            4. SPONTANEOUS APPLICATION DESK (DESIGN.MD SECTION 4.12)
            ================================================================ */}
        <section className={styles.spontaneousSection} aria-labelledby="spontaneous-heading">
          <div className={styles.spontaneousLeft}>
            <span className={styles.sectionEyebrow}>OPEN SPECIFICATION</span>
            <h3 id="spontaneous-heading" className={styles.spontaneousTitle}>
              Don&apos;t see a role matching your exact skills?
            </h3>
            <p className={styles.spontaneousDesc}>
              We are always looking for passionate engineering students, open-source contributors, UI designers, and campus leads. Send us an open proposal telling us how you would like to help.
            </p>
          </div>

          <div className={styles.spontaneousActions}>
            <Link
              href="/contact?subject=Spontaneous Internship Application"
              className={styles.spontaneousBtn}
            >
              <LuSend size={14} />
              <span>Submit General Application</span>
            </Link>

            <Link href="/contribute" className={styles.contributeLinkBtn}>
              <LuSparkles size={14} style={{ color: "#2563EB" }} />
              <span>Contribute Study Notes</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
