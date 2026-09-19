"use client";

import { Work_Sans, Caveat } from "next/font/google";
import styles from "./LoginGate.module.css";

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

interface LoginGateProps {
  children?: React.ReactNode;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  selectedUniv?: string;
  setSelectedUniv?: (u: string) => void;
  availableUniversities?: string[];
  resultsCount?: number;
}

export default function LoginGate({
  children,
  searchQuery,
  setSearchQuery,
  selectedUniv,
  setSelectedUniv,
  availableUniversities,
  resultsCount = 0,
}: LoginGateProps) {
  const scrollToCatalog = () => {
    const el = document.getElementById("featured-notes-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isFilterActive = (searchQuery && searchQuery.trim() !== "") || (selectedUniv && selectedUniv !== "All universities");

  return (
    <main className={`${styles.notebookPageRoot} ${workSans.variable} ${caveat.variable}`}>
      {/* Notebook spine hole punches & margin rule */}
      <div className={styles.nbSpine} aria-hidden="true" />
      <div className={styles.nbMarginRule} aria-hidden="true" />

      <div className={styles.mainContainer}>
        {/* High-Impact Hero Section */}
        <section className={`${styles["gate-animate"]} ${styles.heroSection}`}>
          {/* Notebook Hand Sticker Badge */}
          <div className={styles.heroBadge}>
            <span className={styles.pulseDot} />
            Verified Study Platform
          </div>

          {/* Hero Title */}
          <h1 className={styles.heroTitle}>
            Ace Your Semester Exams with <span className={styles.heroTitleAccent}>Private Academy Notes</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Find branch-wise engineering study notes, university question guides, and video walkthroughs customized for your syllabus.
          </p>

          {/* Integrated Notebook Hero Search Bar & University Selector */}
          {setSearchQuery && setSelectedUniv && (
            <div className={styles.searchContainer}>
              <div className={styles.heroSearchBox}>
                {/* Search Input Box */}
                <div className={styles.heroInputGroup}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--nb-ink-dim)" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search subject, note title, or topic..."
                    value={searchQuery || ""}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        scrollToCatalog();
                      }
                    }}
                    className={styles.heroSearchInput}
                    id="hero-search-input"
                  />
                </div>

                {/* University Selector Dropdown */}
                <select
                  value={selectedUniv || "All universities"}
                  onChange={(e) => {
                    setSelectedUniv(e.target.value);
                    setTimeout(() => scrollToCatalog(), 150);
                  }}
                  className={styles.heroSelectInput}
                  id="hero-university-select"
                >
                  <option value="All universities">🎓 All Universities</option>
                  {(availableUniversities || []).map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>

                {/* Search Submit Button */}
                <button
                  onClick={scrollToCatalog}
                  className={styles.heroSearchBtn}
                  aria-label="Search study notes catalog"
                  id="btn-hero-search-submit"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>

              {/* Live Filter Feedback Pill */}
              {isFilterActive && (
                <div 
                  onClick={scrollToCatalog}
                  className={styles.liveFeedbackBadge}
                  id="live-search-feedback-badge"
                >
                  <span>
                    Found <strong>{resultsCount}</strong> matching study {resultsCount === 1 ? "sheet" : "sheets"}
                    {selectedUniv && selectedUniv !== "All universities" ? ` in ${selectedUniv}` : ""}
                  </span>
                  <span className={styles.liveFeedbackAction}>View notes ➔</span>
                </div>
              )}
            </div>
          )}

          {/* Stats Badges */}
          <div className={styles.statsRow}>
            {[
              { num: "100+", label: "Verified guides" },
              { num: "4.9★", label: "Student rating" },
              { num: "Syllabus", label: "Aligned content" },
            ].map((stat, idx) => (
              <div key={idx} className={styles.statCard}>
                <div className={styles.statNum}>{stat.num}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content Area (Notes Catalog Explorer) */}
        <div className={styles.catalogWrapper}>
          <div className={styles.catalogDivider} />
          {children}
        </div>
      </div>
    </main>
  );
}
