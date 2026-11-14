"use client";

import { useMemo, useCallback } from "react";
import Link from "next/link";
import { Note } from "@/data/mockData";
import NoteCard from "@/components/cards/NoteCard";
import styles from "./NotesCatalog.module.css";
import {
  LuFolder,
  LuFolderOpen,
  LuGraduationCap,
  LuArrowLeft,
  LuSearch,
  LuX,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";

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

  const getDisciplineClass = useCallback((branch: string) => {
    const b = branch.toUpperCase();
    if (b.includes("COMPUTER") || b.includes("CSE")) return styles.disciplineComputer;
    if (b.includes("INFORMATION") || b.includes("IT")) return styles.disciplineIT;
    if (b.includes("AIML") || b.includes("AIDS") || b.includes("DATA SCIENCE")) return styles.disciplineAIML;
    if (b.includes("MECHANICAL") || b.includes("AUTOMOBILE") || b.includes("ROBOTICS")) return styles.disciplineMechanical;
    if (b.includes("CHEMICAL") || b.includes("CIVIL") || b.includes("ENVIRONMENTAL")) return styles.disciplineChemical;
    if (b.includes("ELECTRICAL") || b.includes("EXTC") || b.includes("ELECTRONICS")) return styles.disciplineElectrical;
    return styles.disciplineDefault;
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const idSuffix = searchIdPrefix ? `-${searchIdPrefix}` : "";

  return (
    <section className={styles.catalogSection} id={`featured-notes-section${idSuffix}`}>
      {/* 1. Header & Controls */}
      <div className={styles.catalogHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.eyebrow}>
            {catalogMode === "community"
              ? "PEER-REVIEWED ARCHIVE · CHAPTER GUIDES"
              : catalogMode === "official"
              ? "OFFICIAL SYLLABUS · VERIFIED CURRICULUM"
              : "ACADEMIC ARCHIVE · NOTEBOOK DOSSIERS"}
          </span>
          <h2 className={styles.catalogTitle}>
            {catalogMode === "community" ? (
              <>Community <span className="hl">Student Notes</span></>
            ) : catalogMode === "official" ? (
              <>Official <span className="hl">Study Notes</span></>
            ) : (
              <>Engineering <span className="hl">Study Notes</span></>
            )}
          </h2>
          <p className={styles.catalogSubtitle}>
            {catalogMode === "community"
              ? "Student-submitted chapter summaries, revision formulas, and subject guides."
              : catalogMode === "official"
              ? "Verified, syllabus-aligned engineering guides curated by Private Academy."
              : "Search or browse notes by university, branch, and semester."}
          </p>
        </div>

        {/* Right Header Controls */}
        <div className={styles.headerControls}>
          {(!userUniversity || variant === "unauth") && (
            <select
              value={selectedUniv}
              onChange={(e) => onSelectUniv(e.target.value)}
              className={styles.selectUniv}
              id={`select-university-filter${idSuffix}`}
              aria-label="Filter by university"
            >
              <option value="All universities">All Universities</option>
              {availableUniversities.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          )}

          {/* Desktop Search */}
          <div className={styles.searchDesktop}>
            <div className={styles.inputGroup}>
              <LuSearch className={styles.inputIcon} size={16} />
              <input
                type="text"
                placeholder="Search notes or subjects..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={styles.searchInput}
                id={`search-notes-input${idSuffix}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className={styles.btnClearMinimal}
                  aria-label="Clear search"
                >
                  <LuX size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <div className={styles.searchMobile}>
            <button
              type="button"
              className={styles.searchIconBtn}
              onClick={onToggleSearchOpen}
              aria-label={searchOpen ? "Close search" : "Open search"}
              id={`btn-toggle-search${idSuffix}`}
            >
              {searchOpen ? <LuX size={18} /> : <LuSearch size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Expanded Search */}
      {searchOpen && (
        <div className={styles.mobileSearchExpanded} id={`mobile-search-expanded${idSuffix}`}>
          <div className={styles.inputGroup}>
            <LuSearch className={styles.inputIcon} size={16} />
            <input
              type="text"
              placeholder="Search notes or subjects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
              id={`search-notes-input-mobile${idSuffix}`}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={onClearFilters}
                className={styles.btnClearMinimal}
                aria-label="Clear search"
              >
                <LuX size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Editorial Banners */}
      {catalogMode === "community" && (
        <div className={styles.bannerCommunity}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LuSparkles size={16} style={{ color: "var(--ink-900)" }} />
            <strong style={{ color: "var(--ink-900)" }}>Community Notes Archive</strong>
          </div>
          <p style={{ margin: 0, color: "var(--slate-600)", lineHeight: 1.55 }}>
            Contributed by engineering peers and scholars. Submissions typically cover specific units, formulas, or revision summaries. Inspect the preview before unlocking.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "4px" }}>
            <Link href="/" className={styles.bannerLink}>
              Looking for verified full-subject syllabus? Browse Official Notes →
            </Link>
            <Link href="/contribute" className={styles.bannerLink} style={{ color: "var(--ink-900)" }}>
              Upload your notes & earn UPI payouts →
            </Link>
          </div>
        </div>
      )}

      {catalogMode === "official" && (
        <div className={styles.bannerOfficial}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LuShieldCheck size={18} style={{ color: "var(--blue-500)" }} />
            <span>
              <strong style={{ color: "var(--ink-900)" }}>100% Syllabus Coverage:</strong> Curated and verified official study notes aligned with university curriculum.
            </span>
          </div>
          <Link href="/community-notes" className={styles.bannerLink}>
            Browse Student Chapter Notes →
          </Link>
        </div>
      )}

      {/* 3. Loading Skeletons */}
      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonPreview}>
                <div
                  className={styles.skeletonShimmer}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    height: "18px",
                    width: "75px",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div className={styles.skeletonShimmer} style={{ height: "20px", width: "70px", borderRadius: "4px" }} />
                <div className={styles.skeletonShimmer} style={{ height: "20px", width: "50px", borderRadius: "4px" }} />
                <div className={styles.skeletonShimmer} style={{ height: "20px", width: "60px", borderRadius: "4px" }} />
              </div>

              <div className={styles.skeletonShimmer} style={{ height: "22px", width: "90%" }} />
              <div className={styles.skeletonShimmer} style={{ height: "16px", width: "65%" }} />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  marginTop: "auto",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--line-200, #E3E8F1)",
                }}
              >
                <div className={styles.skeletonShimmer} style={{ height: "24px", width: "65px", borderRadius: "4px" }} />
                <div className={styles.skeletonShimmer} style={{ height: "36px", width: "110px", borderRadius: "8px" }} />
              </div>
            </div>
          ))}
        </div>
      ) : debouncedSearchQuery !== "" || (selectedBranch === "All branches" && selectedSemester !== "All semesters") ? (
        /* Flat List Mode for Search or Semester-Only Filter */
        <div>
          {/* Spec Breadcrumb Bar */}
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
                onKeyDown={(e) =>
                  handleKeyDown(e, () => {
                    onSelectBranch("All branches");
                    onSelectSemester("All semesters");
                  })
                }
              >
                <LuGraduationCap size={15} /> LIBRARY
              </span>

              {selectedBranch !== "All branches" && (
                <>
                  <span className={styles.breadcrumbSeparator}>/</span>
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
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span className={styles.breadcrumbActive}>
                    SEM {selectedSemester}
                  </span>
                </>
              )}
            </div>

            {(selectedBranch !== "All branches" || selectedSemester !== "All semesters") && (
              <button
                type="button"
                className={styles.btnBreadcrumbBack}
                onClick={() => {
                  if (selectedSemester !== "All semesters") {
                    onSelectSemester("All semesters");
                  } else {
                    onSelectBranch("All branches");
                  }
                }}
              >
                <LuArrowLeft size={13} /> Back
              </button>
            )}
          </div>

          {debouncedSearchQuery !== "" && variant === "catalog" && (
            <div style={{ margin: "16px 0 20px" }}>
              <span className="label-mono" style={{ color: "var(--slate-600)" }}>
                SEARCH RESULTS ({notes.length})
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: 800, marginTop: "2px", color: "var(--ink-900)" }}>
                &quot;{debouncedSearchQuery}&quot;
                {selectedBranch !== "All branches" && ` in ${selectedBranch}`}
                {selectedSemester !== "All semesters" && ` (Sem ${selectedSemester})`}
              </h3>
            </div>
          )}

          {notes.length > 0 ? (
            <div className={styles.grid} style={{ marginTop: "16px" }}>
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  id={variant === "unauth" ? `unauth-note-${note.id}` : note.id}
                  note={note}
                  variant={variant}
                  onWatchVideo={note.videoUrl ? (n) => onOpenVideoModal(n) : undefined}
                  onAction={(n) => onNoteAction(n)}
                  actionLabel={
                    actionLabel
                      ? actionLabel(note)
                      : variant === "unauth"
                      ? "Preview & details"
                      : note.price && note.price > 0
                      ? "Unlock PDF"
                      : "Free PDF"
                  }
                />
              ))}
            </div>
          ) : (
            <div className={styles.noResults} id="no-results-alert">
              <div className={styles.noResultsIconWrapper}>
                <LuSearch size={22} />
              </div>
              <h3 className={styles.noResultsTitle}>
                {userUniversity && variant === "catalog"
                  ? `No study sheets found for ${userUniversity}`
                  : "No study sheets match this filter"}
              </h3>
              <p className={styles.noResultsDesc}>
                {userUniversity && variant === "catalog"
                  ? "Our contributors have not uploaded notes for this specific branch filter yet. Try adjusting or clearing search parameters."
                  : "Try clearing your search query or selecting a different branch."}
              </p>
              <button
                type="button"
                onClick={onClearFilters}
                className="label-mono"
                style={{
                  marginTop: "8px",
                  padding: "10px 18px",
                  backgroundColor: "var(--ink-900)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Folder Navigation Mode */
        <div>
          {/* Spec Breadcrumb Bar */}
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
                onKeyDown={(e) =>
                  handleKeyDown(e, () => {
                    onSelectBranch("All branches");
                    onSelectSemester("All semesters");
                  })
                }
              >
                <LuGraduationCap size={15} /> LIBRARY
              </span>

              {selectedBranch !== "All branches" && (
                <>
                  <span className={styles.breadcrumbSeparator}>/</span>
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
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span className={styles.breadcrumbActive}>
                    SEM {selectedSemester}
                  </span>
                </>
              )}
            </div>

            {(selectedBranch !== "All branches" || selectedSemester !== "All semesters") && (
              <button
                type="button"
                className={styles.btnBreadcrumbBack}
                onClick={() => {
                  if (selectedSemester !== "All semesters") {
                    onSelectSemester("All semesters");
                  } else {
                    onSelectBranch("All branches");
                  }
                }}
              >
                <LuArrowLeft size={13} /> Back
              </button>
            )}
          </div>

          {notes.length === 0 ? (
            <div className={styles.noResults} id="no-results-alert" style={{ marginTop: "24px" }}>
              <div className={styles.noResultsIconWrapper}>
                <LuFolder size={22} />
              </div>
              <h3 className={styles.noResultsTitle}>
                {userUniversity && variant === "catalog"
                  ? `No study sheets found for ${userUniversity}`
                  : "No study notes found"}
              </h3>
              <p className={styles.noResultsDesc}>
                {userUniversity && variant === "catalog"
                  ? "Our contributors have not uploaded notes for this specific branch filter yet. Try adjusting or clearing search parameters."
                  : "Try selecting another university filter or resetting the branch filter."}
              </p>
              <button
                type="button"
                onClick={onClearFilters}
                className="label-mono"
                style={{
                  marginTop: "8px",
                  padding: "10px 18px",
                  backgroundColor: "var(--ink-900)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : selectedBranch === "All branches" ? (
            /* Level 1: Branch Folders */
            activeBranches.length > 0 ? (
              <div className={styles.folderGrid} style={{ marginTop: "20px" }}>
                {activeBranches.map((branch) => {
                  const semesters = branchSemestersMap[branch] || [];
                  const count = branchNotesCount[branch] || 0;
                  return (
                    <div
                      key={branch}
                      className={styles.folderCard}
                      onClick={() => onSelectBranch(branch)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, () => onSelectBranch(branch))}
                    >
                      {/* Top discipline tab line */}
                      <div className={`${styles.folderTopBar} ${getDisciplineClass(branch)}`} />

                      <div className={styles.folderHeader}>
                        <div className={styles.folderIconWrapper}>
                          <LuFolder size={20} />
                        </div>
                        <span className={styles.folderStats}>
                          {count} {count === 1 ? "SHEET" : "SHEETS"}
                        </span>
                      </div>

                      <h3 className={styles.folderTitle}>{branch}</h3>

                      <div className={styles.folderBadges}>
                        {semesters.map((sem) => (
                          <span key={sem} className={styles.folderMiniBadge}>
                            Sem {sem}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noResults} style={{ marginTop: "24px" }}>
                <p>No active folders found.</p>
              </div>
            )
          ) : selectedSemester === "All semesters" ? (
            /* Level 2: Semester Folders */
            (branchSemestersMap[selectedBranch] || []).length > 0 ? (
              <div className={styles.folderGrid} style={{ marginTop: "20px" }}>
                {(branchSemestersMap[selectedBranch] || []).map((sem) => {
                  const key = `${selectedBranch}-${sem}`;
                  const count = semesterNotesCount[key] || 0;
                  const previews = folderPreviewsMap[key] || [];
                  return (
                    <div
                      key={sem}
                      className={styles.folderCard}
                      onClick={() => onSelectSemester(sem)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, () => onSelectSemester(sem))}
                    >
                      {/* Top discipline tab line */}
                      <div className={`${styles.folderTopBar} ${getDisciplineClass(selectedBranch)}`} />

                      <div className={styles.folderHeader}>
                        <div className={styles.folderIconWrapper}>
                          <LuFolderOpen size={20} />
                        </div>
                        <span className={styles.folderStats}>
                          {count} {count === 1 ? "SHEET" : "SHEETS"}
                        </span>
                      </div>

                      <h3 className={styles.folderTitle}>Semester {sem} Folder</h3>

                      {previews.length > 0 && (
                        <ul className={styles.folderPreviewList}>
                          {previews.map((title, idx) => (
                            <li key={idx} className={styles.folderPreviewItem}>
                              <span className={styles.folderPreviewDot} />
                              <span>{title}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noResults} style={{ marginTop: "24px" }}>
                <p>No semesters active under {selectedBranch}.</p>
              </div>
            )
          ) : (
            /* Level 3: Notes Grid for Selected Branch & Semester */
            (() => {
              const officialNotes = notes.filter(
                (n) => n.resource_type === "official_subject" || (!n.resource_type && !n.is_community_contributed)
              );
              const supplementaryNotes = notes.filter(
                (n) => (n.resource_type && n.resource_type !== "official_subject") || n.is_community_contributed
              );

              if (notes.length === 0) {
                return (
                  <div className={styles.noResults} style={{ marginTop: "24px" }}>
                    <div className={styles.noResultsIconWrapper}>
                      <LuFolder size={22} />
                    </div>
                    <h3 className={styles.noResultsTitle}>No study sheets found</h3>
                    <p className={styles.noResultsDesc}>
                      No notes currently uploaded for {selectedBranch} Semester {selectedSemester}.
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "36px", marginTop: "24px" }}>
                  {officialNotes.length > 0 && (
                    <div className={styles.curriculumSection}>
                      <div className={styles.curriculumHeader}>
                        <span className="label-mono" style={{ color: "var(--blue-500)" }}>
                          OFFICIAL CURRICULUM ({officialNotes.length})
                        </span>
                        <h3 className={styles.curriculumTitle}>
                          Verified Subject Study Guides
                        </h3>
                        <p className={styles.curriculumDesc}>
                          Full syllabus engineering notes aligned with your university curriculum.
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
                            actionLabel={
                              actionLabel
                                ? actionLabel(note)
                                : variant === "unauth"
                                ? "Preview & details"
                                : note.price && note.price > 0
                                ? "Unlock PDF"
                                : "Free PDF"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {supplementaryNotes.length > 0 && (
                    <div className={styles.curriculumSection}>
                      <div className={styles.curriculumHeader}>
                        <span className="label-mono" style={{ color: "var(--ink-900)" }}>
                          SUPPLEMENTARY LEARNING RESOURCES ({supplementaryNotes.length})
                        </span>
                        <h3 className={styles.curriculumTitle}>
                          Student Module Summaries & Topic Notes
                        </h3>
                        <p className={styles.curriculumDesc}>
                          Chapter summaries, formula sheets, and practical revision notes contributed by student peers.
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
                            actionLabel={
                              actionLabel
                                ? actionLabel(note)
                                : variant === "unauth"
                                ? "Preview & details"
                                : note.price && note.price > 0
                                ? "Unlock PDF"
                                : "Free PDF"
                            }
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
