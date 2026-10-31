"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";
import { supabase } from "../../utils/supabaseClient";
import { ALLOWED_DOMAINS } from "../../utils/constants";
import { FcGoogle } from "react-icons/fc";
import { 
  FiMail, 
  FiArrowLeft, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiInfo, 
  FiCheck,
  FiBookOpen,
  FiDownloadCloud,
  FiShield
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../components/providers/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshAuth } = useAuth();

  // Safe local redirect fallback to the home page
  const redirectParam = searchParams.get("redirect");
  const redirectUrl =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/";

  // Check for confirmation_failed or domain_restricted error from the callback route
  const callbackError = searchParams.get("error");

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
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
      if (!acceptedLegal) {
        setError(
          "You must agree to the Terms & Conditions, Privacy Policy, Refund Policy, Shipping Policy, and Disclaimer to create an account."
        );
        return;
      }
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
        // Special branded rate-limit message for signup email provider limits
        if (data.error === "RATE_LIMIT") {
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
          setAcceptedLegal(false);
        } else {
          setSuccessMsg("Signup successful! You can now log in.");
          setActiveTab("login");
          setPassword("");
          setConfirmPassword("");
          setAcceptedLegal(false);
        }
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.splitLayout}>

        {/* ==================================================================
            LEFT COLUMN: NOTEBOOK ARTWORK & BRAND PROMISE (DESKTOP)
            ================================================================== */}
        <div className={styles.artColumn}>
          <div className={styles.artContent}>
            <div>
              <h1 className={styles.artHeadline}>
                Your university, <span className={styles.artHighlight}>your notes.</span>
              </h1>
              <p className={styles.artSubtitle} style={{ marginTop: "12px" }}>
                Verified engineering syllabus study guides, problem derivations, and offline PDF access curated by scholars.
              </p>
            </div>

            {/* Rotated Signature Note Sheet */}
            <div className={styles.artSheetContainer}>
              <div className={styles.artSheet}>
                <div className={styles.sheetHeader}>
                  <span className={styles.sheetSpecTag}>ENGG // CURRICULUM</span>
                  <span className={styles.sheetDate}>SEMESTER SCHEME</span>
                </div>

                <div className={styles.sheetBody}>
                  <div className={styles.sheetLine} style={{ width: "85%" }} />
                  <div className={`${styles.sheetLine} ${styles.sheetLineHighlight}`} style={{ width: "65%" }} />
                  <div className={styles.sheetLine} style={{ width: "95%" }} />
                  <div className={styles.sheetLine} style={{ width: "75%" }} />
                </div>

                <div className={styles.sheetStampsRow}>
                  <span className={styles.stampBadge}>SPPU</span>
                  <span className={styles.stampBadge}>MU</span>
                  <span className={styles.stampBadge}>DBATU</span>
                  <span className={styles.stampBadge}>SUK</span>
                  <span className={styles.stampBadge}>NU</span>
                </div>
              </div>
            </div>

            {/* Feature Perks */}
            <ul className={styles.perksList}>
              <li className={styles.perkItem}>
                <span className={styles.perkIcon}>
                  <FiDownloadCloud size={16} />
                </span>
                <span>Instant offline PDF downloads with handwritten derivations</span>
              </li>
              <li className={styles.perkItem}>
                <span className={styles.perkIcon}>
                  <FiBookOpen size={16} />
                </span>
                <span>Synchronized cross-device library &amp; video walkthroughs</span>
              </li>
              <li className={styles.perkItem}>
                <span className={styles.perkIcon}>
                  <FiShield size={16} />
                </span>
                <span>Reviewed &amp; aligned with university syllabus curriculum</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ==================================================================
            RIGHT COLUMN: FOCUSED AUTH FORM CARD
            ================================================================== */}
        <div className={styles.formColumn}>
          <div className={styles.authCard}>

            {/* Mobile Brand Header */}
            <div className={styles.mobileBrandHeader}>
              <div className={styles.brandMark}>
                <div className={styles.brandBar} />
              </div>
            </div>

            {/* Title Area */}
            <div className={styles.titleArea}>
              <h2 className={styles.cardTitle}>
                {showRecoveryInfo
                  ? "Account Recovery"
                  : activeTab === "login"
                  ? "Sign in to Private Academy"
                  : "Create student account"}
              </h2>
              <p className={styles.cardSubtitle}>
                {showRecoveryInfo
                  ? "Recover access to your account manually"
                  : activeTab === "login"
                  ? "Enter your credentials to access your notes library"
                  : "Register to unlock and view your notes"}
              </p>
            </div>

            {/* Status & Error Alerts */}
            {error && (
              <div className={styles.errorAlert} role="alert">
                <FiAlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className={styles.successAlert} role="status">
                <FiCheckCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
                <span>{successMsg}</span>
              </div>
            )}
            {infoMsg && (
              <div className={styles.infoAlert} role="status">
                <FiInfo size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
                <span>{infoMsg}</span>
              </div>
            )}

            {/* Recovery Mode */}
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
                  <span>Back to Sign In</span>
                </button>

                <p className={styles.recoveryText}>
                  Please contact support with your purchase transaction details or registered email to restore your account access.
                </p>

                <div className={styles.proTipBox}>
                  <strong>💡 Pro-Tip:</strong> If your account email is a Gmail address, you can simply go back and choose <strong>Continue with Google</strong> using that same Gmail to access your account instantly without needing a password.
                </div>

                <a
                  href="https://wa.me/919423930547?text=Hello%20Private%20Academy%20Support,%20I%20need%20help%20recovering%20access%20to%20my%20account."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                >
                  <FaWhatsapp size={20} />
                  <span>Recover via WhatsApp</span>
                </a>

                <a
                  href="mailto:info@privateacademy.in?subject=Account%20Recovery%20Request&body=Hello%20Private%20Academy%20Support,%0A%0AI%20need%20help%20recovering%20access%20to%20my%20account.%20Here%20are%20my%20details:%0A-%20Email:%20%0A-%20Purchase%20Details/Transaction%20ID:%20"
                  className={styles.emailBtn}
                >
                  <FiMail size={18} />
                  <span>Email Support</span>
                </a>
              </div>
            ) : (
              <>
                {/* Tabs: Sign In / Create Account */}
                <div className={styles.tabsContainer} role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "login"}
                    className={`${styles.tabBtn} ${activeTab === "login" ? styles.tabBtnActive : ""}`}
                    onClick={() => {
                      setActiveTab("login");
                      setError(null);
                      setSuccessMsg(null);
                      setInfoMsg(null);
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "signup"}
                    className={`${styles.tabBtn} ${activeTab === "signup" ? styles.tabBtnActive : ""}`}
                    onClick={() => {
                      setActiveTab("signup");
                      setError(null);
                      setSuccessMsg(null);
                      setInfoMsg(null);
                    }}
                  >
                    Create Account
                  </button>
                </div>

                {/* Google OAuth Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className={styles.googleBtn}
                  disabled={loading}
                >
                  <FcGoogle size={18} />
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>or continue with email</span>
                  <div className={styles.dividerLine} />
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email Address
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputFieldIcon}>
                        <FiMail size={16} />
                      </span>
                      <input
                        type="email"
                        id="email"
                        className={styles.inputWithIcon}
                        placeholder="student@gmail.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>
                      Password
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputFieldIcon}>
                        <FiLock size={16} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className={styles.inputWithIcon}
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className={styles.togglePasswordBtn}
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>

                  {activeTab === "signup" && (
                    <>
                      <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                          Confirm Password
                        </label>
                        <div className={styles.inputWrapper}>
                          <span className={styles.inputFieldIcon}>
                            <FiLock size={16} />
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            className={styles.inputWithIcon}
                            placeholder="••••••••"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className={styles.togglePasswordBtn}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className={styles.legalGroup}>
                        <label className={styles.legalLabel}>
                          <input
                            type="checkbox"
                            id="acceptedLegal"
                            className={styles.legalCheckbox}
                            checked={acceptedLegal}
                            onChange={(e) => setAcceptedLegal(e.target.checked)}
                            disabled={loading}
                          />
                          <span className={styles.legalText}>
                            I agree to the{" "}
                            <Link href="/terms-and-condition" target="_blank" className={styles.legalLink}>
                              Terms &amp; Conditions
                            </Link>
                            ,{" "}
                            <Link href="/privacy-policy" target="_blank" className={styles.legalLink}>
                              Privacy Policy
                            </Link>
                            ,{" "}
                            <Link href="/refund-policy" target="_blank" className={styles.legalLink}>
                              Refund Policy
                            </Link>
                            ,{" "}
                            <Link href="/shipping-policy" target="_blank" className={styles.legalLink}>
                              Shipping Policy
                            </Link>
                            , and{" "}
                            <Link href="/disclaimer" target="_blank" className={styles.legalLink}>
                              Disclaimer
                            </Link>
                            .
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className={styles.spinner} />
                    ) : activeTab === "login" ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Forgot Password / Recovery */}
                {activeTab === "login" && (
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
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginClient() {
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
            color: "var(--slate-600, #4A5468)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                border: "3px solid #CDD4E2",
                borderTopColor: "var(--blue-500, #2447F5)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 1rem auto",
              }}
            />
            <h3 style={{ fontSize: "15px", fontFamily: "var(--font-inter), sans-serif" }}>Loading...</h3>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
