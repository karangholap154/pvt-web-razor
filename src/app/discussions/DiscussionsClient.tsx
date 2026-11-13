"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";
import UsernameGate from "@/components/landing/UsernameGate";
import UniversityGate from "@/components/landing/UniversityGate";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import AskQuestionModalDynamic from "@/components/discussions/AskQuestionModalDynamic";
import styles from "./discussions.module.css";
import {
  LuPlus,
  LuSearch,
  LuX,
  LuFlame,
  LuCircleHelp,
  LuCircleCheck,
  LuMessageSquare,
} from "react-icons/lu";
import type { DiscussionPost } from "@/types/discussions";
import { IS_DISCUSSIONS_COMING_SOON } from "@/config/featureFlags";
import BranchSelect from "@/components/ui/BranchSelect";

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
      <div className={styles.pageWrapper}>
        <main className={styles.mainContainer}>
          <div className={styles.guestPromptCard}>
            <LuMessageSquare size={36} style={{ color: "var(--blue-500, #2447F5)" }} />
            <h1 className={styles.bannerTitle}>Student Doubts &amp; Peer Discussions</h1>
            <p className={styles.bannerSubtitle}>
              We are building an AI-moderated, ultra-fast peer discussion hub for engineering students to ask exam doubts, share pyq solutions, and collaborate with university peers.
            </p>
            <Link href="/" className={styles.btnPrimary} style={{ marginTop: 12 }}>
              Explore Notes &amp; Question Papers 📚
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (authState === "loading") {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
          <div style={{ width: "32px", height: "32px", border: "3px solid var(--line-300, #CDD4E2)", borderTopColor: "var(--blue-500, #2447F5)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "var(--slate-600, #4A5468)", fontSize: "0.9rem", fontFamily: "var(--font-inter), sans-serif" }}>
            Loading Discussions Hub...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (authState === "no-username") return <UsernameGate email={userEmail} onComplete={async () => { await refreshAuth(); }} />;
  if (authState === "no-university") return <UniversityGate onSelect={async () => { await refreshAuth(); }} />;

  const isFiltered = selectedBranch !== "All branches" || selectedSemester !== "All semesters" || debouncedQuery !== "" || activeTab !== "all";

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContainer}>
        {/* Eyebrow Header */}
        <div className={styles.deskEyebrow}>
          <span className={styles.deskEyebrowTag}>[ENGINEERING COMMONS • COMMUNITY FORUM]</span>
          <span className={styles.deskEyebrowStatus}>
            <span className={styles.statusDot} />
            LIVE DOUBT CLEARING
          </span>
        </div>

        {/* ================================================================
            FORUM HEADER BANNER
            ================================================================ */}
        <section className={styles.banner}>
          <div className={styles.bannerCover}>
            <div className={styles.tagBadge}>
              <LuMessageSquare size={12} />
              <span>Engineering Q&amp;A</span>
            </div>
            <h1 className={styles.bannerTitle}>
              {userUniversity ? (
                <>
                  <span className={styles.titleHighlight}>{userUniversity}</span> Community Discussions
                </>
              ) : (
                <>
                  University Peer <span className={styles.titleHighlight}>Discussions &amp; Doubts</span>
                </>
              )}
            </h1>
            <p className={styles.bannerSubtitle}>
              Ask doubts, share exam strategies, discuss past year question papers, and collaborate with university peers.
            </p>
          </div>

          <button className={styles.btnPrimary} onClick={handleAskClick} id="btn-ask-doubt">
            <LuPlus size={16} />
            <span>Ask a Doubt</span>
          </button>
        </section>

        {/* ================================================================
            CONTROLS & FILTERS
            ================================================================ */}
        <div className={styles.controlsRow}>
          <div className={styles.searchBarWrapper}>
            <div className={styles.searchInputGroup}>
              <LuSearch className={styles.searchIcon} size={16} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search discussions, questions or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

            <BranchSelect
              value={selectedBranch}
              onChange={setSelectedBranch}
              includeAllOption={true}
              variant="light"
              className={styles.filterBranchSelect}
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

          {/* Category / Status Tabs */}
          <div className={styles.tabsRow} role="tablist" aria-label="Discussion categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "all"}
              className={`${styles.tabBtn} ${activeTab === "all" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Discussions
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "trending"}
              className={`${styles.tabBtn} ${activeTab === "trending" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("trending")}
            >
              <LuFlame size={14} />
              <span>Trending</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "unanswered"}
              className={`${styles.tabBtn} ${activeTab === "unanswered" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("unanswered")}
            >
              <LuCircleHelp size={14} />
              <span>Unanswered</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "solved"}
              className={`${styles.tabBtn} ${activeTab === "solved" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("solved")}
            >
              <LuCircleCheck size={14} />
              <span>Solved</span>
            </button>
          </div>
        </div>

        {/* ================================================================
            DISCUSSIONS FEED LIST
            ================================================================ */}
        {isLoading && page === 1 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--slate-600, #4A5468)" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid var(--line-300, #CDD4E2)", borderTopColor: "var(--blue-500, #2447F5)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem" }}>Loading discussions feed...</p>
          </div>
        ) : discussions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#FFFFFF", borderRadius: "18px", border: "1px solid var(--line-300, #CDD4E2)" }}>
            <LuMessageSquare size={36} style={{ color: "var(--slate-400, #94A3B8)", margin: "0 auto 1rem", display: "block" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "var(--font-bricolage), sans-serif", color: "var(--ink-900, #0B1020)", margin: "0 0 0.5rem" }}>
              {isFiltered ? "No discussions match your current filters" : "No discussions found yet"}
            </h3>
            <p style={{ color: "var(--slate-600, #4A5468)", fontSize: "0.9rem", margin: "0 0 1.5rem", fontFamily: "var(--font-inter), sans-serif" }}>
              {isFiltered
                ? "Try resetting your branch/semester filter or search query to see all community topics."
                : `Be the first student to ask a doubt or start a discussion for ${userUniversity || "your university"}!`}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className={styles.btnSecondary}
                >
                  Show All Discussions
                </button>
              )}
              <button className={styles.btnPrimary} onClick={handleAskClick}>
                <LuPlus size={16} />
                <span>Ask a Doubt Now</span>
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
        <AskQuestionModalDynamic
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
