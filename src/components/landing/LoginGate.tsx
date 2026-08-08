"use client";

import Link from "next/link";
import styles from "./LoginGate.module.css";

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
    <main style={{ 
      background: "var(--background)", 
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden" 
    }}>
      {/* Radiant Background Glow */}
      <div style={{
        position: "absolute",
        top: "-150px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "400px",
        background: "radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* High-Impact Single-Column Hero Section */}
      <section className={`${styles["gate-animate"]} ${styles.heroSection}`}>
        {/* Pulse Trust Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.6rem",
          background: "rgba(251, 191, 36, 0.08)",
          border: "1px solid rgba(251, 191, 36, 0.25)",
          borderRadius: "999px",
          padding: "0.45rem 1.25rem",
          fontSize: "0.825rem",
          fontWeight: 700,
          color: "#facc15",
          letterSpacing: "0.01em",
        }}>
          <span 
            className={styles["pulse-dot"]}
            style={{ 
              width: "7px", 
              height: "7px", 
              borderRadius: "50%", 
              background: "#22c55e", 
              boxShadow: "0 0 8px #22c55e"
            }} 
          />
          Trusted Engineering Study Platform
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          margin: 0,
          maxWidth: "800px"
        }}>
          Ace Your Semester Exams with{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent) 30%, #fb923c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Private Academy Notes
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          margin: 0,
          maxWidth: "640px"
        }}>
          Find branch-wise engineering notes, solved question papers, and video walkthroughs customized for your university.
        </p>

        {/* Integrated Hero Search Bar & University Selector */}
        {setSearchQuery && setSelectedUniv && (
          <div style={{
            width: "100%",
            maxWidth: "740px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            marginTop: "0.5rem"
          }}>
            <div className={styles.heroSearchBox}>
              {/* Search Input Box */}
              <div className={styles.heroInputGroup}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5">
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
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    width: "100%"
                  }}
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
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(251, 191, 36, 0.12)",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                  borderRadius: "999px",
                  padding: "0.35rem 1rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                id="live-search-feedback-badge"
              >
                <span>
                  Found <strong>{resultsCount}</strong> matching study {resultsCount === 1 ? "sheet" : "sheets"}
                  {selectedUniv && selectedUniv !== "All universities" ? ` in ${selectedUniv}` : ""}
                </span>
                <span style={{ textDecoration: "underline", marginLeft: "0.2rem" }}>Jump to Catalog ↓</span>
              </div>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "3rem",
          flexWrap: "wrap",
          paddingTop: "1rem"
        }}>
          {[
            { num: "100+", label: "Verified Guides" },
            { num: "4.9★", label: "Student Rating" },
          ].map((stat, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.02em" }}>
                {stat.num}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, marginTop: "0.15rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Area (Notes Catalog Explorer) */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 4.5rem" }}>
        <div style={{ height: "1px", background: "var(--border)", marginBottom: "2.5rem" }} />
        {children}
      </div>
    </main>
  );
}
