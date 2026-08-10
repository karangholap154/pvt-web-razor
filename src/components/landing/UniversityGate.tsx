"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { UNIVERSITIES } from "../../utils/constants";
import styles from "./UniversityGate.module.css";

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
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--background)",
      padding: "3rem 1.5rem",
      position: "relative"
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "500px",
        height: "300px",
        background: "radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ width: "100%", maxWidth: "700px", position: "relative", zIndex: 1 }} className="animate-fade">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "rgba(251, 191, 36, 0.12)",
            border: "1px solid rgba(251, 191, 36, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            Select Your University
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "460px", margin: "0 auto" }}>
            Choose your university to customize your study notes board. This helps filter syllabus guides directly.
          </p>

          {/* Action Warn Alert */}
          <div style={{
            marginTop: "1.25rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: "var(--radius-sm)",
            padding: "0.5rem 1rem",
            fontSize: "0.8rem",
            color: "#f59e0b",
            fontWeight: 600,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            This selection is permanent and customizes your dashboard settings
          </div>
        </div>

        {/* Coming Soon Notice */}
        {comingSoonUniv && (
          <div style={{
            background: "rgba(251, 191, 36, 0.06)",
            border: "1px solid rgba(251, 191, 36, 0.2)",
            borderRadius: "var(--radius)",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            animation: "floatIn 0.3s ease",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(251, 191, 36, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--text-primary)" }}>
                Notes Library Coming Soon
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                Our team is currently compiling branch-wise study notes for {comingSoonUniv}. We will release the study folders for download shortly.
              </p>
            </div>
            <button
              onClick={() => setComingSoonUniv("")}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
                flexShrink: 0
              }}
              aria-label="Dismiss"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Grid cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          gap: "0.875rem",
          marginBottom: "2rem",
        }}>
          {UNIVERSITIES.map((u) => {
            const isSelected = selected === u.value;
            const noteCount = noteCounts[u.value] ?? 0;
            const isEmpty = countsLoaded && noteCount === 0;
            return (
              <button
                key={u.value}
                onClick={() => handleCardClick(u.value)}
                className={styles["univ-card"]}
                id={`univ-card-${u.abbr.toLowerCase()}`}
                style={{
                  // Pass dynamic vars for hover class styling
                  "--brand-color": u.color,
                  "--brand-bg": u.bg,
                  border: isSelected ? `2px solid ${u.color}` : isEmpty ? "1px solid rgba(255,255,255,0.04)" : "1px solid var(--border)",
                  background: isSelected ? u.bg : isEmpty ? "rgba(255,255,255,0.01)" : "var(--card-bg)",
                  transform: isSelected ? "translateY(-3px)" : "none",
                  boxShadow: isSelected ? `0 8px 24px -10px ${u.color}` : "none",
                  opacity: isEmpty ? 0.5 : 1,
                } as React.CSSProperties}
              >
                {/* Selected Checkmark badge */}
                {isSelected && (
                  <div style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: u.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5l2 2 5-5" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                {/* Empty label badge */}
                {isEmpty && !isSelected && (
                  <div style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#f59e0b",
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: "4px",
                    padding: "0.15rem 0.4rem",
                  }}>
                    Soon
                  </div>
                )}
                <div style={{
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  color: isSelected ? u.color : isEmpty ? "var(--text-secondary)" : "var(--text-primary)",
                  marginBottom: "0.25rem",
                }}>
                  {u.abbr}
                </div>
                <div style={{
                  fontSize: "0.8rem",
                  color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  lineHeight: 1.4,
                  fontWeight: 500,
                  marginBottom: "0.5rem"
                }}>
                  {u.value}
                </div>
                {countsLoaded && (
                  <div style={{
                    fontSize: "0.725rem",
                    fontWeight: 600,
                    color: noteCount > 0 ? "#22c55e" : "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: noteCount > 0 ? "#22c55e" : "var(--border)" }} />
                    {noteCount > 0 ? `${noteCount} study folders` : "Compiling files"}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#f87171",
            borderRadius: "var(--radius)",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            marginBottom: "1.25rem",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={!selected || !selectedHasNotes || saving}
          id="btn-confirm-university"
          style={{
            width: "100%",
            padding: "0.95rem",
            background: selected && selectedHasNotes ? "var(--accent)" : "rgba(255,255,255,0.03)",
            color: selected && selectedHasNotes ? "#ffffff" : "var(--text-secondary)",
            border: selected && selectedHasNotes ? "none" : "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: selected && selectedHasNotes ? "pointer" : "not-allowed",
            transition: "var(--transition)",
            boxShadow: selected && selectedHasNotes ? "0 4px 12px rgba(251, 191, 36, 0.25)" : "none"
          }}
        >
          {saving ? "Saving Selection..." : selected ? `Unlock Library — ${selected}` : "Select University to Unlock Content"}
        </button>
      </div>
    </main>
  );
}
