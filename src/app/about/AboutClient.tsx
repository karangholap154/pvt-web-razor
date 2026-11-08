"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LuSparkles,
  LuBookOpen,
  LuGraduationCap,
  LuAward,
  LuUsers,
  LuTrendingUp,
  LuShieldCheck,
  LuEye,
  LuWallet,
  LuDownload,
  LuChevronDown,
  LuMail,
  LuExternalLink,
  LuLayers,
} from "react-icons/lu";
import { FaLinkedin, FaXTwitter, FaGlobe } from "react-icons/fa6";
import styles from "./About.module.css";
import { BRANCHES } from "../../data/mockData";

const UNIVERSITIES = [
  { name: "Mumbai University", abbr: "MU", region: "Mumbai, MH" },
  { name: "Savitribai Phule Pune University", abbr: "SPPU", region: "Pune, MH" },
  { name: "Dr. Babasaheb Ambedkar Tech University", abbr: "DBATU", region: "Lonere, MH" },
  { name: "Shivaji University", abbr: "SUK", region: "Kolhapur, MH" },
  { name: "RTM Nagpur University", abbr: "RTMNU", region: "Nagpur, MH" },
  { name: "Sant Gadge Baba Amravati University", abbr: "SGBAU", region: "Amravati, MH" },
];

const CORE_VALUES = [
  {
    title: "Excellence",
    desc: "Rigorous syllabus-aligned screening ensures every note and past question is exam-ready and accurate.",
    icon: <LuAward size={20} />,
    color: "#B45309",
    bg: "#FEF3C7",
    border: "#FDE68A",
  },
  {
    title: "Accessibility",
    desc: "Free 3-page previews, low unlock barriers, and transparent indexing for every engineering student.",
    icon: <LuBookOpen size={20} />,
    color: "#15803D",
    bg: "#DCFCE7",
    border: "#BBF7D0",
  },
  {
    title: "Innovation",
    desc: "Modern digital reading experience, interactive Q&A discussions, and live contributor earnings calculators.",
    icon: <LuSparkles size={20} />,
    color: "#1D4ED8",
    bg: "#DBEAFE",
    border: "#BFDBFE",
  },
  {
    title: "Impact",
    desc: "Empowering thousands of students to master core concepts, clear tough subjects, and build confidence.",
    icon: <LuTrendingUp size={20} />,
    color: "#B91C1C",
    bg: "#FEE2E2",
    border: "#FECACA",
  },
];

const PLATFORM_PILLARS = [
  {
    title: "100% Syllabus Alignment",
    desc: "Every note is indexed directly to specific university schemes (NEP 2020, Rev-2019, CBCS) and semester roadmaps.",
    icon: <LuGraduationCap size={18} />,
  },
  {
    title: "Transparent 3-Page Previews",
    desc: "Inspect handwriting quality, index depth, and diagram clarity before unlocking any study note in the catalog.",
    icon: <LuEye size={18} />,
  },
  {
    title: "Direct Contributor Monetization",
    desc: "Peer authors earn up to 90% revenue share with weekly direct UPI settlements, turning good notes into income.",
    icon: <LuWallet size={18} />,
  },
  {
    title: "Instant Permanent Library",
    desc: "Unlocked PDFs stay permanently accessible in your account dashboard with one-click high-speed downloads.",
    icon: <LuDownload size={18} />,
  },
];

const FAQS = [
  {
    q: "Are the notes strictly aligned with current university syllabus schemes?",
    a: "Yes. Every uploaded study resource is reviewed against official university syllabus guidelines (including Mumbai University Rev-2019 and NEP 2020 schemes) to ensure curriculum relevance and exam preparation depth.",
  },
  {
    q: "Can I preview study material before unlocking?",
    a: "Absolutely. Every note on Private Academy includes a free 3-page interactive preview so you can evaluate legibility, topic coverage, and handwriting clarity before unlocking.",
  },
  {
    q: "How does note contribution and monetization work?",
    a: "Any student with verified notes can submit them via the Contribute portal. Once approved by our team, contributors earn between 70% to 90% revenue share on every unlock, paid directly via UPI with a ₹100 minimum threshold.",
  },
  {
    q: "Is checkout secure on Private Academy?",
    a: "Yes. All transactions are securely processed through Razorpay with PCI-DSS Level 1 compliance. We do not capture or store any card numbers, UPI PINs, or sensitive banking credentials.",
  },
  {
    q: "Can I request notes for a branch or subject not yet listed?",
    a: "Yes! You can post a doubt in our Discussions Forum or email us directly at info@privateacademy.in, and our contributor network will prioritize sourcing and reviewing material for your subject.",
  },
];

export default function AboutClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContainer}>
        {/* ================================================================
            1. HERO SECTION
            ================================================================ */}
        <header className={styles.heroSection}>
          <div className={styles.tagBadge}>
            <LuSparkles size={13} />
            <span>PLATFORM ORIGIN &amp; MISSION</span>
          </div>

          <h1 className={styles.heroTitle}>
            A study platform built by a student,{" "}
            <span className={styles.titleHighlight}>for students</span>.
          </h1>

          <p className={styles.heroSubtitle}>
            Private Academy Engineering is an open, verified academic platform built to provide branch-wise study notes, previous year question papers, and project walkthroughs customized to your university syllabus.
          </p>
        </header>

        {/* ================================================================
            2. STATS STRIP
            ================================================================ */}
        <section className={styles.statsStrip} aria-label="Platform Statistics">
          <div className={styles.statCell}>
            <span className={styles.statNumber}>2,500+</span>
            <span className={styles.statLabel}>Students Assisted</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>50,000+</span>
            <span className={styles.statLabel}>Verified Downloads</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>{BRANCHES.length}+</span>
            <span className={styles.statLabel}>Engineering Branches</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>98%</span>
            <span className={styles.statLabel}>Exam Readiness</span>
          </div>
        </section>

        {/* ================================================================
            3. THE ORIGIN STORY (TWO COLUMNS + STACKED SHEETS)
            ================================================================ */}
        <section className={styles.storySection} aria-labelledby="origin-story-title">
          <div className={styles.storyContent}>
            <span className={styles.eyebrowTag}>ORIGIN &amp; MOTIVATION</span>
            <h2 id="origin-story-title" className={styles.sectionTitle}>
              Solving the Engineering Semester Scramble
            </h2>

            <p className={styles.sectionDesc}>
              Every semester across engineering colleges in Maharashtra and across India, the same cycle repeats: students hunt through cluttered WhatsApp groups, broken Google Drive links, and incomplete photocopies 48 hours before university finals.
            </p>

            <p className={styles.sectionDesc}>
              Private Academy began as a personal library of organized handwritten notes, created to help batchmates study effectively without second-guessing whether their material matched the latest Mumbai University or SPPU syllabus patterns.
            </p>

            <p className={styles.sectionDesc}>
              Today, it has evolved into a peer-to-peer ecosystem where student contributors monetize high-grade academic materials, maintain verified syllabus alignment, and help thousands of future engineers clear their exams with confidence.
            </p>
          </div>

          {/* Stacked Notebook Sheets Visual Widget */}
          <div className={styles.stackedSheetsContainer} aria-hidden="true">
            <div className={styles.sheetBack} />
            <div className={styles.sheetMiddle} />
            <div className={styles.sheetFront}>
              <div className={styles.sheetHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <LuLayers size={14} style={{ color: "var(--blue-500, #2447F5)" }} />
                  <span className={styles.sheetMonoMeta}>ARCHIVE • VOL-01</span>
                </div>
                <span className={styles.sheetMonoMeta}>INDIA</span>
              </div>

              <blockquote className={styles.sheetQuote}>
                &ldquo;From one late-night study session to 50,000+ downloads across state technical universities.&rdquo;
              </blockquote>

              <div className={styles.sheetHighlightBox}>
                <span className={styles.sheetHighlightLabel}>CURATION STANDARD</span>
                <p className={styles.sheetHighlightText}>
                  Every note is pre-screened for syllabus relevance, diagram legibility, and chapter-wise completeness before publishing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            4. CORE VALUES BENTO GRID
            ================================================================ */}
        <section className={styles.valuesSection} aria-labelledby="core-values-title">
          <div className={styles.valuesHeader}>
            <span className={styles.eyebrowTag}>GUIDING PRINCIPLES</span>
            <h2 id="core-values-title" className={styles.sectionTitle}>
              Our Core Values
            </h2>
          </div>

          <div className={styles.valuesGrid}>
            {CORE_VALUES.map((val, i) => (
              <div key={i} className={styles.valueCard}>
                <div
                  className={styles.valueIconBadge}
                  style={{
                    backgroundColor: val.bg,
                    color: val.color,
                    borderColor: val.border,
                  }}
                >
                  {val.icon}
                </div>
                <h3 className={styles.valueTitle}>{val.title}</h3>
                <p className={styles.valueDesc}>{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            5. ACADEMIC COVERAGE: UNIVERSITIES & BRANCHES
            ================================================================ */}
        <section className={styles.coverageSection} aria-labelledby="coverage-title">
          <div className={styles.universitiesBlock}>
            <div className={styles.subSectionHeader}>
              <span className={styles.eyebrowTag}>ACADEMIC FOOTPRINT</span>
              <h2 id="coverage-title" className={styles.subSectionTitle}>
                Supported Universities
              </h2>
              <p className={styles.subSectionSubtitle}>
                Study materials calibrated to official exam patterns and university regulations.
              </p>
            </div>

            <div className={styles.universitiesGrid}>
              {UNIVERSITIES.map((uni, i) => (
                <div key={i} className={styles.uniCard}>
                  <div className={styles.uniInfo}>
                    <span className={styles.uniName} title={uni.name}>
                      {uni.name}
                    </span>
                    <span className={styles.uniRegion}>{uni.region}</span>
                  </div>
                  <span className={styles.uniAbbrBadge}>{uni.abbr}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.branchesBlock}>
            <div className={styles.subSectionHeader}>
              <h3 className={styles.subSectionTitle}>Engineering Branches Covered</h3>
              <p className={styles.subSectionSubtitle}>
                Select any branch to browse curated notes, PYQs, and syllabus roadmaps.
              </p>
            </div>

            <div className={styles.branchesList}>
              {BRANCHES.map((branch, i) => (
                <Link
                  key={i}
                  href={`/notes?branch=${encodeURIComponent(branch)}`}
                  className={styles.branchPill}
                  title={`Browse notes for ${branch}`}
                >
                  <LuGraduationCap size={14} style={{ color: "var(--blue-500, #2447F5)" }} />
                  <span>{branch}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            6. KEY FEATURES & PLATFORM PILLARS
            ================================================================ */}
        <section className={styles.featuresSection} aria-labelledby="features-title">
          <div className={styles.subSectionHeader}>
            <span className={styles.eyebrowTag}>THE PLATFORM PROMISE</span>
            <h2 id="features-title" className={styles.subSectionTitle}>
              Why Students Trust Private Academy
            </h2>
          </div>

          <div className={styles.featuresGrid}>
            {PLATFORM_PILLARS.map((pillar, i) => (
              <div key={i} className={styles.featureRow}>
                <div className={styles.featureIconWrap}>{pillar.icon}</div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>{pillar.title}</h3>
                  <p className={styles.featureDesc}>{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            7. FOUNDER DOSSIER CARD (DESIGN.md 4.11)
            ================================================================ */}
        <section className={styles.founderSection} aria-labelledby="founder-title">
          <div className={styles.subSectionHeader}>
            <span className={styles.eyebrowTag}>LEADERSHIP</span>
            <h2 id="founder-title" className={styles.subSectionTitle}>
              Founder Profile
            </h2>
          </div>

          <article className={styles.founderCard}>
            <div className={styles.founderAvatarCircle} aria-label="Karan Gholap Avatar">
              KG
            </div>

            <div className={styles.founderBody}>
              <div className={styles.founderHeader}>
                <h3 className={styles.founderName}>Karan Gholap</h3>
                <span className={styles.founderRole}>Founder &amp; Software Developer</span>
              </div>

              <p className={styles.founderBio}>
                Created Private Academy to provide engineering students across universities with a reliable, verified single source of truth for notes, past papers, and project guides. Actively builds developer tools and shares learnings in the engineering community.
              </p>

              <div className={styles.founderSocialsRow}>
                <a
                  href="https://linkedin.com/in/karangholap"
                  className={styles.socialPill}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Connect on LinkedIn"
                >
                  <FaLinkedin size={14} style={{ color: "#0A66C2" }} />
                  <span>LinkedIn</span>
                  <LuExternalLink size={12} style={{ color: "var(--slate-400)" }} />
                </a>

                <a
                  href="https://x.com/TheKaranGholap"
                  className={styles.socialPill}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Follow on X (Twitter)"
                >
                  <FaXTwitter size={13} />
                  <span>X (Twitter)</span>
                  <LuExternalLink size={12} style={{ color: "var(--slate-400)" }} />
                </a>

                <a
                  href="https://peerlist.io/karangholap"
                  className={styles.socialPill}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Peerlist Profile"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16H9V8h4.5c1.38 0 2.5 1.12 2.5 2.5S14.88 13 13.5 13H12v3z" />
                  </svg>
                  <span>Peerlist</span>
                  <LuExternalLink size={12} style={{ color: "var(--slate-400)" }} />
                </a>

                <a
                  href="https://www.karangholap.com/"
                  className={styles.socialPill}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Visit Personal Portfolio"
                >
                  <FaGlobe size={13} style={{ color: "var(--blue-500, #2447F5)" }} />
                  <span>Portfolio</span>
                  <LuExternalLink size={12} style={{ color: "var(--slate-400)" }} />
                </a>
              </div>
            </div>
          </article>
        </section>

        {/* ================================================================
            8. FREQUENTLY ASKED QUESTIONS
            ================================================================ */}
        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={styles.subSectionHeader}>
            <span className={styles.eyebrowTag}>COMMON QUESTIONS</span>
            <h2 id="faq-title" className={styles.subSectionTitle}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className={styles.faqList}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={styles.faqItem}>
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className={styles.faqQuestionBtn}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <LuChevronDown
                      size={18}
                      className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <p className={styles.faqAnswerText}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            9. CONTACT & COMMUNITY CTA
            ================================================================ */}
        <section className={styles.contactBanner} aria-labelledby="contact-title">
          <div className={styles.tagBadge}>
            <LuMail size={13} />
            <span>SUPPORT &amp; COLLABORATION</span>
          </div>

          <h2 id="contact-title" className={styles.contactTitle}>
            Have Questions or Want to Contribute?
          </h2>

          <p className={styles.contactText}>
            Whether you want to share verified study notes, report a university syllabus update, or suggest a new engineering department, we&apos;re always listening.
          </p>

          <div className={styles.contactActions}>
            <a href="mailto:info@privateacademy.in" className={styles.btnPrimary}>
              <LuMail size={15} />
              <span>info@privateacademy.in</span>
            </a>

            <Link href="/notes" className={styles.btnSecondary}>
              <LuBookOpen size={15} />
              <span>Explore Study Notes</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
