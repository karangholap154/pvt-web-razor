"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import pageStyles from "../page.module.css"; // Reuse modal and backdrop styling from home page
import { Note } from "../../data/mockData";

interface DashboardClientProps {
  username: string;
  notes: Note[];
}

export default function DashboardClient({ username, notes }: DashboardClientProps) {
  const router = useRouter();
  // Modal states
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalType, setModalType] = useState<"video" | "pdf" | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);


  const openModal = (note: Note, type: "video" | "pdf") => {
    setSelectedNote(note);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setModalType(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredNotes = notes.filter((note) => {
    if (!normalizedQuery) return true;
    return note.title.toLowerCase().includes(normalizedQuery);
  });

  // Handle PDF file download (fetches as blob to bypass cross-origin browser view modes)
  const handleDownload = async (noteId: string, title: string) => {
    if (!noteId) return;
    setDownloadingPdf(true);
    try {
      const response = await fetch(`/api/proxy-pdf?id=${noteId}`);
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download fetch failed, fallback opening in tab:", err);
      window.open(`/api/proxy-pdf?id=${noteId}`, "_blank");
    } finally {
      setDownloadingPdf(false);
      closeModal();
    }
  };


  return (
    <div className={styles.container}>
      {/* Header Area */}
      <div className={styles.headerArea}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Welcome back, <span className={styles.username}>{username}</span>
          </h1>
          <p className={styles.welcomeSubtitle}>
            Access all your premium unlocked notes and guides from one place.
          </p>
        </div>
        <div>
          <a href="/api/auth/logout" className={styles.btnLogout}>
            Sign Out
          </a>
        </div>
      </div>

      {/* Main Library */}
      <div className={styles.sectionHeaderRow}>
        <h2 className={styles.sectionHeading}>Your Unlocked Library</h2>
        <button
          type="button"
          className={styles.mobileSearchToggle}
          aria-label={isSearchExpanded ? "Collapse search" : "Expand search"}
          aria-expanded={isSearchExpanded}
          onClick={() => setIsSearchExpanded((prev) => !prev)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <div className={styles.searchDesktopWrap} role="search">
          <div className={styles.searchInputGroup}>
            <span className={styles.searchInputIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchExpanded(true)}
              placeholder="Search notes"
              className={styles.searchInput}
              aria-label="Search unlocked notes"
            />
          </div>
        </div>
      </div>
      <div className={`${styles.mobileSearchBar} ${isSearchExpanded ? styles.mobileSearchBarExpanded : ""}`} role="search">
        <div className={styles.searchInputGroup}>
          <span className={styles.searchInputIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchExpanded(true)}
            placeholder="Search notes"
            className={styles.searchInput}
            aria-label="Search unlocked notes"
          />
        </div>
      </div>

      {filteredNotes.length > 0 ? (
        <div className={styles.grid}>
          {filteredNotes.map((note) => (
            <article 
              className={styles.noteCard} 
              key={note.id} 
              id={`purchased-${note.id}`}
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/notes/${note.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, () => router.push(`/notes/${note.id}`))}
            >
              <div className={styles.noteCardHeader}>
                <h3 className={styles.noteCardTitle}>
                  <Link 
                    href={`/notes/${note.id}`} 
                    style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                  >
                    {note.title}
                  </Link>
                </h3>
              </div>
              <div className={styles.badgeRow}>
                <span className={styles.tagBranch}>{note.branch}</span>
                <span className={styles.badgeSemester}>{note.semester}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#22c55e", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                  Unlocked
                </span>
              </div>
              <p className={styles.noteCardDesc}>{note.description}</p>
              
              <div className={styles.noteCardActions}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(note, "video");
                  }}
                  className={`${styles.btnAction} ${styles.btnActionVideo}`}
                  id={`btn-dashboard-watch-${note.id}`}
                >
                  Watch Video
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(note, "pdf");
                  }}
                  className={`${styles.btnAction} ${styles.btnActionPdf}`}
                  id={`btn-dashboard-download-${note.id}`}
                >
                  Download PDF
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : notes.length > 0 ? (
        <div className={styles.emptyState} id="dashboard-empty-state-no-results">
          <h3 className={styles.emptyTitle}>No matching notes found</h3>
          <p className={styles.emptyText}>Try a different title, branch, or semester keyword.</p>
        </div>
      ) : (
        <div className={styles.emptyState} id="dashboard-empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
            <path d="M12 17v-4"></path>
            <path d="M12 9h.01"></path>
          </svg>
          <h3 className={styles.emptyTitle}>Your library is empty</h3>
          <p className={styles.emptyText}>
            You haven&apos;t purchased any premium notes yet. Head over to the home library to explore notes and guides.
          </p>
          <Link href="/" className={styles.btnExplore}>
            Browse Notes
          </Link>
        </div>
      )}

      {/* Video / PDF Modals (using homepage CSS classes for absolute styling compatibility) */}
      {modalType && selectedNote && (
        <div className={pageStyles.modalBackdrop} onClick={closeModal} id="dashboard-modal-backdrop">
          <div className={pageStyles.modalContent} onClick={(e) => e.stopPropagation()} id="dashboard-modal-content">
            
            {/* Modal Header */}
            <div className={pageStyles.modalHeader}>
              <h3 className={pageStyles.modalTitle}>
                {modalType === "video" && "Video Tutorial"}
                {modalType === "pdf" && "PDF Download Link"}
              </h3>
              <button onClick={closeModal} className={pageStyles.modalCloseBtn} id="btn-dashboard-close-modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className={pageStyles.modalBody}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span className={styles.tagBranch}>{selectedNote.branch}</span>
                <span className={styles.badgeSemester}>{selectedNote.semester}</span>
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{selectedNote.title}</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{selectedNote.description}</p>

              {modalType === "video" && (
                <div className={pageStyles.videoWrapper} id="dashboard-video-pane">
                  <iframe
                    src={selectedNote.videoUrl}
                    title={`${selectedNote.title} Video Tutorial`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {modalType === "pdf" && (
                <div style={{ textAlign: "center", padding: "2rem 1rem", backgroundColor: "var(--background)", borderRadius: "8px", border: "1px dashed var(--border)" }} id="dashboard-pdf-pane">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginBottom: "1rem" }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <polyline points="9 15 12 18 15 15"></polyline>
                  </svg>
                  <h5>{selectedNote.title}.pdf</h5>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>File Size: ~4.2 MB</p>
                  <button
                    onClick={() => handleDownload(selectedNote.id, selectedNote.title)}
                    className={pageStyles.btnPrimary}
                    style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}
                    disabled={downloadingPdf}
                    id="btn-dashboard-trigger-download"
                  >
                    {downloadingPdf ? "Downloading..." : "Confirm Download"}
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={pageStyles.modalFooter}>
              <button onClick={closeModal} className={pageStyles.btnSecondary} id="btn-dashboard-close-modal-footer">
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
