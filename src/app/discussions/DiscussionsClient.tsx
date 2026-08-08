"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";
import UsernameGate from "@/components/landing/UsernameGate";
import UniversityGate from "@/components/landing/UniversityGate";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import AskQuestionModal from "@/components/discussions/AskQuestionModal";
import styles from "./discussions.module.css";
import { FaPlus, FaMagnifyingGlass, FaComments, FaFire, FaCircleQuestion, FaCircleCheck } from "react-icons/fa6";
import type { DiscussionPost } from "@/types/discussions";

export default function DiscussionsClient() {
  const router = useRouter();
  const toast = useToast();
  const { authState, email: userEmail, university: userUniversity, defaultBranch, defaultSemester, refreshAuth } = useAuth();

  const [discussions, setDiscussions] = useState<DiscussionPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All branches");
  const [selectedSemester, setSelectedSemester] = useState("All semesters");
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "unanswered" | "solved">("all");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeUniversity = userUniversity || "All Universities";

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load paginated discussions
  const loadDiscussions = useCallback(async (pageNum = 1, append = false) => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "10",
      });

      if (activeUniversity && activeUniversity !== "All Universities") {
        params.set("university", activeUniversity);
      }
      if (selectedBranch !== "All branches") params.set("branch", selectedBranch);
      if (selectedSemester !== "All semesters") params.set("semester", selectedSemester);
      if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());

      if (activeTab === "trending") params.set("status", "trending");
      else if (activeTab === "unanswered") params.set("status", "unanswered");
      else if (activeTab === "solved") params.set("status", "solved");

      const res = await fetch(`/api/discussions?${params.toString()}`);
      const data = await res.json();

      if (data.discussions) {
        if (append) {
          setDiscussions((prev) => [...prev, ...data.discussions]);
        } else {
          setDiscussions(data.discussions);
        }
        setTotalPages(data.totalPages || 1);
        setPage(pageNum);
      }
    } catch (err) {
      console.error("Error fetching discussions feed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeUniversity, selectedBranch, selectedSemester, debouncedQuery, activeTab]);

  useEffect(() => {
    if (authState !== "loading") {
      loadDiscussions(1, false);
    }
  }, [authState, activeUniversity, selectedBranch, selectedSemester, debouncedQuery, activeTab, loadDiscussions]);

  // Clear all active filters
  const handleClearFilters = () => {
    setSelectedBranch("All branches");
    setSelectedSemester("All semesters");
    setSearchQuery("");
    setDebouncedQuery("");
    setActiveTab("all");
  };

  const handlePostSuccess = (newBranch?: string, newSemester?: string) => {
    if (newBranch) setSelectedBranch(newBranch);
    if (newSemester) setSelectedSemester(newSemester);
    loadDiscussions(1, false);
  };

  const handleAskClick = () => {
    if (authState !== "ready") {
      toast.warning("Please sign in to ask a doubt or start a discussion. 🔒");
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  if (authState === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column", gap: "1rem" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#a855f7", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Loading Community Hub...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (authState === "no-username") return <UsernameGate email={userEmail} onComplete={async () => { await refreshAuth(); }} />;
  if (authState === "no-university") return <UniversityGate onSelect={async () => { await refreshAuth(); }} />;

  const isFiltered = selectedBranch !== "All branches" || selectedSemester !== "All semesters" || debouncedQuery !== "" || activeTab !== "all";

  return (
    <main className={styles.mainContainer}>
      {/* Banner */}
      <section className={styles.banner}>
        <div>
          <h1 className={styles.bannerTitle}>
            <FaComments style={{ color: "#c084fc" }} /> {userUniversity} Community Discussions
          </h1>
          <p className={styles.bannerSubtitle}>
            Ask doubts, share exam strategies, discuss past papers, and help your peers excel.
          </p>
        </div>

        <button className={styles.btnPrimary} onClick={handleAskClick}>
          <FaPlus /> Ask a Doubt
        </button>
      </section>

      {/* Controls & Filters */}
      <div className={styles.controlsRow}>
        <div className={styles.searchBarWrapper}>
          <div className={styles.searchInputGroup}>
            <FaMagnifyingGlass className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search discussions or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="All branches">All Branches</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="AIML">AIML</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Chemical">Chemical</option>
          </select>

          <select
            className={styles.filterSelect}
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="All semesters">All Semesters</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
            <option value="Semester 3">Semester 3</option>
            <option value="Semester 4">Semester 4</option>
            <option value="Semester 5">Semester 5</option>
            <option value="Semester 6">Semester 6</option>
            <option value="Semester 7">Semester 7</option>
            <option value="Semester 8">Semester 8</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className={styles.tabsRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === "all" ? styles.activeTabBtn : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Discussions
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "trending" ? styles.activeTabBtn : ""}`}
            onClick={() => setActiveTab("trending")}
          >
            <FaFire style={{ color: "#f59e0b", marginRight: "0.3rem" }} /> Trending
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "unanswered" ? styles.activeTabBtn : ""}`}
            onClick={() => setActiveTab("unanswered")}
          >
            <FaCircleQuestion style={{ color: "#60a5fa", marginRight: "0.3rem" }} /> Unanswered
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "solved" ? styles.activeTabBtn : ""}`}
            onClick={() => setActiveTab("solved")}
          >
            <FaCircleCheck style={{ color: "#4ade80", marginRight: "0.3rem" }} /> Solved
          </button>
        </div>
      </div>

      {/* Feed List */}
      {isLoading && page === 1 ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#94a3b8" }}>
          <div style={{ width: "32px", height: "32px", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#a855f7", borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 1rem" }} />
          <p>Loading discussions feed...</p>
        </div>
      ) : discussions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(15, 23, 42, 0.4)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <FaComments style={{ fontSize: "2.5rem", color: "#64748b", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 0.5rem" }}>
            {isFiltered ? "No discussions match your current filters" : "No discussions found"}
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>
            {isFiltered
              ? "Try resetting your branch/semester filter or search query to see all community discussions."
              : `Be the first student to ask a doubt or start a topic for ${userUniversity}!`}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {isFiltered && (
              <button
                type="button"
                onClick={handleClearFilters}
                style={{
                  padding: "0.65rem 1.25rem",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "10px",
                  color: "#f8fafc",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Show All Discussions
              </button>
            )}
            <button className={styles.btnPrimary} onClick={handleAskClick}>
              <FaPlus /> Ask a Doubt Now
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.feedList}>
          {discussions.map((post) => (
            <DiscussionCard key={post.id} post={post} />
          ))}

          {page < totalPages && (
            <button
              className={styles.loadMoreBtn}
              onClick={() => loadDiscussions(page + 1, true)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More Discussions"}
            </button>
          )}
        </div>
      )}

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePostSuccess}
        userUniversity={userUniversity || ""}
        defaultBranch={defaultBranch || undefined}
        defaultSemester={defaultSemester || undefined}
      />
    </main>
  );
}
