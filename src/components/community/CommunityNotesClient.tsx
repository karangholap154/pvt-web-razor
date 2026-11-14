"use client";

import Link from "next/link";
import { Note, SEMESTERS } from "@/data/mockData";
import { UNIVERSITIES } from "@/utils/constants";
import NoteCard from "@/components/cards/NoteCard";
import BranchSelect from "@/components/ui/BranchSelect";
import { useNotesFilter, NoteMeta } from "@/hooks/useNotesFilter";
import styles from "./CommunityNotes.module.css";
import {
  LuUsers,
  LuGraduationCap,
  LuBookOpen,
  LuBanknote,
  LuCloudUpload,
  LuSearch,
  LuX,
  LuArrowRight,
  LuInfo,
} from "react-icons/lu";

interface CommunityNotesClientProps {
  initialNotes?: Note[];
  initialMeta?: NoteMeta[];
}

export default function CommunityNotesClient({
  initialNotes = [],
  initialMeta = [],
}: CommunityNotesClientProps) {
  const {
    notes,
    isLoading,
    selectedUniv,
    setSelectedUniv,
    selectedBranch,
    setSelectedBranch,
    selectedSemester,
    setSelectedSemester,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    clearFilters: handleClearFilters,
    hasActiveFilters,
  } = useNotesFilter({
    initialNotes,
    initialMeta,
    catalogMode: "community",
  });

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        {/* ================================================================
            HEADER & HERO SECTION
            ================================================================ */}
        <section className={styles.headerSection}>
          <div className={styles.tagBadge}>
            <LuUsers size={13} />
            <span>Student Study Directory</span>
          </div>
          <h1 className={styles.headerTitle}>
            Peer-Contributed Study <span className={styles.titleHighlight}>Notes &amp; Guides</span>
          </h1>
          <p className={styles.headerSubtitle}>
            Browse, download, and share unit-wise revision sheets, viva questions, and handwritten notes contributed by engineering scholars across universities.
          </p>
        </section>

        {/* ================================================================
            PERSISTENT CONTRIBUTOR CALLOUT BANNER (DESIGN.md 4.4)
            ================================================================ */}
        <section className={styles.contributorBanner}>
          <div className={styles.contributorBannerContent}>
            <div className={styles.contributorBannerIcon}>
              <LuBanknote size={22} />
            </div>
            <div>
              <h2 className={styles.contributorBannerHeading}>
                Have good notes from this semester? Earn up to 90% per unlock
              </h2>
              <p className={styles.contributorBannerSub}>
                Publish your study materials, set your price, and receive direct UPI payouts on every student download.
              </p>
            </div>
          </div>
          <div className={styles.contributorBannerActions}>
            <Link href="/contribute" className={styles.btnContributePrimary}>
              <LuCloudUpload size={16} />
              <span>Contribute Notes</span>
            </Link>
            <Link href="/notes" className={styles.btnOfficialLink}>
              <span>Official Syllabus Notes</span>
              <LuArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ================================================================
            4-PILLAR TRUST & SCOPE STRIP
            ================================================================ */}
        <section className={styles.trustRow} aria-label="Community directory features">
          <div className={styles.trustCard}>
            <div className={styles.trustIconWrap}>
              <LuGraduationCap size={16} />
            </div>
            <div>
              <h3 className={styles.trustTitle}>All Universities Open</h3>
              <p className={styles.trustDesc}>Freely explore notes from MU, SPPU, DBATU &amp; any engineering college.</p>
            </div>
          </div>

          <div className={styles.trustCard}>
            <div className={styles.trustIconWrap}>
              <LuBookOpen size={16} />
            </div>
            <div>
              <h3 className={styles.trustTitle}>Module &amp; Viva Specific</h3>
              <p className={styles.trustDesc}>Unit-wise summaries, handwritten formulas, and lab practical sheets.</p>
            </div>
          </div>

          <div className={styles.trustCard}>
            <div className={styles.trustIconWrap}>
              <LuBanknote size={16} />
            </div>
            <div>
              <h3 className={styles.trustTitle}>70% – 90% Author Share</h3>
              <p className={styles.trustDesc}>Student authors receive automated direct UPI disbursements.</p>
            </div>
          </div>
        </section>

        {/* ================================================================
            ADVISORY DISCLAIMER BANNER
            ================================================================ */}
        <div className={styles.advisoryBanner} role="note">
          <LuInfo className={styles.advisoryIcon} size={16} />
          <div className={styles.advisoryText}>
            <strong>Community Notes Advisory:</strong> Study notes in this section are contributed directly by student peers and fellow engineers. Most uploads cover specific modules or chapters (e.g. Unit 1–2), class notes, or quick formula sheets and may not be a complete subject syllabus. Review the PDF preview before unlocking.
          </div>
        </div>

        {/* ================================================================
            FILTER BAR (ENGINEERING DESK: CHIPS + BRANCHSELECT + SEMESTER)
            ================================================================ */}
        <section className={styles.filterSection} aria-label="Filter community notes">
          {/* University Chips Row */}
          <div className={styles.uniChipsBar}>
            <span className={styles.uniChipsLabel}>UNIVERSITY:</span>
            <div className={styles.uniChipsRow} role="radiogroup" aria-label="Filter notes by university">
              <button
                type="button"
                role="radio"
                aria-checked={selectedUniv === "All universities"}
                onClick={() => setSelectedUniv("All universities")}
                className={`${styles.uniChip} ${selectedUniv === "All universities" ? styles.uniChipActive : ""}`}
              >
                All Universities
              </button>
              {UNIVERSITIES.map((uni) => {
                const isSelected = selectedUniv === uni.value || selectedUniv === uni.abbr;
                return (
                  <button
                    key={uni.abbr}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedUniv(uni.value)}
                    className={`${styles.uniChip} ${isSelected ? styles.uniChipActive : ""}`}
                    title={uni.value}
                  >
                    {uni.abbr}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.filterGrid}>
            {/* Branch Selector using unified BranchSelect */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="community-branch-filter">
                Branch / Discipline
              </label>
              <BranchSelect
                id="community-branch-filter"
                variant="light"
                includeAllOption
                allOptionLabel="All branches"
                value={selectedBranch}
                onChange={setSelectedBranch}
              />
            </div>

            {/* Semester Selector */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="community-semester-filter">
                Semester
              </label>
              <select
                id="community-semester-filter"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All semesters">All Semesters</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="community-search-input">
                Search Topics &amp; Chapters
              </label>
              <div className={styles.searchWrapper}>
                <LuSearch className={styles.searchIcon} size={16} aria-hidden="true" />
                <input
                  id="community-search-input"
                  type="text"
                  placeholder="Filter by title, topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className={styles.btnClearSearch}
                    aria-label="Clear search"
                  >
                    <LuX size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            RESULTS HEADER & ACTIVE FILTERS
            ================================================================ */}
        <div className={styles.resultsHeader}>
          <div className={styles.resultsCount}>
            <span>Community Notes</span>
            <span className={styles.resultsCountBadge}>
              {notes.length} {notes.length === 1 ? "note" : "notes"} available
            </span>
          </div>

          {hasActiveFilters && (
            <div className={styles.activeFiltersList}>
              {selectedUniv !== "All universities" && (
                <span className={styles.filterTag}>
                  🎓 {selectedUniv}
                  <button
                    type="button"
                    onClick={() => setSelectedUniv("All universities")}
                    className={styles.filterTagRemove}
                    aria-label="Remove university filter"
                  >
                    <LuX size={12} />
                  </button>
                </span>
              )}

              {selectedBranch !== "All branches" && (
                <span className={styles.filterTag}>
                  📘 {selectedBranch}
                  <button
                    type="button"
                    onClick={() => setSelectedBranch("All branches")}
                    className={styles.filterTagRemove}
                    aria-label="Remove branch filter"
                  >
                    <LuX size={12} />
                  </button>
                </span>
              )}

              {selectedSemester !== "All semesters" && (
                <span className={styles.filterTag}>
                  Sem {selectedSemester}
                  <button
                    type="button"
                    onClick={() => setSelectedSemester("All semesters")}
                    className={styles.filterTagRemove}
                    aria-label="Remove semester filter"
                  >
                    <LuX size={12} />
                  </button>
                </span>
              )}

              {debouncedSearchQuery && (
                <span className={styles.filterTag}>
                  &ldquo;{debouncedSearchQuery}&rdquo;
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className={styles.filterTagRemove}
                    aria-label="Remove search filter"
                  >
                    <LuX size={12} />
                  </button>
                </span>
              )}

              <button type="button" onClick={handleClearFilters} className={styles.btnClearAll}>
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ================================================================
            COMMUNITY NOTES GRID / SKELETONS / EMPTY STATE
            ================================================================ */}
        {isLoading ? (
          <div className={styles.notesGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonShimmer} style={{ height: "24px", width: "70%" }} />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div className={styles.skeletonShimmer} style={{ height: "20px", width: "80px" }} />
                  <div className={styles.skeletonShimmer} style={{ height: "20px", width: "50px" }} />
                </div>
                <div className={styles.skeletonShimmer} style={{ height: "14px", width: "100%", marginTop: "0.5rem" }} />
                <div className={styles.skeletonShimmer} style={{ height: "14px", width: "80%" }} />
                <div style={{ marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--line-200, #E3E8F1)" }}>
                  <div className={styles.skeletonShimmer} style={{ height: "38px", borderRadius: "10px" }} />
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrap}>
              <LuBookOpen size={24} />
            </div>
            <h2 className={styles.emptyTitle}>No community notes found</h2>
            <p className={styles.emptyText}>
              {hasActiveFilters
                ? "No student-contributed study notes matched your current filter combination. Try resetting your filters or search keyword."
                : "No student notes have been published yet for this selection."}
            </p>
            <div className={styles.emptyActions}>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className={styles.btnOfficialLink}
                >
                  Reset Filters
                </button>
              )}
              <Link href="/contribute" className={styles.btnContributePrimary}>
                <LuCloudUpload size={16} />
                <span>Upload First Note</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.notesGrid}>
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                variant="catalog"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
