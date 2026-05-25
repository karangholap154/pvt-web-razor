"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { Note, Article } from "../data/mockData";
import { supabase } from "../utils/supabaseClient";

// ─── University constants ─────────────────────────────────────────────────────
const UNIVERSITIES = [
  { value: "Mumbai University", abbr: "MU" },
  { value: "Savitribai Phule Pune University", abbr: "SPPU" },
  { value: "Nagpur University", abbr: "NU" },
  { value: "Amravati University", abbr: "AU" },
  { value: "Dr. Babasaheb Ambedkar Technological University", abbr: "DBATU" },
  { value: "Shivaji University", abbr: "SUK" },
];

// ─── Login Gate Screen (Rich Landing Page) ───────────────────────────────────
function LoginGate() {
  return (
    <main style={{ background: "var(--background)", minHeight: "100vh" }}>
      <style>{`
        @keyframes floatUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        .gate-feature-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 32px rgba(0,0,0,0.25) !important; border-color: rgba(99,102,241,0.3) !important; }
        .gate-step:hover .gate-step-num { background: var(--accent) !important; color: #fff !important; }
      `}</style>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section style={{
        padding: "5rem 1.5rem 3.5rem",
        textAlign: "center",
        maxWidth: "720px",
        margin: "0 auto",
        animation: "floatUp 0.6s ease",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "999px",
          padding: "0.4rem 1rem",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "#818cf8",
          marginBottom: "1.75rem",
          letterSpacing: "0.02em",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s ease infinite" }} />
          Trusted by engineering students across Maharashtra
        </div>

        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          marginBottom: "1.25rem",
        }}>
          Your one-stop hub for{" "}
          <span style={{
            background: "linear-gradient(135deg, #6366f1, #a78bfa, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            university notes
          </span>
        </h1>

        <p style={{
          fontSize: "1.1rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          maxWidth: "540px",
          margin: "0 auto 2.5rem",
        }}>
          Access branch-wise, semester-sorted study notes, video tutorials, and premium guides — all tailored to your university syllabus.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/login"
            id="gate-login-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 2rem",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: "var(--radius-sm)",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              transition: "var(--transition)",
            }}
          >
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/login"
            id="gate-signup-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 2rem",
              background: "rgba(255,255,255,0.05)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              transition: "var(--transition)",
            }}
          >
            Log In
          </Link>
        </div>
      </section>

      {/* ── Stats Row ────────────────────────────────────────────── */}
      <section style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        flexWrap: "wrap",
        padding: "0 1.5rem 3.5rem",
        animation: "floatUp 0.7s ease",
      }}>
        {[
          { num: "6+", label: "Universities" },
          { num: "100+", label: "Study Notes" },
          { num: "Free", label: "Access Tier" },
          { num: "24/7", label: "Available" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center", minWidth: "100px" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.02em" }}>
              {stat.num}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 500, marginTop: "0.2rem" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: "1px", background: "var(--border)" }} />
      </div>

      {/* ── Feature Cards ────────────────────────────────────────── */}
      <section style={{
        maxWidth: "880px",
        margin: "0 auto",
        padding: "3.5rem 1.5rem",
        animation: "floatUp 0.8s ease",
      }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Everything you need to ace your exams
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "2.5rem", maxWidth: "480px", margin: "0 auto 2.5rem" }}>
          Built by students, for students — designed around how you actually study.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1rem",
        }}>
          {[
            {
              icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
              title: "Branch-wise Notes",
              desc: "Computer, IT, AIML, Mechanical — organised by your branch so you find exactly what you need.",
            },
            {
              icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
              title: "Video Tutorials",
              desc: "Each note can include an embedded video walkthrough to help you understand tough concepts visually.",
            },
            {
              icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
              title: "Instant PDF Downloads",
              desc: "Download notes as PDFs directly — no ads, no wait time. Study offline, anytime.",
            },
            {
              icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
              title: "University Personalised",
              desc: "Select your university once and see only the notes that match your syllabus — Mumbai, SPPU, Nagpur & more.",
            },
            {
              icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
              title: "Smart Search & Filters",
              desc: "Instantly search by title, filter by branch and semester — find the right material in seconds.",
            },
            {
              icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
              title: "Secure & Private",
              desc: "Your data stays safe. Simple login, no unnecessary permissions, and secure payment via Razorpay.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="gate-feature-card"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "1.5rem",
                transition: "all 0.25s ease",
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(99,102,241,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
                dangerouslySetInnerHTML={{ __html: f.icon }}
              />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.4rem" }}>{f.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: "1px", background: "var(--border)" }} />
      </div>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "3.5rem 1.5rem",
      }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          How it works
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "2.5rem" }}>
          Three simple steps to your study material.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {[
            { num: "1", title: "Create a free account", desc: "Sign up with your email — takes less than 30 seconds." },
            { num: "2", title: "Select your university", desc: "Choose your university to personalise the library to your syllabus." },
            { num: "3", title: "Browse & download", desc: "Search notes, watch video tutorials, and download PDFs instantly." },
          ].map((step) => (
            <div
              key={step.num}
              className="gate-step"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1.25rem",
                padding: "1.25rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                transition: "var(--transition)",
              }}
            >
              <div
                className="gate-step-num"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(99,102,241,0.12)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  flexShrink: 0,
                  transition: "all 0.25s ease",
                }}
              >
                {step.num}
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.25rem" }}>{step.title}</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "1rem 1.5rem 4rem",
        textAlign: "center",
      }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "var(--radius)",
          padding: "2.5rem 2rem",
        }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Ready to start studying smarter?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
            Join now — it&apos;s free, fast, and built for your university.
          </p>
          <Link
            href="/login"
            id="gate-bottom-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 2.5rem",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: "var(--radius-sm)",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              transition: "var(--transition)",
            }}
          >
            Get Started — It&apos;s Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}

// ─── University Selection Screen ──────────────────────────────────────────────
function UniversityGate({ onSelect }: { onSelect: (u: string) => void }) {
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [noteCounts, setNoteCounts] = useState<Record<string, number>>({});
  const [countsLoaded, setCountsLoaded] = useState(false);
  const [comingSoonUniv, setComingSoonUniv] = useState("");

  // Fetch note counts per university on mount
  useEffect(() => {
    async function fetchCounts() {
      try {
        const counts: Record<string, number> = {};
        for (const u of UNIVERSITIES) {
          const { count } = await (supabase
            .from("notes")
            .select("*", { count: "exact", head: true }) as any)
            .eq("university", u.value);
          counts[u.value] = count ?? 0;
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
    } catch (err: any) {
      setError(err.message || "Something went wrong");
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
      padding: "2rem 1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "680px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            Select Your University
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "440px", margin: "0 auto" }}>
            Choose the university whose syllabus notes you want to see. Your library will be personalised to your university.
          </p>

          {/* Warning */}
          <div style={{
            marginTop: "1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "var(--radius-sm)",
            padding: "0.5rem 1rem",
            fontSize: "0.82rem",
            color: "#f59e0b",
            fontWeight: 600,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            This selection is permanent and cannot be changed later
          </div>
        </div>

        {/* Coming Soon Popup */}
        {comingSoonUniv && (
          <div style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: "var(--radius)",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            animation: "fadeSlideIn 0.3s ease",
          }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(99,102,241,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.3rem", color: "var(--text-primary)" }}>
                Coming Soon — {comingSoonUniv.replace("University", "Univ.")}
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                Our team is actively preparing notes and study material for this university. We&apos;ll have it ready for you soon — check back in a few days!
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
                lineHeight: 0,
                flexShrink: 0,
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
        <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

        {/* University Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          gap: "0.875rem",
          marginBottom: "1.75rem",
        }}>
          {UNIVERSITIES.map((u) => {
            const isSelected = selected === u.value;
            const noteCount = noteCounts[u.value] ?? 0;
            const isEmpty = countsLoaded && noteCount === 0;
            return (
              <button
                key={u.value}
                onClick={() => handleCardClick(u.value)}
                id={`univ-card-${u.abbr.toLowerCase()}`}
                style={{
                  padding: "1.25rem 1rem",
                  borderRadius: "var(--radius)",
                  border: isSelected ? "2px solid var(--accent)" : isEmpty ? "1px solid rgba(255,255,255,0.06)" : "1px solid var(--border)",
                  background: isSelected ? "rgba(99,102,241,0.12)" : isEmpty ? "rgba(255,255,255,0.02)" : "var(--card-bg)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "var(--transition)",
                  position: "relative",
                  transform: isSelected ? "translateY(-2px)" : "none",
                  boxShadow: isSelected ? "0 8px 24px rgba(99,102,241,0.2)" : "none",
                  opacity: isEmpty ? 0.55 : 1,
                }}
              >
                {/* Checkmark for selected */}
                {isSelected && (
                  <div style={{
                    position: "absolute",
                    top: "0.6rem",
                    right: "0.6rem",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                {/* "Coming Soon" badge for empty universities */}
                {isEmpty && !isSelected && (
                  <div style={{
                    position: "absolute",
                    top: "0.55rem",
                    right: "0.55rem",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "#f59e0b",
                    background: "rgba(245,158,11,0.12)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    borderRadius: "4px",
                    padding: "0.15rem 0.4rem",
                  }}>
                    Soon
                  </div>
                )}
                <div style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: isSelected ? "var(--accent)" : isEmpty ? "var(--text-secondary)" : "var(--text-primary)",
                  marginBottom: "0.35rem",
                }}>
                  {u.abbr}
                </div>
                <div style={{
                  fontSize: "0.78rem",
                  color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  lineHeight: 1.4,
                  fontWeight: 500,
                }}>
                  {u.value}
                </div>
                {/* Note count badge */}
                {countsLoaded && (
                  <div style={{
                    marginTop: "0.5rem",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: noteCount > 0 ? "#22c55e" : "var(--text-secondary)",
                  }}>
                    {noteCount > 0 ? `${noteCount} ${noteCount === 1 ? "note" : "notes"} available` : "No notes yet"}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
            borderRadius: "var(--radius-sm)",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!selected || !selectedHasNotes || saving}
          id="btn-confirm-university"
          style={{
            width: "100%",
            padding: "0.925rem",
            background: selected && selectedHasNotes ? "var(--accent)" : "rgba(255,255,255,0.05)",
            color: selected && selectedHasNotes ? "#fff" : "var(--text-secondary)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: selected && selectedHasNotes ? "pointer" : "not-allowed",
            transition: "var(--transition)",
          }}
        >
          {saving ? "Saving your choice..." : selected ? `Confirm — ${selected}` : "Select a university to continue"}
        </button>
      </div>
    </main>
  );
}

// ─── Main HomeContent (Notes Library) ────────────────────────────────────────
function HomeContent() {
  const searchParams = useSearchParams();
  const unlockNoteId = searchParams.get("unlock");

  // Auth / gate state
  const [authState, setAuthState] = useState<"loading" | "unauthenticated" | "no-university" | "ready">("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userUniversity, setUserUniversity] = useState<string | null>(null);

  // Live database states
  const [notes, setNotes] = useState<Note[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All branches");
  const [selectedSemester, setSelectedSemester] = useState("All semesters");

  // Modal state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalType, setModalType] = useState<"video" | "pdf" | null>(null);

  // Checkout states
  const [showCheckoutPrompt, setShowCheckoutPrompt] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState<Note | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "verifying" | "paying" | "success" | "error">("idle");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // ── Check authentication + university on mount ──────────────────────────
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.authenticated) {
          setAuthState("unauthenticated");
          return;
        }
        setUserEmail(data.email);
        if (!data.university) {
          setAuthState("no-university");
        } else {
          setUserUniversity(data.university);
          setAuthState("ready");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthState("unauthenticated");
      }
    }
    checkAuth();
  }, []);

  // ── Fetch notes filtered by university ─────────────────────────────────
  useEffect(() => {
    if (authState !== "ready" || !userUniversity) return;

    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch notes for this university
        const { data: dbNotes, error: notesError } = await (supabase
          .from("notes")
          .select("*") as any)
          .eq("university", userUniversity)
          .order("title", { ascending: true });

        // Fetch articles (not filtered by university)
        const { data: dbArticles, error: articlesError } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });

        let finalNotes: Note[] = [];
        let finalArticles: Article[] = [];

        if (!notesError && dbNotes) {
          finalNotes = dbNotes.map((item: any) => ({
            id: item.id,
            title: item.title,
            branch: item.branch as any,
            semester: item.semester,
            description: item.description || "",
            downloadUrl: item.download_url || "",
            videoUrl: item.video_url || "",
            price: item.price ? Number(item.price) : 0,
            university: item.university,
          }));
        }

        if (!articlesError && dbArticles) {
          finalArticles = dbArticles.map((item) => ({
            id: item.id,
            title: item.title,
            author: item.author,
            date: item.date,
            readTime: item.read_time || "",
            category: item.category as any,
            summary: item.summary || "",
            content: item.content || "",
          }));
        }

        setNotes(finalNotes);
        setArticles(finalArticles);
      } catch (err) {
        console.error("Error loading data:", err);
        setNotes([]);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [authState, userUniversity]);

  // ── Filtered Notes memo ─────────────────────────────────────────────────
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch =
        selectedBranch === "All branches" || note.branch === selectedBranch;
      const matchesSemester =
        selectedSemester === "All semesters" || note.semester === selectedSemester;
      return matchesSearch && matchesBranch && matchesSemester;
    });
  }, [notes, searchQuery, selectedBranch, selectedSemester]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedBranch("All branches");
    setSelectedSemester("All semesters");
  };

  const openModal = (note: Note, type: "video" | "pdf") => {
    setSelectedNote(note);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setModalType(null);
  };

  const applyQuickFilter = (search: string, branch: string, semester: string) => {
    setSearchQuery(search);
    setSelectedBranch(branch);
    setSelectedSemester(semester);
  };

  const handleDownload = async (url: string, title: string) => {
    if (!url) return;
    setDownloadingPdf(true);
    try {
      const response = await fetch(url);
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
      window.open(url, "_blank");
    } finally {
      setDownloadingPdf(false);
      closeModal();
    }
  };

  const handleDownloadClick = (note: Note) => {
    if (note.price && note.price > 0) {
      setCheckoutNote(note);
      setCheckoutEmail(userEmail || "");
      setCheckoutStatus("idle");
      setShowCheckoutPrompt(true);
    } else {
      openModal(note, "pdf");
    }
  };

  // Automatic purchase recovery on redirect
  useEffect(() => {
    if (authState === "ready" && notes.length > 0 && unlockNoteId) {
      const targetNote = notes.find((n) => n.id === unlockNoteId);
      if (targetNote) {
        handleDownloadClick(targetNote);
        const url = new URL(window.location.href);
        url.searchParams.delete("unlock");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [authState, notes, unlockNoteId]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail.trim() || !checkoutNote) return;

    setCheckoutStatus("verifying");

    try {
      const cleanEmail = checkoutEmail.trim().toLowerCase();

      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("email", cleanEmail)
        .eq("note_id", checkoutNote.id)
        .eq("status", "success")
        .maybeSingle();

      if (purchase) {
        setCheckoutStatus("success");
        setShowCheckoutPrompt(false);
        openModal(checkoutNote, "pdf");
        return;
      }

      setCheckoutStatus("paying");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: checkoutNote.id, email: cleanEmail }),
      });

      const orderData = await res.json();
      if (orderData.error) {
        alert(`Checkout order creation error: ${orderData.error}`);
        setCheckoutStatus("idle");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_StVqhHUbbFc4bs",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Private Academy",
        description: `Unlock ${checkoutNote.title}`,
        order_id: orderData.orderId,
        prefill: { email: cleanEmail },
        handler: async function (response: any) {
          try {
            setCheckoutStatus("verifying");
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                noteId: checkoutNote.id,
                email: cleanEmail,
                amount: orderData.amount,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("Payment verified successfully! Access granted.");
              setCheckoutStatus("success");
              setShowCheckoutPrompt(false);
              openModal(checkoutNote, "pdf");
            } else {
              alert(`Verification failed: ${verifyData.error}`);
              setCheckoutStatus("idle");
            }
          } catch (err) {
            console.error("Verification callback failed:", err);
            alert("Verification check failed.");
            setCheckoutStatus("idle");
          }
        },
        modal: { ondismiss: function () { setCheckoutStatus("idle"); } },
        theme: { color: "#6366f1" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout submission failed:", err);
      alert("Error starting checkout process.");
      setCheckoutStatus("idle");
    }
  };

  // ── Gate screens ────────────────────────────────────────────────────────
  if (authState === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column", gap: "1rem" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading Private Academy...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (authState === "unauthenticated") return <LoginGate />;

  if (authState === "no-university") {
    return <UniversityGate onSelect={(u) => { setUserUniversity(u); setAuthState("ready"); }} />;
  }

  // ── Library ─────────────────────────────────────────────────────────────
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.heroSection} id="hero-section">
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge} id="hero-badge">
            {userUniversity} — Your engineering study hub
          </div>
          <h1 className={styles.heroTitle} id="hero-title">
            Study smarter — <br />
            <span className="gradient-text">faster access to notes and guides</span>
          </h1>
          <p className={styles.heroSubtext} id="hero-subtext">
            A unified place to search branch-wise notes, filter by semester, and open tutorials or downloads — personalised for {userUniversity}.
          </p>
          <div className={styles.heroActions} id="hero-actions">
            <a href="#search-section" className={styles.btnPrimary} id="btn-explore-notes">
              Explore Notes
            </a>
            <Link href="/articles" className={styles.btnSecondary} id="btn-read-articles">
              Read Articles
            </Link>
            <Link href="/projects" className={styles.btnSecondary} id="btn-see-projects">
              See Projects
            </Link>
          </div>

          <div className={styles.heroChips} id="hero-chips">
            <div className={styles.chip} onClick={() => applyQuickFilter("Structures", "All branches", "All semesters")} style={{ cursor: "pointer" }}>
              <span className={styles.chipIcon}>✓</span> Search instantly by title
            </div>
            <div className={styles.chip} onClick={() => applyQuickFilter("", "Computer", "Sem 3")} style={{ cursor: "pointer" }}>
              <span className={styles.chipIcon}>✓</span> Filter by branch & semester
            </div>
            <div className={styles.chip} onClick={() => applyQuickFilter("", "All branches", "Sem 5")} style={{ cursor: "pointer" }}>
              <span className={styles.chipIcon}>✓</span> Open downloads and videos
            </div>
          </div>
        </div>

        {/* Hero Right Widget - Recent Articles */}
        <aside className={styles.articlesWidget} id="recent-articles-widget">
          <div className={styles.widgetTitle}>
            <span>Recent Articles</span>
            <Link href="/articles" className={styles.widgetTitleLink}>
              View All →
            </Link>
          </div>
          <div className={styles.widgetList}>
            {isLoading ? (
              <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", padding: "1rem 0" }}>Loading recent feeds...</div>
            ) : (
              articles.slice(0, 3).map((art) => (
                <Link href={`/articles#${art.id}`} key={art.id} className={styles.widgetCard}>
                  <span className={styles.widgetCardCategory}>{art.category}</span>
                  <span className={styles.widgetCardTitle}>{art.title}</span>
                  <div className={styles.widgetCardMeta}>
                    <span>{art.author}</span>
                    <span>{art.readTime}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>
      </section>

      {/* Search & Filter Section */}
      <section className={styles.searchSection} id="search-section">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeading}>Search the library</h2>
          <p className={styles.sectionSubtext}>
            Use search, branch, and semester together to narrow results fast.
          </p>
        </div>

        <div className={styles.filterForm}>
          <div className={styles.inputGroup}>
            <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              id="search-notes-input"
            />
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className={styles.selectInput}
            id="filter-branch-select"
            aria-label="Filter by Branch"
          >
            <option value="All branches">All branches</option>
            <option value="Computer">Computer</option>
            <option value="IT">IT</option>
            <option value="AIML">AIML</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Chemical">Chemical</option>
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className={styles.selectInput}
            id="filter-semester-select"
            aria-label="Filter by Semester"
          >
            <option value="All semesters">All semesters</option>
            <option value="Sem 1">Sem 1</option>
            <option value="Sem 2">Sem 2</option>
            <option value="Sem 3">Sem 3</option>
            <option value="Sem 4">Sem 4</option>
            <option value="Sem 5">Sem 5</option>
            <option value="Sem 6">Sem 6</option>
            <option value="Sem 7">Sem 7</option>
            <option value="Sem 8">Sem 8</option>
          </select>

          <button onClick={handleClearFilters} className={styles.btnClear} id="btn-clear-filters">
            Clear
          </button>
        </div>

        <div className={styles.resultsMeta}>
          <span id="results-count">
            {isLoading ? "Counting results..." : `Showing ${filteredNotes.length} ${filteredNotes.length === 1 ? "result" : "results"}`}
          </span>
          {(searchQuery || selectedBranch !== "All branches" || selectedSemester !== "All semesters") && (
            <span style={{ color: "var(--accent)", fontWeight: 500 }}>Filters Active</span>
          )}
        </div>
      </section>

      {/* Featured Notes Section */}
      <section className={styles.notesSection} id="featured-notes-section">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeading}>Featured notes</h2>
          <p className={styles.sectionSubtext}>
            Open a note, check the video, or go straight to the download when it is available.
          </p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
            <div style={{ width: "30px", height: "30px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem auto" }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h3>Syncing with library database...</h3>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className={styles.grid}>
            {filteredNotes.map((note) => (
              <article className={styles.noteCard} key={note.id} id={note.id}>
                <div className={styles.noteCardHeader}>
                  <h3 className={styles.noteCardTitle}>{note.title}</h3>
                </div>
                <div className={styles.badgeRow}>
                  <span className={styles.tagBranch}>{note.branch}</span>
                  <span className={styles.badgeSemester}>{note.semester}</span>
                  {note.price && note.price > 0 ? (
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                      ₹{note.price}
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#22c55e", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                      Free
                    </span>
                  )}
                </div>
                <p className={styles.noteCardDesc}>{note.description}</p>

                <div className={styles.noteCardActions}>
                  <button
                    onClick={() => openModal(note, "video")}
                    className={`${styles.btnAction} ${styles.btnActionVideo}`}
                    id={`btn-watch-video-${note.id}`}
                  >
                    Watch Video
                  </button>
                  <button
                    onClick={() => handleDownloadClick(note)}
                    className={`${styles.btnAction} ${styles.btnActionPdf}`}
                    id={`btn-download-${note.id}`}
                  >
                    {note.price && note.price > 0 ? "Unlock PDF" : "Download PDF"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.noResults} id="no-results-alert">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: "1rem" }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <h3>No notes found for {userUniversity}</h3>
            <p style={{ marginTop: "0.5rem" }}>The admin hasn&apos;t added notes for your university yet, or try clearing your filters.</p>
          </div>
        )}
      </section>

      {/* Checkout Modal */}
      {showCheckoutPrompt && checkoutNote && (
        <div className={styles.modalBackdrop} onClick={() => setShowCheckoutPrompt(false)} id="checkout-backdrop">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} id="checkout-modal-content">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Unlock Study Notes</h3>
              <button onClick={() => setShowCheckoutPrompt(false)} className={styles.modalCloseBtn} id="btn-close-checkout">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{checkoutNote.title}</h4>
              {!userEmail ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                    You need to be signed in to purchase or access premium study guides.
                  </p>
                  <Link
                    href={`/login?redirect=/?unlock=${checkoutNote.id}`}
                    className={styles.btnPrimary}
                    style={{ justifyContent: "center", textAlign: "center", textDecoration: "none" }}
                    id="btn-login-to-purchase"
                  >
                    Log In / Sign Up
                  </Link>
                </div>
              ) : (
                <>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                    This is a premium resource. Proceed to verify your past purchase or buy now for <strong>₹{checkoutNote.price}</strong>.
                  </p>
                  <form onSubmit={handleCheckoutSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }} id="checkout-form">
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label htmlFor="checkout-email" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>Email Address</label>
                      <input
                        type="email"
                        id="checkout-email"
                        required
                        value={checkoutEmail}
                        onChange={(e) => setCheckoutEmail(e.target.value)}
                        disabled={true}
                        style={{ width: "100%", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-sans)", outline: "none", opacity: 0.75 }}
                      />
                      <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 500 }}>Logged in as {userEmail}</span>
                    </div>
                    <button
                      type="submit"
                      className={styles.btnPrimary}
                      disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                      style={{ justifyContent: "center", marginTop: "0.5rem" }}
                      id="btn-trigger-payment-flow"
                    >
                      {checkoutStatus === "verifying" && "Checking Purchases..."}
                      {checkoutStatus === "paying" && "Redirecting to Razorpay..."}
                      {checkoutStatus === "idle" && "Proceed to Unlock"}
                    </button>
                  </form>
                </>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowCheckoutPrompt(false)} className={styles.btnSecondary} id="btn-close-checkout-footer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Video / PDF Modal */}
      {modalType && selectedNote && (
        <div className={styles.modalBackdrop} onClick={closeModal} id="modal-backdrop">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} id="modal-content-container">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalType === "video" && "Video Tutorial"}
                {modalType === "pdf" && "PDF Download Link"}
              </h3>
              <button onClick={closeModal} className={styles.modalCloseBtn} id="btn-close-modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span className={styles.tagBranch}>{selectedNote.branch}</span>
                <span className={styles.badgeSemester}>{selectedNote.semester}</span>
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{selectedNote.title}</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{selectedNote.description}</p>

              {modalType === "video" && (
                <div className={styles.videoWrapper} id="video-preview-iframe">
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
                <div style={{ textAlign: "center", padding: "2rem 1rem", backgroundColor: "var(--background)", borderRadius: "8px", border: "1px dashed var(--border)" }} id="pdf-download-pane">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginBottom: "1rem" }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <polyline points="9 15 12 18 15 15"></polyline>
                  </svg>
                  <h5>{selectedNote.title}.pdf</h5>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>File Size: ~4.2 MB</p>
                  <button
                    onClick={() => handleDownload(selectedNote.downloadUrl, selectedNote.title)}
                    className={styles.btnPrimary}
                    style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}
                    disabled={downloadingPdf}
                    id="btn-trigger-pdf-download"
                  >
                    {downloadingPdf ? "Downloading..." : "Confirm Download"}
                  </button>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.btnSecondary} id="btn-close-modal-footer">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "var(--text-secondary)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem auto" }}></div>
          <h3>Loading Private Academy Library...</h3>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
