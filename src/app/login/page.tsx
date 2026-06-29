"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";
import { supabase } from "../../utils/supabaseClient";
import { ALLOWED_DOMAINS } from "../../utils/constants";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Safe local redirect fallback to /dashboard
  const redirectParam = searchParams.get("redirect");
  const redirectUrl =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";

  // Check for confirmation_failed or domain_restricted error from the callback route
  const callbackError = searchParams.get("error");

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError === "confirmation_failed"
      ? "Email confirmation link is invalid or expired. Please sign up again."
      : callbackError === "domain_restricted"
      ? "Registration and login are restricted to supported email providers (e.g. Gmail, Yahoo, Outlook, iCloud, Proton, privateacademy.in)."
      : null
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMsg);
      setLoading(false);
    }
  };

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
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMsg);
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

        <div className={styles.divider}>
          <span className={styles.dividerText}>or continue with</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className={styles.googleBtn}
          disabled={loading}
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
            />
            <path
              fill="#34A853"
              d="M16.04 15.345c-1.07.727-2.42 1.164-4.04 1.164-2.855 0-5.273-1.89-6.137-4.436L1.79 15.17C3.766 19.11 7.84 21.818 12 21.818c3.055 0 5.864-1.09 8.009-3L16.04 15.345Z"
            />
            <path
              fill="#4285F4"
              d="M23.82 12.273c0-.818-.082-1.61-.218-2.382H12v4.618h6.636a5.673 5.673 0 0 1-2.454 3.71l3.968 3.072c2.318-2.136 3.67-5.281 3.67-9.018Z"
            />
            <path
              fill="#FBBC05"
              d="M5.864 12.073a6.877 6.877 0 0 1 0-2.309L1.838 6.65a11.956 11.956 0 0 0 0 10.8L5.864 12.073Z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        <div style={{
          marginTop: "1.5rem",
          paddingTop: "1.25rem",
          borderTop: "1px solid var(--border)",
          fontSize: "0.825rem",
          color: "var(--text-secondary)",
          lineHeight: "1.5",
          textAlign: "center"
        }}>
          <p style={{ marginBottom: "0.5rem", fontWeight: 600, color: "var(--text-primary)" }}>
            🔑 Forgot your account email or password?
          </p>
          <p>
            If you purchased notes before and cannot access your account, please email us at{" "}
            <a href="mailto:privateacademy.in@gmail.com" style={{ color: "var(--accent)", fontWeight: 600 }}>
              privateacademy.in@gmail.com
            </a>{" "}
            or message us on WhatsApp at{" "}
            <a 
              href="https://wa.me/919423940547" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: "#22c55e", fontWeight: 600 }}
            >
              +91 9423940547
            </a>{" "}
            with your transaction details. We will restore your access manually.
          </p>
        </div>
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
