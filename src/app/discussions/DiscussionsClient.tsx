"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Work_Sans, Caveat } from "next/font/google";
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
import { IS_DISCUSSIONS_COMING_SOON } from "@/config/featureFlags";
import BranchSelect from "@/components/ui/BranchSelect";

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
  const [refreshKey, setRefreshKey] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeUniversity = userUniversity || "All Universities";

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load paginated discussions (for load more)
  const loadMoreDiscussions = useCallback(async (pageNum: number) => {
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
        setDiscussions((prev) => [...prev, ...data.discussions]);
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
    if (authState === "loading") return;
    let isCancelled = false;

    async function fetchInitialDiscussions() {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          page: "1",
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

        if (!isCancelled && data.discussions) {
          setDiscussions(data.discussions);
          setTotalPages(data.totalPages || 1);
          setPage(1);
        }
      } catch (err) {
        console.error("Error fetching discussions feed:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialDiscussions();
    return () => {
      isCancelled = true;
    };
  }, [authState, activeUniversity, selectedBranch, selectedSemester, debouncedQuery, activeTab, refreshKey]);

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
    setRefreshKey((prev) => prev + 1);
  };

  const handleAskClick = () => {
    if (authState !== "ready") {
      toast.warning("Please sign in to ask a doubt or start a discussion. 🔒");
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  if (IS_DISCUSSIONS_COMING_SOON) {
    return (
      <div className={`${workSans.variable} ${caveat.variable} ${styles.notebookPageRoot}`}>
        <div className={styles.nbSpine} aria-hidden="true" />
        <div className={styles.nbMarginRule} aria-hidden="true" />
        <main className={styles.mainContainer}>
          <div className={styles.comingSoonWrapper}>
            <div className={styles.comingSoonCard}>
              <div className={styles.comingSoonBadge}>
                <FaComments style={{ color: "var(--nb-ink)" }} /> Community Discussions • Coming Soon 🚀
              </div>

              <h1 className={styles.comingSoonTitle}>
                Student Doubts & Peer Discussions
              </h1>

              <p className={styles.comingSoonSubtitle}>
                We are building an AI-moderated, ultra-fast peer discussion hub for engineering students to ask exam doubts, share pyq solutions, and collaborate with university peers.
              </p>

              <div className={styles.comingSoonGrid}>
                <div className={styles.comingSoonTeaserCard}>
                  <div className={styles.comingSoonTeaserIcon}>🎓</div>
                  <h3 className={styles.comingSoonTeaserTitle}>University Doubts</h3>
                  <p className={styles.comingSoonTeaserText}>Ask & solve questions specific to your university and branch.</p>
                </div>

                <div className={styles.comingSoonTeaserCard}>
                  <div className={styles.comingSoonTeaserIcon}>🛡️</div>
                  <h3 className={styles.comingSoonTeaserTitle}>AI Moderated</h3>
                  <p className={styles.comingSoonTeaserText}>Multilingual safety protection keeping discussions respectful & helpful.</p>
                </div>

                <div className={styles.comingSoonTeaserCard}>
                  <div className={styles.comingSoonTeaserIcon}>📄</div>
                  <h3 className={styles.comingSoonTeaserTitle}>Linked Notes</h3>
                  <p className={styles.comingSoonTeaserText}>Attach study notes and PYQ solution PDFs directly to questions.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/" className={styles.comingSoonBtn}>
                  Explore Notes & Question Papers 📚
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (authState === "loading") {
    return (
      <div className={`${workSans.variable} ${caveat.variable} ${styles.notebookPageRoot}`}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh", flexDirection: "column", gap: "1rem" }}>
          <div style={{ width: "36px", height: "36px", border: "3px solid #dbe6ef", borderTopColor: "#1d3557", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
          <p style={{ color: "var(--nb-ink-dim, #5c7089)", fontSize: "0.92rem", fontWeight: 500 }}>Loading Community Hub...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (authState === "no-username") return <UsernameGate email={userEmail} onComplete={async () => { await refreshAuth(); }} />;
  if (authState === "no-university") return <UniversityGate onSelect={async () => { await refreshAuth(); }} />;

  const isFiltered = selectedBranch !== "All branches" || selectedSemester !== "All semesters" || debouncedQuery !== "" || activeTab !== "all";

  return (
    <div className={`${workSans.variable} ${caveat.variable} ${styles.notebookPageRoot}`}>
      <div className={styles.nbSpine} aria-hidden="true" />
      <div className={styles.nbMarginRule} aria-hidden="true" />

      <main className={styles.mainContainer}>
        {/* Banner */}
        <section className={styles.banner}>
          <div className={styles.bannerTextGroup}>
            <div className={styles.bannerTab}>COMMUNITY DOUBTS & FORUM</div>
            <h1 className={styles.bannerTitle}>
              <FaComments /> {userUniversity || "Student"} Community Discussions
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

            <BranchSelect
              value={selectedBranch}
              onChange={setSelectedBranch}
              includeAllOption={true}
              className={styles.notebookBranchSelect}
              style={{ flex: "1 1 220px", minWidth: "180px" }}
            />

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
              <FaFire style={{ color: "#d97706", marginRight: "0.35rem" }} /> Trending
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "unanswered" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("unanswered")}
            >
              <FaCircleQuestion style={{ color: "#0284c7", marginRight: "0.35rem" }} /> Unanswered
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "solved" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("solved")}
            >
              <FaCircleCheck style={{ color: "#16a34a", marginRight: "0.35rem" }} /> Solved
            </button>
          </div>
        </div>

        {/* Feed List */}
        {isLoading && page === 1 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--nb-ink-dim, #5c7089)" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid #dbe6ef", borderTopColor: "#1d3557", borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 1rem" }} />
            <p style={{ fontWeight: 500 }}>Loading discussions feed...</p>
          </div>
        ) : discussions.length === 0 ? (
          <div className={styles.emptyStateCard}>
            <FaComments style={{ fontSize: "2.5rem", color: "var(--nb-ink-dim, #5c7089)", marginBottom: "1rem" }} />
            <h3 className={styles.emptyStateTitle}>
              {isFiltered ? "No discussions match your current filters" : "No discussions found"}
            </h3>
            <p className={styles.emptyStateText}>
              {isFiltered
                ? "Try resetting your branch/semester filter or search query to see all community discussions."
                : `Be the first student to ask a doubt or start a topic for ${userUniversity}!`}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className={styles.resetFiltersBtn}
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
              <DiscussionCard
                key={post.id}
                post={post}
                onDelete={(postId) =>
                  setDiscussions((prev) => prev.filter((p) => p.id !== postId))
                }
              />
            ))}

            {page < totalPages && (
              <button
                className={styles.loadMoreBtn}
                onClick={() => loadMoreDiscussions(page + 1)}
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
    </div>
  );
}
