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
  FaGraduationCap,
  FaBookOpen,
  FaMoneyBillWave,
  FaUserGroup,
  FaMagnifyingGlass,
  FaXmark,
  FaCloudArrowUp,
  FaShieldHalved,
} from "react-icons/fa6";

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

  // Fetch community-only notes across any selected university (never locking to user profile)
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
    <main className={styles.container}>
      {/* ── Community Hero Section ──────────────────────────────────── */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <FaUserGroup /> Open Student Exchange
          </div>
          <h1 className={styles.heroTitle}>
            Community <span className={styles.heroTitleAccent}>Study Notes Hub</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Browse, download, and share university class notes, chapter summaries, handwritten PDFs, and exam formula sheets contributed by engineering students across universities.
          </p>

          <div className={styles.heroActions}>
            <Link href="/contribute" className={styles.btnContribute}>
              <FaCloudArrowUp /> Upload Your Notes & Earn UPI Payouts
            </Link>
            <Link href="/notes" className={styles.btnOfficialSwitch}>
              <FaShieldHalved style={{ color: "#fbbf24" }} /> Need Complete Syllabus? View Official Notes →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Value Props & Trust Highlights ─────────────────────────── */}
      <section className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FaGraduationCap />
          </div>
          <div>
            <div className={styles.statTitle}>All Universities Open</div>
            <div className={styles.statDesc}>No university lock. Freely explore notes from any college or university.</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FaBookOpen />
          </div>
          <div>
            <div className={styles.statTitle}>Chapter & Unit Specific</div>
            <div className={styles.statDesc}>Find unit-wise class summaries, quick revision formulas & PYQs.</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FaMoneyBillWave />
          </div>
          <div>
            <div className={styles.statTitle}>70% - 90% Author Share</div>
            <div className={styles.statDesc}>Student contributors earn direct UPI payouts for every download.</div>
          </div>
        </div>
      </section>

      {/* ── Advisory Disclaimer Banner ──────────────────────────────── */}
      <div className={styles.advisoryBanner}>
        <div className={styles.advisoryIcon}>ℹ️</div>
        <div className={styles.advisoryText}>
          <strong>Community Notes Advisory:</strong> Study notes in this section are contributed directly by student peers and fellow engineers. Most uploads cover specific modules or chapters (e.g. Unit 1–2), class notes, or quick formula sheets and may not be a complete subject syllabus. Review the preview before unlocking.
        </div>
      </div>

      {/* ── Open Multi-University Filter Bar ────────────────────────── */}
      <section className={styles.filterBar}>
        <div className={styles.filterRow}>
          {/* University Selector (Open to ALL universities) */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="community-univ-filter">
              University
            </label>
            <select
              id="community-univ-filter"
              value={selectedUniv}
              onChange={(e) => setSelectedUniv(e.target.value)}
              className={`${styles.filterSelect} ${styles.filterSelectSpecial}`}
            >
              <option value="All universities">🎓 All Universities (Open Access)</option>
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
              Search Topics & Chapters
            </label>
            <div className={styles.searchInputWrapper}>
              <FaMagnifyingGlass className={styles.searchInputIcon} />
              <input
                id="community-search-input"
                type="text"
                placeholder="Search notes, chapters, topics..."
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
                  <FaXmark />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Results Header & Active Filter Pills ────────────────────── */}
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
                  <FaXmark />
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
                  <FaXmark />
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
                  <FaXmark />
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
                  <FaXmark />
                </button>
              </span>
            )}

            <button type="button" onClick={handleClearFilters} className={styles.btnClearAll}>
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* ── Community Notes Grid / Skeletons / Empty State ─────────── */}
      {isLoading ? (
        <div className={styles.notesGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonShimmer} style={{ height: "22px", width: "70%" }} />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div className={styles.skeletonShimmer} style={{ height: "22px", width: "80px" }} />
                <div className={styles.skeletonShimmer} style={{ height: "22px", width: "50px" }} />
              </div>
              <div className={styles.skeletonShimmer} style={{ height: "14px", width: "100%", marginTop: "0.5rem" }} />
              <div className={styles.skeletonShimmer} style={{ height: "14px", width: "80%" }} />
              <div style={{ marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                <div className={styles.skeletonShimmer} style={{ height: "36px", borderRadius: "8px" }} />
              </div>
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h3 className={styles.emptyTitle}>No community notes found</h3>
          <p className={styles.emptyText}>
            {hasActiveFilters
              ? "No student-contributed study notes matched your current filter criteria. Try broadening your filters or search term."
              : "No student notes have been published yet for this selection."}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className={styles.btnOfficialSwitch}
              >
                Reset Filters
              </button>
            )}
            <Link href="/contribute" className={styles.btnContribute}>
              <FaCloudArrowUp /> Be The First To Upload Notes
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
  );
}
