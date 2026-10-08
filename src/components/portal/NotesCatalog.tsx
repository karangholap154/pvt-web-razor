"use client";

import { useMemo, useCallback } from "react";
import Link from "next/link";
import { Note } from "@/data/mockData";
import NoteCard from "@/components/cards/NoteCard";
import styles from "../../app/page.module.css";
import { FaFolderOpen, FaRegFolderOpen, FaGraduationCap, FaChevronRight, FaArrowLeft } from "react-icons/fa6";

export interface NotesCatalogProps {
  notes: Note[];
  metaNotes: { id: string; title: string; branch: string; semester: string; university?: string }[];
  isLoading: boolean;
  catalogMode?: "official" | "community" | "all";
  userUniversity?: string | null;
  selectedUniv: string;
  onSelectUniv: (univ: string) => void;
  availableUniversities: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  debouncedSearchQuery: string;
  searchOpen: boolean;
  onToggleSearchOpen: () => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  selectedSemester: string;
  onSelectSemester: (semester: string) => void;
  onClearFilters: () => void;
  onOpenVideoModal: (note: Note) => void;
  onNoteAction: (note: Note) => void;
  variant: "catalog" | "unauth";
  actionLabel?: (note: Note) => string;
  searchIdPrefix?: string;
}

export default function NotesCatalog({
  notes,
  metaNotes,
  isLoading,
  catalogMode = "all",
  userUniversity,
  selectedUniv,
  onSelectUniv,
  availableUniversities,
  searchQuery,
  onSearchChange,
  debouncedSearchQuery,
  searchOpen,
  onToggleSearchOpen,
  selectedBranch,
  onSelectBranch,
  selectedSemester,
  onSelectSemester,
  onClearFilters,
  onOpenVideoModal,
  onNoteAction,
  variant,
  actionLabel,
  searchIdPrefix = "",
}: NotesCatalogProps) {
  // Folder grouping computed states
  const activeBranches = useMemo(() => {
    const branches = new Set<string>();
    metaNotes.forEach((note) => {
      if (note.branch) branches.add(note.branch);
    });
    return Array.from(branches).sort();
  }, [metaNotes]);

  const branchSemestersMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    metaNotes.forEach((note) => {
      if (!note.branch || !note.semester) return;
      if (!map[note.branch]) {
        map[note.branch] = [];
      }
      if (!map[note.branch].includes(note.semester)) {
        map[note.branch].push(note.semester);
      }
    });
    Object.keys(map).forEach((br) => {
      map[br].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    });
    return map;
  }, [metaNotes]);

  const branchNotesCount = useMemo(() => {
    const count: Record<string, number> = {};
    metaNotes.forEach((note) => {
      if (!note.branch) return;
      count[note.branch] = (count[note.branch] || 0) + 1;
    });
    return count;
  }, [metaNotes]);

  const semesterNotesCount = useMemo(() => {
    const count: Record<string, number> = {};
    metaNotes.forEach((note) => {
      if (!note.branch || !note.semester) return;
      const key = `${note.branch}-${note.semester}`;
      count[key] = (count[key] || 0) + 1;
    });
    return count;
  }, [metaNotes]);

  const folderPreviewsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    metaNotes.forEach((note) => {
      if (!note.branch || !note.semester) return;
      const key = `${note.branch}-${note.semester}`;
      if (!map[key]) {
        map[key] = [];
      }
      if (map[key].length < 3) {
        map[key].push(note.title);
      }
    });
    return map;
  }, [metaNotes]);

  const getBranchFolderClass = useCallback((branch: string) => {
    switch (branch) {
      case "Computer Engineering":
      case "Computer Science & Engineering (CSE)":
        return styles.folderComputer;
      case "Information Technology":
      case "Information Technology (IT)":
      case "Software Engineering":
        return styles.folderIT;
      case "AIML":
      case "Artificial Intelligence & Machine Learning (AIML)":
      case "Artificial Intelligence & Data Science (AIDS)":
      case "Data Science & Analytics":
      case "Cyber Security & Forensic Science":
        return styles.folderAIML;
      case "Mechanical":
      case "Mechanical Engineering":
      case "Mechatronics Engineering":
      case "Robotics & Automation":
      case "Automobile Engineering":
      case "Aerospace & Aeronautical Engineering":
      case "Production & Industrial Engineering":
        return styles.folderMechanical;
      case "Chemical":
      case "Chemical Engineering":
      case "Biomedical Engineering":
      case "Biotechnology & Bioengineering":
      case "Environmental Engineering":
        return styles.folderChemical;
      default:
        return styles.folderDefault;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const idSuffix = searchIdPrefix ? `-${searchIdPrefix}` : "";

  return (
    <section className={styles.notesSection} id={`featured-notes-section${idSuffix}`}>
      <div className={styles.catalogHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
          {catalogMode === "community" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>👥</span> Student & Community Notes
              </h2>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Peer-contributed study materials, chapter summaries & revision sheets
              </span>
            </div>
          ) : catalogMode === "official" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>🏛️</span> Official Study Notes
              </h2>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Verified, authentic & syllabus-complete guides curated by Private Academy
              </span>
            </div>
          ) : (
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Study notes catalog
            </h2>
          )}

          {(!userUniversity || variant === "unauth") && (
            <select
              value={selectedUniv}
              onChange={(e) => onSelectUniv(e.target.value)}
              style={{
                padding: "0.5rem 2.6rem 0.5rem 0.85rem",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
              id={`select-university-filter${idSuffix}`}
            >
              <option value="All universities">🎓 All Universities</option>
              {availableUniversities.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          )}
        </div>

        {/* Desktop: inline search */}
        <div className={styles.catalogSearchDesktop}>
          <div className={styles.inputGroup} style={{ minWidth: "260px" }}>
            <svg className={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
              id={`search-notes-input${idSuffix}`}
              style={{ fontSize: "0.875rem", padding: "0.65rem 1rem 0.65rem 2.5rem" }}
            />
          </div>
          {searchQuery && (
            <button onClick={onClearFilters} className={styles.btnClearMinimal} aria-label="Clear search">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        {/* Mobile: icon toggle */}
        <div className={styles.catalogSearchMobile}>
          <button
            className={styles.searchIconBtn}
            onClick={onToggleSearchOpen}
            aria-label={searchOpen ? "Close search" : "Open search"}
            id={`btn-toggle-search${idSuffix}`}
          >
            {searchOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile expanded search input */}
      {searchOpen && (
        <div className={styles.mobileSearchExpanded} id={`mobile-search-expanded${idSuffix}`}>
          <div className={styles.inputGroup}>
            <svg className={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
              id={`search-notes-input-mobile${idSuffix}`}
              autoFocus
            />
          </div>
        </div>
      )}

      {catalogMode === "community" && (
        <div style={{
          margin: "1rem 0 1.25rem",
          padding: "0.9rem 1.25rem",
          borderRadius: "10px",
          background: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.85rem",
        }}>
          <span style={{ fontSize: "1.35rem", lineHeight: 1 }}>ℹ️</span>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--text-primary)" }}>Community Contributed Notes: </strong>
            These study materials are submitted by student peers and contributors across universities. Most uploads cover specific chapters (e.g. Unit 1–2), class notes, or quick revision formulas and may not represent the full syllabus. Please inspect the preview before downloading or unlocking.
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "1.2rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/notes" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
                Looking for verified, complete subject guides? Browse Official Notes →
              </Link>
              <Link href="/contribute" style={{ color: "#38bdf8", fontWeight: 700, textDecoration: "none" }}>
                Upload your notes & earn UPI payouts →
              </Link>
            </div>
          </div>
        </div>
      )}

      {catalogMode === "official" && (
        <div style={{
          margin: "1rem 0 1.25rem",
          padding: "0.75rem 1.15rem",
          borderRadius: "10px",
          background: "rgba(59, 130, 246, 0.07)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          fontSize: "0.85rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
            <span>🛡️</span>
            <span><strong style={{ color: "var(--text-primary)" }}>100% Syllabus Coverage:</strong> Curated and verified official engineering study notes.</span>
          </div>
          <Link href="/community-notes" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            Looking for student chapter notes? Browse Community Notes →
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className={styles.grid} style={{ marginTop: "1rem" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                minHeight: "220px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <div className={styles.skeletonShimmer} style={{ height: "20px", width: "70%" }} />
                <div className={styles.skeletonShimmer} style={{ height: "20px", width: "45px" }} />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div className={styles.skeletonShimmer} style={{ height: "22px", width: "70px" }} />
                <div className={styles.skeletonShimmer} style={{ height: "22px", width: "50px" }} />
              </div>
              <div className={styles.skeletonShimmer} style={{ height: "14px", width: "100%", marginTop: "0.25rem" }} />
              <div className={styles.skeletonShimmer} style={{ height: "14px", width: "75%" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                <div className={styles.skeletonShimmer} style={{ height: "34px", borderRadius: "8px" }} />
                <div className={styles.skeletonShimmer} style={{ height: "34px", borderRadius: "8px" }} />
              </div>
            </div>
          ))}
        </div>
      ) : debouncedSearchQuery !== "" || (selectedBranch === "All branches" && selectedSemester !== "All semesters") ? (
        /* Flat list mode for Search or Semester-only filtering */
        <div>
          <div className={styles.breadcrumbsContainer}>
            <div className={styles.breadcrumbs}>
              <span
                className={styles.breadcrumbLink}
                onClick={() => {
                  onSelectBranch("All branches");
                  onSelectSemester("All semesters");
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, () => {
                  onSelectBranch("All branches");
                  onSelectSemester("All semesters");
                })}
              >
                <FaGraduationCap style={{ fontSize: "1.1rem" }} /> Library
              </span>

              {selectedBranch !== "All branches" && (
                <>
                  <span className={styles.breadcrumbSeparator}><FaChevronRight style={{ fontSize: "0.7rem" }} /></span>
                  <span
                    className={selectedSemester === "All semesters" ? styles.breadcrumbActive : styles.breadcrumbLink}
                    onClick={() => {
                      if (selectedSemester !== "All semesters") {
                        onSelectSemester("All semesters");
                      }
                    }}
                  >
                    {selectedBranch}
                  </span>
                </>
              )}

              {selectedSemester !== "All semesters" && (
                <>
                  <span className={styles.breadcrumbSeparator}><FaChevronRight style={{ fontSize: "0.7rem" }} /></span>
                  <span className={styles.breadcrumbActive}>
                    {selectedSemester}
                  </span>
                </>
              )}
            </div>

            {(selectedBranch !== "All branches" || selectedSemester !== "All semesters") && (
              <button
                className={styles.btnBreadcrumbBack}
                onClick={() => {
                  if (selectedSemester !== "All semesters") {
                    onSelectSemester("All semesters");
                  } else {
                    onSelectBranch("All branches");
                  }
                }}
              >
                <FaArrowLeft /> Back
              </button>
            )}
          </div>

          {debouncedSearchQuery !== "" && variant === "catalog" && (
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
              Search Results for &quot;{debouncedSearchQuery}&quot;
              {selectedBranch !== "All branches" && ` in ${selectedBranch}`}
              {selectedSemester !== "All semesters" && ` (Semester ${selectedSemester})`}
            </h3>
          )}
          {selectedBranch === "All branches" && selectedSemester !== "All semesters" && debouncedSearchQuery === "" && variant === "catalog" && (
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
              Showing all {selectedSemester} notes
            </h3>
          )}

          {notes.length > 0 ? (
            <div className={styles.grid}>
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  id={variant === "unauth" ? `unauth-note-${note.id}` : note.id}
                  note={note}
                  variant={variant}
                  onWatchVideo={note.videoUrl ? (n) => onOpenVideoModal(n) : undefined}
                  onAction={(n) => onNoteAction(n)}
                  actionLabel={actionLabel ? actionLabel(note) : variant === "unauth" ? "Preview & details" : note.price && note.price > 0 ? "Unlock PDF" : "Free PDF"}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noResults} id="no-results-alert">
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem"
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 className={styles.noResultsTitle}>
                {userUniversity && variant === "catalog" ? `No study notes found for ${userUniversity}` : "No results for this filter"}
              </h3>
              <p className={styles.noResultsDesc}>
                {userUniversity && variant === "catalog"
                  ? "Our contributors have not uploaded notes for this specific branch filter yet. Try adjusting or clearing search parameters."
                  : "No study notes match your current search and filters. Reset filters to browse all resources."}
              </p>
              <button
                type="button"
                onClick={onClearFilters}
                className={styles.btnPrimary}
                style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem", marginTop: "0.25rem" }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Folder navigation mode */
        <div>
          <div className={styles.breadcrumbsContainer}>
            <div className={styles.breadcrumbs}>
              <span
                className={styles.breadcrumbLink}
                onClick={() => {
                  onSelectBranch("All branches");
                  onSelectSemester("All semesters");
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, () => {
                  onSelectBranch("All branches");
                  onSelectSemester("All semesters");
                })}
              >
                <FaGraduationCap style={{ fontSize: "1.1rem" }} /> Library
              </span>

              {selectedBranch !== "All branches" && (
                <>
                  <span className={styles.breadcrumbSeparator}><FaChevronRight style={{ fontSize: "0.7rem" }} /></span>
                  <span
                    className={selectedSemester === "All semesters" ? styles.breadcrumbActive : styles.breadcrumbLink}
                    onClick={() => {
                      if (selectedSemester !== "All semesters") {
                        onSelectSemester("All semesters");
                      }
                    }}
                  >
                    {selectedBranch}
                  </span>
                </>
              )}

              {selectedSemester !== "All semesters" && (
                <>
                  <span className={styles.breadcrumbSeparator}><FaChevronRight style={{ fontSize: "0.7rem" }} /></span>
                  <span className={styles.breadcrumbActive}>
                    {selectedSemester}
                  </span>
                </>
              )}
            </div>

            {(selectedBranch !== "All branches" || selectedSemester !== "All semesters") && (
              <button
                className={styles.btnBreadcrumbBack}
                onClick={() => {
                  if (selectedSemester !== "All semesters") {
                    onSelectSemester("All semesters");
                  } else {
                    onSelectBranch("All branches");
                  }
                }}
              >
                <FaArrowLeft /> Back
              </button>
            )}
          </div>

          {notes.length === 0 ? (
            <div className={styles.noResults} id="no-results-alert">
              <h3>{userUniversity && variant === "catalog" ? `No study notes found for ${userUniversity}` : "No study notes found"}</h3>
              <p>
                {userUniversity && variant === "catalog"
                  ? "Our contributors have not uploaded notes for this specific branch filter yet. Try adjusting or clearing search parameters."
                  : "Try selecting another university filter or adjusting your search."}
              </p>
            </div>
          ) : selectedBranch === "All branches" ? (
            /* Level 1: Branch Folders */
            activeBranches.length > 0 ? (
              <div className={styles.folderGrid}>
                {activeBranches.map((branch) => {
                  const semesters = branchSemestersMap[branch] || [];
                  const count = branchNotesCount[branch] || 0;
                  return (
                    <div
                      key={branch}
                      className={`${styles.folderCard} ${getBranchFolderClass(branch)}`}
                      onClick={() => onSelectBranch(branch)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, () => onSelectBranch(branch))}
                    >
                      <div className={styles.folderIconContainer}>
                        <FaRegFolderOpen className={styles.folderClosedIcon} />
                        <FaFolderOpen className={styles.folderOpenedIcon} />
                      </div>
                      <div className={styles.folderHeaderInfo}>
                        <h3 className={styles.folderTitle}>{branch}</h3>
                        <span className={styles.folderStats}>{count} study {count === 1 ? "sheet" : "sheets"} available</span>
                      </div>
                      <div className={styles.folderBadges}>
                        {semesters.map((sem) => (
                          <span key={sem} className={styles.folderMiniBadge}>{sem}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>No active folders found.</p>
              </div>
            )
          ) : selectedSemester === "All semesters" ? (
            /* Level 2: Semester Folders */
            (branchSemestersMap[selectedBranch] || []).length > 0 ? (
              <div className={styles.folderGrid}>
                {(branchSemestersMap[selectedBranch] || []).map((sem) => {
                  const key = `${selectedBranch}-${sem}`;
                  const count = semesterNotesCount[key] || 0;
                  const previews = folderPreviewsMap[key] || [];
                  return (
                    <div
                      key={sem}
                      className={`${styles.folderCard} ${getBranchFolderClass(selectedBranch)}`}
                      onClick={() => onSelectSemester(sem)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, () => onSelectSemester(sem))}
                    >
                      <div className={styles.folderIconContainer}>
                        <FaRegFolderOpen className={styles.folderClosedIcon} />
                        <FaFolderOpen className={styles.folderOpenedIcon} />
                      </div>
                      <div className={styles.folderHeaderInfo}>
                        <h3 className={styles.folderTitle}>{sem} Folder</h3>
                        <span className={styles.folderStats}>{count} study {count === 1 ? "sheet" : "sheets"} inside</span>
                      </div>
                      {previews.length > 0 && (
                        <ul className={styles.folderPreviewList}>
                          {previews.map((title, idx) => (
                            <li key={idx}>{title}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>No semesters active under {selectedBranch} Engineering.</p>
              </div>
            )
          ) : (
            /* Level 3: Notes Grid for selected branch & semester */
            (() => {
              const officialNotes = notes.filter((n) => n.resource_type === "official_subject" || (!n.resource_type && !n.is_community_contributed));
              const supplementaryNotes = notes.filter((n) => (n.resource_type && n.resource_type !== "official_subject") || n.is_community_contributed);

              if (notes.length === 0) {
                return (
                  <div className={styles.noResults}>
                    <h3>No study sheets found</h3>
                    <p>No notes currently uploaded for {selectedBranch} {selectedSemester}.</p>
                  </div>
                );
              }

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {officialNotes.length > 0 && (
                    <div>
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "1.1rem" }}>📚</span>
                          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                            Official Subject Curriculum ({officialNotes.length})
                          </h3>
                        </div>
                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          Verified, full-syllabus engineering study notes aligned with university curriculum.
                        </p>
                      </div>
                      <div className={styles.grid}>
                        {officialNotes.map((note) => (
                          <NoteCard
                            key={note.id}
                            id={variant === "unauth" ? `unauth-grid-note-${note.id}` : note.id}
                            note={note}
                            variant={variant}
                            onWatchVideo={note.videoUrl ? (n) => onOpenVideoModal(n) : undefined}
                            onAction={(n) => onNoteAction(n)}
                            actionLabel={actionLabel ? actionLabel(note) : variant === "unauth" ? "Preview & details" : note.price && note.price > 0 ? "Unlock PDF" : "Free PDF"}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {supplementaryNotes.length > 0 && (
                    <div style={{
                      padding: "1.25rem",
                      borderRadius: "14px",
                      background: "rgba(245, 158, 11, 0.03)",
                      border: "1px solid rgba(245, 158, 11, 0.15)",
                    }}>
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "1.1rem" }}>💡</span>
                          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "#fbbf24" }}>
                            Supplementary & Student Learning Resources ({supplementaryNotes.length})
                          </h3>
                        </div>
                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          Focused topic guides, module notes, and practical reference handbooks contributed by students. Explicitly supplementary — not official syllabus notes.
                        </p>
                      </div>
                      <div className={styles.grid}>
                        {supplementaryNotes.map((note) => (
                          <NoteCard
                            key={note.id}
                            id={variant === "unauth" ? `unauth-grid-note-${note.id}` : note.id}
                            note={note}
                            variant={variant}
                            onWatchVideo={note.videoUrl ? (n) => onOpenVideoModal(n) : undefined}
                            onAction={(n) => onNoteAction(n)}
                            actionLabel={actionLabel ? actionLabel(note) : variant === "unauth" ? "Preview & details" : note.price && note.price > 0 ? "Unlock PDF" : "Free PDF"}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>
      )}
    </section>
  );
}
