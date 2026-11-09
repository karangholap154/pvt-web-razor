"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./UsernameGate.module.css";
import {
  LuUser,
  LuCheck,
  LuX,
  LuCircleAlert,
  LuShieldCheck,
  LuMail,
} from "react-icons/lu";

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
    if (checkState === "checking") return <span className={styles.inputSpinner} />;
    if (checkState === "available") return <span className={styles.iconAvailable}><LuCheck size={16} strokeWidth={3} /></span>;
    if (checkState === "taken") return <span className={styles.iconTaken}><LuX size={16} strokeWidth={2.5} /></span>;
    if (checkState === "invalid") return <span className={styles.iconTaken}><LuCircleAlert size={16} /></span>;
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
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.eyebrowTag}>
            <LuShieldCheck size={14} />
            <span>STUDENT IDENTITY • UNIQUE HANDLE</span>
          </div>

          <div className={styles.iconBadge}>
            <LuUser size={28} />
          </div>

          <h1 className={styles.title}>Claim Your Student Handle</h1>

          <p className={styles.subtitle}>
            Pick a unique handle for your Private Academy profile. You&apos;ll use it across the platform for notes, discussions, and contributor reviews.
          </p>

          {email && (
            <span className={styles.emailBadge}>
              <LuMail size={13} />
              <span>{email}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <span className={styles.atSymbol}>@</span>
            <input
              type="text"
              className={`${styles.input} ${checkState === "available" ? styles.inputValid : checkState === "taken" || checkState === "invalid" ? styles.inputError : ""}`}
              placeholder="username"
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

          {error && <p className={styles.errorMsg}>{error}</p>}

          <div className={styles.rules}>
            <span className={username.length >= 3 ? styles.ruleMet : styles.rulePending}>
              {username.length >= 3 ? "✓" : "•"} Min 3 characters
            </span>
            <span className={username.length <= 15 && username.length > 0 ? styles.ruleMet : styles.rulePending}>
              {username.length <= 15 && username.length > 0 ? "✓" : "•"} Max 15 characters
            </span>
            <span className={/^[a-z0-9_]/.test(username) ? styles.ruleMet : styles.rulePending}>
              {/^[a-z0-9_]/.test(username) ? "✓" : "•"} Starts with a-z/0-9/_
            </span>
            <span className={(/[a-z0-9_]$/.test(username) && username.length >= 2) ? styles.ruleMet : styles.rulePending}>
              {(/[a-z0-9_]$/.test(username) && username.length >= 2) ? "✓" : "•"} Ends with a-z/0-9/_
            </span>
            <span className={(!username.includes("..") && username.length > 0) ? styles.ruleMet : styles.rulePending}>
              {(!username.includes("..") && username.length > 0) ? "✓" : "•"} No consecutive dots
            </span>
          </div>

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={saving || checkState !== "available"}
            id="btn-username-gate-submit"
          >
            {saving ? (
              <>
                <span className={styles.spinner} />
                <span>Saving Handle...</span>
              </>
            ) : (
              <>
                <LuCheck size={18} strokeWidth={2.5} />
                <span>Confirm Student Handle</span>
              </>
            )}
          </button>
        </form>

        <p className={styles.footer}>
          You can change your username anytime from your{" "}
          <strong className={styles.footerLink}>Profile &amp; Settings</strong> desk.
        </p>
      </div>
    </div>
  );
}
