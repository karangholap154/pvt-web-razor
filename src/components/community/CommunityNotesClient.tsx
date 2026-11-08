"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Note, BRANCHES, SEMESTERS } from "@/data/mockData";
import { UNIVERSITIES } from "@/utils/constants";
import { mapDbRowToNote, RawNoteRow } from "@/utils/noteMapper";
import NoteCard from "@/components/cards/NoteCard";
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

interface NoteMeta {
  id: string;
  title: string;
  branch: string;
  semester: string;
  university?: string;
}

interface CommunityNotesClientProps {
  initialNotes?: Note[];
  initialMeta?: NoteMeta[];
}

export default function CommunityNotesClient({
  initialNotes = [],
  initialMeta = [],
}: CommunityNotesClientProps) {
  const searchParams = useSearchParams();

  // Filter States (University defaults to "All universities" so any student can browse all notes freely)
  const [selectedUniv, setSelectedUniv] = useState<string>("All universities");
  const [selectedBranch, setSelectedBranch] = useState<string>("All branches");
  const [selectedSemester, setSelectedSemester] = useState<string>("All semesters");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  // Live Data States
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [metaNotes, setMetaNotes] = useState<NoteMeta[]>(initialMeta);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync URL search params if present
  useEffect(() => {
    const u = searchParams.get("university");
    const b = searchParams.get("branch");
    const s = searchParams.get("semester");
    const q = searchParams.get("q");

    if (u) setSelectedUniv(u);
    if (b) setSelectedBranch(b);
    if (s) setSelectedSemester(s);
    if (q) {
      setSearchQuery(q);
      setDebouncedSearchQuery(q);
    }
  }, [searchParams]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Dynamic available universities from meta + constant fallbacks
  const availableUniversities = useMemo(() => {
    const univSet = new Set<string>();
    metaNotes.forEach((m) => {
      if (m.university) univSet.add(m.university);
    });
    UNIVERSITIES.forEach((u) => univSet.add(u.value));
    return Array.from(univSet).sort();
  }, [metaNotes]);

  // Fetch community-only notes across any selected university
  useEffect(() => {
    // Initial SSR cache passthrough
    if (
      selectedUniv === "All universities" &&
      selectedBranch === "All branches" &&
      selectedSemester === "All semesters" &&
      !debouncedSearchQuery &&
      initialNotes.length > 0
    ) {
      setNotes(initialNotes);
      setMetaNotes(initialMeta);
      return;
    }

    let isSubscribed = true;

    async function fetchCommunityNotes() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("source", "community");

        if (selectedUniv && selectedUniv !== "All universities") {
          queryParams.set("university", selectedUniv);
        }
        if (selectedBranch && selectedBranch !== "All branches") {
          queryParams.set("branch", selectedBranch);
        }
        if (selectedSemester && selectedSemester !== "All semesters") {
          queryParams.set("semester", selectedSemester);
        }
        if (debouncedSearchQuery && debouncedSearchQuery.trim() !== "") {
          queryParams.set("q", debouncedSearchQuery.trim());
        }

        const res = await fetch(`/api/notes?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to load community notes");

        const data = await res.json();
        if (isSubscribed) {
          const rawNotes = data.notes || [];
          const formatted: Note[] = rawNotes.map((item: RawNoteRow) =>
            mapDbRowToNote(item)
          );

          setNotes(formatted);
          if (data.meta) {
            setMetaNotes(data.meta);
          }
        }
      } catch (err) {
        console.error("Error fetching community notes:", err);
        if (isSubscribed) setNotes([]);
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    }

    fetchCommunityNotes();

    return () => {
      isSubscribed = false;
    };
  }, [selectedUniv, selectedBranch, selectedSemester, debouncedSearchQuery, initialNotes, initialMeta]);

  const handleClearFilters = () => {
    setSelectedUniv("All universities");
    setSelectedBranch("All branches");
    setSelectedSemester("All semesters");
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  const hasActiveFilters =
    selectedUniv !== "All universities" ||
    selectedBranch !== "All branches" ||
    selectedSemester !== "All semesters" ||
    debouncedSearchQuery !== "";

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
            FILTER BAR (OPEN MULTI-UNIVERSITY SELECTOR)
            ================================================================ */}
        <section className={styles.filterSection} aria-label="Filter community notes">
          <div className={styles.filterGrid}>
            {/* University Selector */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="community-univ-filter">
                University
              </label>
              <select
                id="community-univ-filter"
                value={selectedUniv}
                onChange={(e) => setSelectedUniv(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All universities">All Universities (Open Access)</option>
                {availableUniversities.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Selector */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="community-branch-filter">
                Branch / Discipline
              </label>
              <select
                id="community-branch-filter"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All branches">All Branches</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
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
                <LuSearch className={styles.searchIcon} size={16} />
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
