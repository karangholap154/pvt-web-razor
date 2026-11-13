"use client";

import React, { useState } from "react";
import styles from "./Contact.module.css";
import { BRANCHES } from "../../data/mockData";
import {
  LuMail,
  LuClock,
  LuMapPin,
  LuSend,
  LuCheck,
  LuExternalLink,
  LuMessageCircle,
} from "react-icons/lu";

// Custom SVG Icons for Social Platforms
const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const WhatsappIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const SOCIAL_CHANNELS = [
  {
    name: "Telegram Community",
    handle: "t.me/mumcomputer",
    badge: "2.5K+ Students",
    link: "https://t.me/mumcomputer",
    icon: TelegramIcon,
    color: "#0284C7",
    bg: "#E0F2FE",
  },
  {
    name: "WhatsApp Study Group",
    handle: "Active Batch Discussions",
    badge: "Active Group",
    link: "https://chat.whatsapp.com/EYeOgxDw8qp6oRMlnTjlfI",
    icon: WhatsappIcon,
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  {
    name: "YouTube Channel",
    handle: "@pvtacademy",
    badge: "Video Tutorials",
    link: "https://www.youtube.com/@pvtacademy",
    icon: YoutubeIcon,
    color: "#DC2626",
    bg: "#FEE2E2",
  },
  {
    name: "Instagram",
    handle: "@privateacademy.in",
    badge: "Daily Updates",
    link: "https://www.instagram.com/privateacademy.in",
    icon: InstagramIcon,
    color: "#DB2777",
    bg: "#FCE7F3",
  },
  {
    name: "LinkedIn",
    handle: "company/privateacademy",
    badge: "Professional",
    link: "https://www.linkedin.com/company/privateacademy",
    icon: LinkedinIcon,
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  {
    name: "X (Twitter)",
    handle: "@PVTAcademyEdu",
    badge: "Announcements",
    link: "https://x.com/PVTAcademyEdu",
    icon: TwitterIcon,
    color: "#0F172A",
    bg: "#F1F5F9",
  },
];

const TOPIC_OPTIONS = [
  "Note issue or syllabus mismatch",
  "Payment or checkout assistance",
  "Contributor upload & payout",
  "Engineering project request",
  "General inquiry or feedback",
];

export default function ContactClient() {
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0]);
  const [noteUrl, setNoteUrl] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot detection
    if (honeypot.trim()) {
      return;
    }

    // Format mailto payload
    const mailSubject = `[Private Academy Contact] ${topic} - ${name}`;
    const mailBody = `Name: ${name}\n` +
      `Email/Contact: ${email}\n` +
      `Topic: ${topic}\n` +
      (noteUrl ? `Note Reference URL: ${noteUrl}\n` : "") +
      `\nMessage:\n${message}`;

    // Mark as confirmed
    setIsSubmitted(true);

    // Trigger user's mail client in background
    const mailtoUri = `mailto:info@privateacademy.in?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    window.location.href = mailtoUri;
  };

  return (
    <div className={styles.pageRoot}>
      <div className={styles.graphPaperGrid} aria-hidden="true" />

      <main className={styles.container}>
        {/* ================================================================
            1. HERO HEADER (DESIGN.MD SECTION 4.13)
            ================================================================ */}
        <header className={styles.heroHeader} aria-labelledby="contact-page-title">
          <div className={styles.eyebrowTag}>
            <span className={styles.statusDot} />
            <span>COMMUNICATION DESK • 24H SLA</span>
          </div>

          <h1 id="contact-page-title" className={styles.heroTitle}>
            Say <mark className={styles.highlighter}>hello</mark>.
          </h1>

          <p className={styles.heroTagline}>
            Support for engineering students across all academic queries, syllabus coverage, payments, and contributor payouts. We respond to every inquiry within 24 hours.
          </p>
        </header>

        {/* ================================================================
            2. TWO-COLUMN DESK LAYOUT (DESIGN.MD SECTION 4.13)
            ================================================================ */}
        <div className={styles.deskLayout}>
          {/* --------------------------------------------------------------
              LEFT COLUMN: DIRECTORY & CHANNELS
              -------------------------------------------------------------- */}
          <div className={styles.directoryCol}>
            {/* Core Channels */}
            <div className={styles.coreCardsGrid}>
              {/* Email Official */}
              <a
                href="mailto:info@privateacademy.in"
                className={styles.channelCard}
                aria-label="Email Private Academy Support"
              >
                <div className={styles.channelCardLeft}>
                  <div className={styles.channelIconBadge} style={{ backgroundColor: "var(--blue-50, #EEF2FF)", color: "var(--blue-500, #2447F5)" }}>
                    <LuMail size={20} />
                  </div>
                  <div className={styles.channelInfo}>
                    <h3 className={styles.channelName}>Official Support Email</h3>
                    <p className={styles.channelDesc}>info@privateacademy.in</p>
                  </div>
                </div>
                <div className={styles.channelActionTag} style={{ color: "var(--blue-500, #2447F5)" }}>
                  <span>Send Email</span>
                  <LuExternalLink size={13} />
                </div>
              </a>

              {/* Response Time SLA Card */}
              <div className={styles.channelCard} style={{ cursor: "default" }}>
                <div className={styles.channelCardLeft}>
                  <div className={styles.channelIconBadge} style={{ backgroundColor: "#E4F5EC", color: "#0F7B4F" }}>
                    <LuClock size={20} />
                  </div>
                  <div className={styles.channelInfo}>
                    <h3 className={styles.channelName}>Guaranteed Response Time</h3>
                    <p className={styles.channelDesc}>Within 24 hours on all academic days</p>
                  </div>
                </div>
                <div className={styles.channelActionTag} style={{ color: "#0F7B4F" }}>
                  <span>24h SLA</span>
                </div>
              </div>

              {/* Location Card */}
              <div className={styles.channelCard} style={{ cursor: "default" }}>
                <div className={styles.channelCardLeft}>
                  <div className={styles.channelIconBadge} style={{ backgroundColor: "#FFF8D1", color: "#B45309" }}>
                    <LuMapPin size={20} />
                  </div>
                  <div className={styles.channelInfo}>
                    <h3 className={styles.channelName}>Headquarters</h3>
                    <p className={styles.channelDesc}>Maharashtra, India (MU, SPPU &amp; DBATU)</p>
                  </div>
                </div>
                <div className={styles.channelActionTag} style={{ color: "#B45309" }}>
                  <span>Statewide</span>
                </div>
              </div>
            </div>

            {/* Quick Action Presets */}
            <div className={styles.quickActionsSection}>
              <div className={styles.sectionHeaderRow}>
                <span className={styles.sectionEyebrow}>FAST ACTION SHORTCUTS</span>
                <h2 className={styles.sectionTitle}>Common Inquiries</h2>
              </div>

              <div className={styles.quickActionsGrid}>
                <a
                  href="mailto:info@privateacademy.in?subject=Note%20Request%20-%20Private%20Academy"
                  className={styles.quickActionCard}
                >
                  <span className={`${styles.quickActionBadge} ${styles.badgeRequest}`}>Request</span>
                  <div className={styles.quickActionTitle}>Need Specific Notes?</div>
                  <p className={styles.quickActionDesc}>Request materials not yet published for your syllabus</p>
                </a>

                <a
                  href="mailto:info@privateacademy.in?subject=Issue%20Report%20-%20Private%20Academy"
                  className={styles.quickActionCard}
                >
                  <span className={`${styles.quickActionBadge} ${styles.badgeReport}`}>Report</span>
                  <div className={styles.quickActionTitle}>Report an Issue</div>
                  <p className={styles.quickActionDesc}>Flag broken links, missing pages, or syllabus deviations</p>
                </a>

                <a
                  href="mailto:info@privateacademy.in?subject=Platform%20Suggestion%20-%20Private%20Academy"
                  className={styles.quickActionCard}
                >
                  <span className={`${styles.quickActionBadge} ${styles.badgeIdea}`}>Idea</span>
                  <div className={styles.quickActionTitle}>Suggest Feedback</div>
                  <p className={styles.quickActionDesc}>Propose new tools, features, or branch study guides</p>
                </a>
              </div>
            </div>

            {/* Community & Social Channels */}
            <div className={styles.socialSection}>
              <div className={styles.sectionHeaderRow}>
                <span className={styles.sectionEyebrow}>STUDENT HUBS &amp; UPDATES</span>
                <h2 className={styles.sectionTitle}>Community Channels</h2>
              </div>

              <div className={styles.socialGrid}>
                {SOCIAL_CHANNELS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={idx}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialCard}
                    >
                      <div className={styles.socialLeft}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: item.bg,
                            color: item.color,
                            flexShrink: 0,
                          }}
                        >
                          <Icon />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span className={styles.socialName}>{item.name}</span>
                          <span className={styles.socialHandle}>{item.handle}</span>
                        </div>
                      </div>
                      <span className={styles.socialBadge}>{item.badge}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Supported Engineering Branches Index */}
            <div className={styles.branchesSection}>
              <div className={styles.sectionHeaderRow}>
                <span className={styles.sectionEyebrow}>ACADEMIC COVERAGE</span>
                <h2 className={styles.sectionTitle}>Supported Branches</h2>
              </div>

              <div className={styles.branchesTagsRow}>
                {BRANCHES.map((b, idx) => (
                  <span key={idx} className={styles.branchTag}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------
              RIGHT COLUMN: ENGINEERED INQUIRY FORM (DESIGN.MD §4.13)
              -------------------------------------------------------------- */}
          <div className={styles.formDeskCard}>
            <div className={styles.formDeskHeader}>
              <span className={styles.sectionEyebrow}>DIRECT DISPATCH</span>
              <h2 className={styles.formDeskTitle}>Send an Inquiry</h2>
              <p className={styles.formDeskDesc}>
                Fill out the spec sheet below. Our academic and developer support desk will route your ticket immediately.
              </p>
            </div>

            {isSubmitted ? (
              <div className={styles.successBanner} role="status">
                <div className={styles.successHeader}>
                  <LuCheck size={22} />
                  <span>Inquiry Dispatched!</span>
                </div>
                <p className={styles.successText}>
                  Thanks! Your inquiry has been formatted and prepared for our support team. We will review your academic inquiry and reply via email within 24 hours.
                </p>
                <div className={styles.successActions}>
                  <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage("");
                      setNoteUrl("");
                    }}
                  >
                    Send Another Inquiry
                  </button>
                  <a
                    href="https://chat.whatsapp.com/EYeOgxDw8qp6oRMlnTjlfI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.waSuccessBtn}
                  >
                    <WhatsappIcon />
                    <span>Join WhatsApp Group</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.formGrid}>
                {/* Honeypot field (hidden from view for anti-spam) */}
                <input
                  type="text"
                  name="user_verification_token"
                  className={styles.honeypotField}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {/* Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="student-name" className={styles.formLabel}>
                    Full Name
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. Karan Gholap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email or Contact */}
                <div className={styles.formGroup}>
                  <label htmlFor="student-email" className={styles.formLabel}>
                    Email Address
                  </label>
                  <input
                    id="student-email"
                    type="email"
                    className={styles.formInput}
                    placeholder="e.g. karan@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Topic Select */}
                <div className={styles.formGroup}>
                  <label htmlFor="inquiry-topic" className={styles.formLabel}>
                    Inquiry Topic
                  </label>
                  <select
                    id="inquiry-topic"
                    className={styles.formSelect}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  >
                    {TOPIC_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Note URL Reference */}
                <div className={styles.formGroup}>
                  <label htmlFor="note-url" className={styles.formLabel}>
                    <span>Note Link or Reference</span>
                    <span className={styles.optionalTag}>Optional</span>
                  </label>
                  <input
                    id="note-url"
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. https://privateacademy.in/notes/mumbai-university-..."
                    value={noteUrl}
                    onChange={(e) => setNoteUrl(e.target.value)}
                  />
                </div>

                {/* Message */}
                <div className={styles.formGroup}>
                  <label htmlFor="inquiry-message" className={styles.formLabel}>
                    Message Details
                  </label>
                  <textarea
                    id="inquiry-message"
                    className={styles.formTextarea}
                    placeholder="Explain your query, branch, semester, or issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Submit */}
                <button type="submit" className={styles.submitBtn}>
                  <LuSend size={16} />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
