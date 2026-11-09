"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { UNIVERSITIES } from "../../utils/constants";
import styles from "./UniversityGate.module.css";
import {
  LuGraduationCap,
  LuClock,
  LuCheck,
  LuInfo,
  LuX,
  LuArrowRight,
  LuShieldCheck,
} from "react-icons/lu";

interface UniversityGateProps {
  onSelect: (university: string) => void;
}

export default function UniversityGate({ onSelect }: UniversityGateProps) {
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [noteCounts, setNoteCounts] = useState<Record<string, number>>({});
  const [countsLoaded, setCountsLoaded] = useState(false);
  const [comingSoonUniv, setComingSoonUniv] = useState("");

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { data } = await supabase
          .from("notes")
          .select("university");

        const counts: Record<string, number> = {};
        if (data) {
          data.forEach((item) => {
            if (item.university) {
              counts[item.university] = (counts[item.university] || 0) + 1;
            }
          });
        }
        setNoteCounts(counts);
      } catch (err) {
        console.error("Failed to load note counts:", err);
      } finally {
        setCountsLoaded(true);
      }
    }
    fetchCounts();
  }, []);

  const selectedHasNotes = selected ? (noteCounts[selected] ?? 0) > 0 : false;

  const handleCardClick = (univValue: string) => {
    const count = noteCounts[univValue] ?? 0;
    if (count === 0 && countsLoaded) {
      setComingSoonUniv(univValue);
      setSelected("");
    } else {
      setComingSoonUniv("");
      setSelected(univValue);
    }
  };

  const handleConfirm = async () => {
    if (!selected || !selectedHasNotes) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/university", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save university");
      onSelect(selected);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.pageWrapper}>
      {/* Subtle Graph-Paper Grid Background */}
      <div className={styles.gridOverlay} />

      <div className={styles.gateCard}>
        {/* Header Area */}
        <div className={styles.header}>
          <div className={styles.eyebrowTag}>
            <LuShieldCheck size={14} />
            <span>ONBOARDING • ACADEMIC AFFILIATION</span>
          </div>

          <div className={styles.iconWrapper}>
            <LuGraduationCap size={28} />
          </div>

          <h1 className={styles.title}>Select Your University</h1>
          
          <p className={styles.subtitle}>
            Choose your university to customize your study notes catalog and filter syllabus guides directly.
          </p>

          <div className={styles.infoNotice}>
            <LuInfo size={15} />
            <span>You can update your university selection anytime from your profile</span>
          </div>
        </div>

        {/* Coming Soon Notice */}
        {comingSoonUniv && (
          <div className={styles.comingSoonBanner}>
            <LuClock className={styles.comingSoonIcon} size={20} />
            <div className={styles.comingSoonContent}>
              <h4 className={styles.comingSoonTitle}>Notes Library Coming Soon</h4>
              <p className={styles.comingSoonText}>
                Our team is currently compiling branch-wise study notes for {comingSoonUniv}. We will release the study folders for download shortly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setComingSoonUniv("")}
              className={styles.comingSoonDismiss}
              aria-label="Dismiss notice"
            >
              <LuX size={18} />
            </button>
          </div>
        )}

        {/* University Selection Grid */}
        <div className={styles.univGrid} role="radiogroup" aria-label="Universities">
          {UNIVERSITIES.map((u) => {
            const isSelected = selected === u.value;
            const noteCount = noteCounts[u.value] ?? 0;
            const isEmpty = countsLoaded && noteCount === 0;

            return (
              <button
                key={u.value}
                type="button"
                onClick={() => handleCardClick(u.value)}
                className={`${styles.univCard} ${isSelected ? styles.univCardSelected : ""} ${isEmpty && !isSelected ? styles.univCardEmpty : ""}`}
                id={`univ-card-${u.abbr.toLowerCase()}`}
                role="radio"
                aria-checked={isSelected}
              >
                {/* Checkmark Badge */}
                {isSelected && (
                  <div className={styles.checkBadge}>
                    <LuCheck size={13} strokeWidth={3} />
                  </div>
                )}

                {/* Soon Badge */}
                {isEmpty && !isSelected && (
                  <span className={styles.soonBadge}>SOON</span>
                )}

                <div>
                  <div className={styles.abbrText}>{u.abbr}</div>
                  <div className={styles.univName}>{u.value}</div>
                </div>

                {countsLoaded && (
                  <div className={styles.countRow}>
                    <span className={noteCount > 0 ? styles.countDotActive : styles.countDotInactive} />
                    <span className={noteCount > 0 ? styles.activeCountText : ""}>
                      {noteCount > 0 ? `${noteCount} study folders` : "Compiling syllabus"}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className={styles.errorBanner}>
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selected || !selectedHasNotes || saving}
          id="btn-confirm-university"
          className={styles.btnConfirm}
        >
          {saving ? (
            <span>Saving Selection...</span>
          ) : selected ? (
            <>
              <span>Unlock Library — {selected}</span>
              <LuArrowRight size={18} />
            </>
          ) : (
            <span>Select University to Unlock Content</span>
          )}
        </button>
      </div>
    </main>
  );
}
