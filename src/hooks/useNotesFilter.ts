"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Note } from "@/data/mockData";
import { mapDbRowToNote, RawNoteRow } from "@/utils/noteMapper";

export interface NoteMeta {
  id: string;
  title: string;
  branch: string;
  semester: string;
  university?: string;
  subject?: string;
  resource_type?: string;
}

export interface UseNotesFilterOptions {
  initialNotes?: Note[];
  initialMeta?: NoteMeta[];
  catalogMode?: "official" | "community" | "all";
  userUniversity?: string | null;
  defaultBranch?: string | null;
  defaultSemester?: string | null;
  authState?: string;
}

export function useNotesFilter({
  initialNotes = [],
  initialMeta = [],
  catalogMode = "all",
  userUniversity,
  defaultBranch,
  defaultSemester,
  authState = "unauthenticated",
}: UseNotesFilterOptions = {}) {
  const searchParams = useSearchParams();

  // Primary filter state
  const [selectedUniv, setSelectedUniv] = useState<string>("All universities");
  const [selectedBranch, setSelectedBranch] = useState<string>("All branches");
  const [selectedSemester, setSelectedSemester] = useState<string>("All semesters");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  // Live database results
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [metaNotes, setMetaNotes] = useState<NoteMeta[]>(initialMeta);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Available universities derived from metadata
  const availableUniversities = useMemo(() => {
    const set = new Set<string>();
    metaNotes.forEach((m) => {
      if (m.university) set.add(m.university);
    });
    if (set.size === 0) {
      ["Mumbai University", "SPPU (Pune)", "DBATU", "RTMNU (Nagpur)"].forEach((u) => set.add(u));
    }
    return Array.from(set).sort();
  }, [metaNotes]);

  // Sync URL search params into filter state on initial load
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

  // Set default filters when authenticated user preferences are ready
  useEffect(() => {
    if (authState === "ready") {
      if (defaultBranch && !searchParams.get("branch")) setSelectedBranch(defaultBranch);
      if (defaultSemester && !searchParams.get("semester")) setSelectedSemester(defaultSemester);
    }
  }, [authState, defaultBranch, defaultSemester, searchParams]);

  // Search input debouncer (180ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 180);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch filtered notes from /api/notes
  useEffect(() => {
    // For default initial load, use pre-rendered initialNotes to preserve Supabase bandwidth
    if (
      (authState === "unauthenticated" || !userUniversity) &&
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

    if (authState === "loading") return;
    if (authState === "ready" && !userUniversity) return;

    let isSubscribed = true;

    async function loadFilteredNotes() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const activeUniv = userUniversity || (selectedUniv !== "All universities" ? selectedUniv : "");

        if (activeUniv) {
          queryParams.set("university", activeUniv);
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
        if (catalogMode && catalogMode !== "all") {
          queryParams.set("source", catalogMode);
        }

        const res = await fetch(`/api/notes?${queryParams.toString()}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch notes: ${res.statusText}`);
        }

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
        console.error("Error loading notes from API:", err);
        if (isSubscribed) setNotes([]);
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    }

    loadFilteredNotes();

    return () => {
      isSubscribed = false;
    };
  }, [
    authState,
    userUniversity,
    selectedUniv,
    selectedBranch,
    selectedSemester,
    debouncedSearchQuery,
    initialNotes,
    initialMeta,
    catalogMode,
  ]);

  const clearFilters = useCallback(() => {
    setSelectedUniv("All universities");
    setSelectedBranch("All branches");
    setSelectedSemester("All semesters");
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      (selectedUniv !== "All universities" && !userUniversity) ||
      selectedBranch !== "All branches" ||
      selectedSemester !== "All semesters" ||
      debouncedSearchQuery.trim() !== ""
    );
  }, [selectedUniv, userUniversity, selectedBranch, selectedSemester, debouncedSearchQuery]);

  return {
    notes,
    setNotes,
    metaNotes,
    setMetaNotes,
    isLoading,
    selectedUniv,
    setSelectedUniv,
    availableUniversities,
    selectedBranch,
    setSelectedBranch,
    selectedSemester,
    setSelectedSemester,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    setDebouncedSearchQuery,
    clearFilters,
    hasActiveFilters,
  };
}
