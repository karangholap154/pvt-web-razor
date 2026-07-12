"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./UsernameGate.module.css";

interface UsernameGateProps {
  email: string | null;
  onComplete: () => Promise<void>;
}

type CheckState = "idle" | "checking" | "available" | "taken" | "invalid";

// Dot allowed in middle only — not first/last char, no consecutive dots
const USERNAME_REGEX = /^(?!.*\.\.)[a-z0-9_][a-z0-9_.]{1,13}[a-z0-9_]$/;

export default function UsernameGate({ email, onComplete }: UsernameGateProps) {
  const [username, setUsername] = useState("");
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const normalized = username.trim().toLowerCase();
    if (!normalized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCheckState("idle");
      return;
    }
    if (!USERNAME_REGEX.test(normalized)) {
      setCheckState("invalid");
      return;
    }

    setCheckState("checking");
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profile/check-username?username=${encodeURIComponent(normalized)}`);
        const data = await res.json();
        setCheckState(data.available ? "available" : "taken");
      } catch {
        setCheckState("idle");
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const normalized = username.trim().toLowerCase();
    if (!USERNAME_REGEX.test(normalized)) {
      setError("Invalid username format.");
      return;
    }
    if (checkState !== "available") {
      setError("Please choose an available username.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalized }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save username.");
        return;
      }
      await onComplete();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = () => {
    if (checkState === "checking") return <span className={styles.spinner} />;
    if (checkState === "available") return <span className={styles.iconAvailable}>✓</span>;
    if (checkState === "taken") return <span className={styles.iconTaken}>✗</span>;
    if (checkState === "invalid") return <span className={styles.iconTaken}>!</span>;
    return null;
  };

  const getStatusMessage = () => {
    if (!username.trim()) return null;
    if (checkState === "checking") return <span className={styles.msgChecking}>Checking availability...</span>;
    if (checkState === "available") return <span className={styles.msgAvailable}>@{username.trim().toLowerCase()} is available!</span>;
    if (checkState === "taken") return <span className={styles.msgTaken}>This username is already taken.</span>;
    if (checkState === "invalid") return <span className={styles.msgTaken}>3–15 chars: letters, numbers, underscores only.</span>;
    return null;
  };

  return (
    <div className={styles.overlay}>
      {/* Ambient glow blobs */}
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.card}>
        {/* Icon badge */}
        <div className={styles.iconBadge}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Choose your username</h1>
          <p className={styles.subtitle}>
            Pick a unique handle for your Private Academy profile. You&apos;ll use it across the platform for notes, contributions, and reviews.
          </p>
          {email && (
            <span className={styles.emailBadge}>{email}</span>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <span className={styles.atSymbol}>@</span>
            <input
              type="text"
              className={`${styles.input} ${checkState === "available" ? styles.inputValid : checkState === "taken" || checkState === "invalid" ? styles.inputError : ""}`}
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))}
              maxLength={15}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              id="username-gate-input"
              disabled={saving}
            />
            <span className={styles.statusIcon}>{getStatusIcon()}</span>
          </div>

          <div className={styles.statusMessage}>{getStatusMessage()}</div>

          <div className={styles.rules}>
            <span className={username.length >= 3 ? styles.ruleMet : styles.rulePending}>✓ Min 3 characters</span>
            <span className={username.length <= 15 ? styles.ruleMet : styles.rulePending}>✓ Max 15 characters</span>
            <span className={/^[a-z0-9_]/.test(username) ? styles.ruleMet : styles.rulePending}>✓ Start with letter/number/_</span>
            <span className={/[a-z0-9_]$/.test(username) || username.length < 2 ? styles.ruleMet : styles.rulePending}>✓ End with letter/number/_</span>
            <span className={!username.includes('..') ? styles.ruleMet : styles.rulePending}>✓ No consecutive dots</span>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={saving || checkState !== "available"}
            id="btn-username-gate-submit"
          >
            {saving ? (
              <>
                <span className={styles.spinner} />
                Saving...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Confirm Username
              </>
            )}
          </button>
        </form>

        <p className={styles.footer}>
          You can change your username anytime from your{" "}
          <strong style={{ color: "var(--accent)" }}>Profile &amp; Settings</strong> page.
        </p>
      </div>
    </div>
  );
}
