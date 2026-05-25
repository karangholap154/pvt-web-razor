"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";

const ALLOWED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "aol.com",
  "live.com",
  "zohomail.in",
  "zohomail.com",
  "privateacademy.in",
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Safe local redirect fallback to /dashboard
  const redirectParam = searchParams.get("redirect");
  const redirectUrl =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";

  // Check for confirmation_failed error from the callback route
  const callbackError = searchParams.get("error");

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError === "confirmation_failed"
      ? "Email confirmation link is invalid or expired. Please sign up again."
      : null
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setInfoMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Client-side domain check
    const domain = cleanEmail.split("@").pop() || "";
    if (!ALLOWED_DOMAINS.includes(domain)) {
      setError(
        "Registration and login are restricted to supported email providers (e.g. Gmail, Yahoo, Outlook, iCloud, Proton, privateacademy.in)."
      );
      return;
    }

    if (activeTab === "signup") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint =
        activeTab === "login" ? "/api/auth/login" : "/api/auth/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Special branded rate-limit message
        if (data.error === "RATE_LIMIT" || response.status === 429) {
          setInfoMsg(
            "🚀 Private Academy Engineering is growing fast! Our email service has reached its limit for now. Please try signing up again in a little while."
          );
          return;
        }
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      if (activeTab === "login") {
        setSuccessMsg("Logged in successfully! Redirecting...");
        setTimeout(() => {
          router.push(redirectUrl);
          router.refresh();
        }, 1000);
      } else {
        // Signup success — show "check your email" message
        if (data.message === "CONFIRM_EMAIL") {
          setInfoMsg(
            `📧 We've sent a confirmation link to ${cleanEmail}. Please check your inbox (and spam folder) and click the link to activate your account.`
          );
          setActiveTab("login");
          setPassword("");
          setConfirmPassword("");
        } else {
          setSuccessMsg("Signup successful! You can now log in.");
          setActiveTab("login");
          setPassword("");
          setConfirmPassword("");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>
            Private<span className="gradient-text">Academy</span>
          </h2>
          <p className={styles.subtitle}>
            {activeTab === "login"
              ? "Sign in to access your dashboard and notes"
              : "Register to unlock and view your notes"}
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "login" ? styles.activeTabBtn : ""}`}
            onClick={() => {
              setActiveTab("login");
              setError(null);
              setSuccessMsg(null);
              setInfoMsg(null);
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "signup" ? styles.activeTabBtn : ""}`}
            onClick={() => {
              setActiveTab("signup");
              setError(null);
              setSuccessMsg(null);
              setInfoMsg(null);
            }}
          >
            Sign Up
          </button>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}
        {successMsg && <div className={styles.successAlert}>{successMsg}</div>}
        {infoMsg && <div className={styles.infoAlert}>{infoMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="student@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {activeTab === "signup" && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={styles.input}
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.loadingSpinner}></div>
            ) : activeTab === "login" ? (
              "Sign In"
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 140px)",
            padding: "2rem",
            color: "var(--text-secondary)",
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                border: "3px solid rgba(255,255,255,0.1)",
                borderTopColor: "var(--accent)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 1rem auto",
              }}
            ></div>
            <h3>Loading...</h3>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
