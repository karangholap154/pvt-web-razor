"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";
import { supabase } from "../../utils/supabaseClient";
import { ALLOWED_DOMAINS } from "../../utils/constants";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../components/providers/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshAuth } = useAuth();

  // Safe local redirect fallback to /dashboard
  const redirectParam = searchParams.get("redirect");
  const redirectUrl =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";

  // Check for confirmation_failed or domain_restricted error from the callback route
  const callbackError = searchParams.get("error");

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);
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
        await refreshAuth();
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
            {showRecoveryInfo
              ? "Recover access to your account manually"
              : !showEmailForm
              ? "Sign in or register to access your dashboard and notes"
              : activeTab === "login"
              ? "Sign in to access your dashboard and notes"
              : "Register to unlock and view your notes"}
          </p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}
        {successMsg && <div className={styles.successAlert}>{successMsg}</div>}
        {infoMsg && <div className={styles.infoAlert}>{infoMsg}</div>}

        {!showEmailForm ? (
          <div className={`${styles.optionsContainer} ${styles.fadeInUp}`}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className={styles.googleBtn}
              disabled={loading}
            >
              <FcGoogle className={styles.googleIcon} size={18} />
              <span>Sign in with Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowEmailForm(true);
                setError(null);
                setSuccessMsg(null);
                setInfoMsg(null);
              }}
              className={styles.emailBtn}
              disabled={loading}
            >
              <FiMail className={styles.emailIcon} size={18} />
              <span>Continue with Email</span>
            </button>
          </div>
        ) : (
          <div className={`${styles.optionsContainer} ${styles.fadeInUp}`}>
            {showRecoveryInfo ? (
              <div className={styles.recoveryContainer}>
                <button
                  type="button"
                  onClick={() => {
                    setShowRecoveryInfo(false);
                    setError(null);
                    setSuccessMsg(null);
                    setInfoMsg(null);
                  }}
                  className={styles.backBtn}
                  disabled={loading}
                >
                  <FiArrowLeft size={16} />
                  <span>Back to Login</span>
                </button>

                <p className={styles.recoveryText}>
                  Since we perform manual access verification to protect your purchases, our support team will restore your access directly. Please have your transaction details ready.
                </p>

                <a
                  href="https://wa.me/919423940547?text=Hello%20Private%20Academy%20Support,%20I%20need%20help%20recovering%20access%20to%20my%20account."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                  style={{ textDecoration: "none" }}
                >
                  <FaWhatsapp size={20} />
                  <span>Recover via WhatsApp</span>
                </a>

                <a
                  href="mailto:privateacademy.in@gmail.com?subject=Account%20Recovery%20Request&body=Hello%20Private%20Academy%20Support,%0A%0AI%20need%20help%20recovering%20access%20to%20my%20account.%20Here%20are%20my%20details:%0A-%20Email:%20%0A-%20Purchase%20Details/Transaction%20ID:%20"
                  className={styles.emailBtn}
                  style={{ textDecoration: "none" }}
                >
                  <FiMail size={18} className={styles.emailIcon} />
                  <span>Email Support</span>
                </a>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailForm(false);
                    setShowRecoveryInfo(false);
                    setError(null);
                    setSuccessMsg(null);
                    setInfoMsg(null);
                  }}
                  className={styles.backBtn}
                  disabled={loading}
                >
                  <FiArrowLeft size={16} />
                  <span>Back to options</span>
                </button>

                <div className={styles.tabs} style={{ width: "100%" }}>
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

                <form onSubmit={handleSubmit} className={styles.form} style={{ width: "100%" }}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={styles.input}
                      placeholder="student@gmail.com"
                      required={showEmailForm && !showRecoveryInfo}
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
                      required={showEmailForm && !showRecoveryInfo}
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
                        required={showEmailForm && activeTab === "signup" && !showRecoveryInfo}
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

                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => {
                    setShowRecoveryInfo(true);
                    setError(null);
                    setSuccessMsg(null);
                    setInfoMsg(null);
                  }}
                >
                  Forgot password or email? Get help
                </button>
              </>
            )}
          </div>
        )}
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
