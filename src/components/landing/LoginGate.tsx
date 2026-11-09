"use client";

import styles from "./LoginGate.module.css";
import {
  LuSearch,
  LuArrowRight,
  LuShieldCheck,
  LuBookOpen,
} from "react-icons/lu";

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
    <main className={styles.pageWrapper}>
      {/* Subtle Graph-Paper Grid Background */}
      <div className={styles.gridOverlay} />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        {/* Eyebrow Trust Badge */}
        <div className={styles.eyebrowTag}>
          <span className={styles.pulseDot} />
          <LuShieldCheck size={14} />
          <span>FREE &amp; PAID NOTES • ₹0–₹99</span>
        </div>

        {/* Hero Title */}
        <h1 className={styles.heroTitle}>
          Ace Your <mark className={styles.highlighter}>Semester Exams</mark> with Private Academy Notes
        </h1>

        <p className={styles.heroSubtitle}>
          Find branch-wise engineering notes, solved question papers, and video walkthroughs customized for your university syllabus.
        </p>

        {/* Integrated Hero Finder Desk (DESIGN.md §4.1) */}
        {setSearchQuery && setSelectedUniv && (
          <div className={styles.finderWrapper}>
            <div className={styles.heroSearchBox}>
              {/* Search Input Box */}
              <div className={styles.heroInputGroup}>
                <LuSearch className={styles.searchIcon} size={18} />
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
                  className={styles.searchInput}
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

              {/* Search Submit Icon Button */}
              <button
                type="button"
                onClick={scrollToCatalog}
                className={styles.heroSearchBtn}
                aria-label="Search study notes catalog"
                id="btn-hero-search-submit"
              >
                <LuArrowRight size={20} />
              </button>
            </div>

            {/* Live Filter Feedback Pill */}
            {isFilterActive && (
              <div 
                onClick={scrollToCatalog}
                className={styles.liveFilterPill}
                id="live-search-feedback-badge"
                role="button"
                tabIndex={0}
              >
                <LuBookOpen size={14} />
                <span>
                  Found <strong>{resultsCount}</strong> matching study {resultsCount === 1 ? "sheet" : "sheets"}
                  {selectedUniv && selectedUniv !== "All universities" ? ` in ${selectedUniv}` : ""}
                </span>
                <span className={styles.viewNotesLink}>View notes ↗</span>
              </div>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className={styles.statsRow}>
          {[
            { num: "100+", label: "Verified guides" },
            { num: "4.9★", label: "Student rating" },
          ].map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <div className={styles.statNumber}>
                {stat.num}
              </div>
              <div className={styles.statLabel}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Area (Notes Catalog Explorer) */}
      <div className={styles.contentArea}>
        <div className={styles.contentDivider} />
        {children}
      </div>
    </main>
  );
}
