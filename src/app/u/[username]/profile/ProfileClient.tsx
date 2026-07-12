"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { BRANCHES, SEMESTERS } from "@/data/mockData";
import { useAuth } from "@/components/providers/AuthProvider";
import { 
  FaUser, 
  FaSliders, 
  FaClock, 
  FaGraduationCap, 
  FaEnvelope, 
  FaCalendarDays, 
  FaBook, 
  FaCircleCheck,
  FaCircleExclamation,
  FaFilePdf,
  FaKey,
  FaLaptop,
  FaMobileScreenButton,
  FaTabletScreenButton
} from "react-icons/fa6";
import { parseUserAgent } from "@/utils/userAgent";
import { supabase } from "@/utils/supabaseClient";

interface Purchase {
  id: string;
  amount: number;
  date: string;
  orderId: string;
  status: string;
  noteTitle: string;
}

interface Session {
  id: string;
  created_at: string;
  updated_at: string;
  user_agent: string;
  ip: string;
  browser?: string;
  os?: string;
  device?: string;
}

interface ProfileClientProps {
  initialFullName: string;
  initialUniversity: string;
  initialBranch: string;
  initialSemester: string;
  initialUsername: string;
  email: string;
  purchases: Purchase[];
  createdAt: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
}

type TabState = "account" | "preferences" | "purchases" | "sessions";

const formatIpAddress = (ip: string | undefined | null): string => {
  if (!ip) return "N/A";
  const trimmed = ip.trim();
  if (trimmed === "::1" || trimmed === "127.0.0.1" || trimmed.toLowerCase() === "localhost") {
    return "Localhost";
  }
  const firstIp = trimmed.split(",")[0].trim();
  if (firstIp.startsWith("::ffff:")) {
    return firstIp.substring(7);
  }
  return firstIp;
};

export default function ProfileClient({
  initialFullName,
  initialUniversity,
  initialBranch,
  initialSemester,
  initialUsername,
  email,
  purchases,
  createdAt,
  avatarUrl,
  isAdmin,
}: ProfileClientProps) {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<TabState>("account");

  const [fullName, setFullName] = useState(initialFullName);
  const [university] = useState(initialUniversity);
  const [branch, setBranch] = useState(initialBranch);
  const [semester, setSemester] = useState(initialSemester);
  const [username, setUsername] = useState(initialUsername);

  type UsernameCheckState = "idle" | "checking" | "available" | "taken" | "invalid" | "unchanged";
  const [usernameCheckState, setUsernameCheckState] = useState<UsernameCheckState>(initialUsername ? "unchanged" : "idle");
  const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Dot allowed in middle only — not first/last char, no consecutive dots
  const USERNAME_REGEX = /^(?!.*\.\.)[a-z0-9_][a-z0-9_.]{1,13}[a-z0-9_]$/;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Username availability check
  useEffect(() => {
    if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);
    const normalized = username.trim().toLowerCase();
    if (!normalized || normalized === initialUsername) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsernameCheckState(normalized === initialUsername ? "unchanged" : "idle");
      return;
    }
    if (!USERNAME_REGEX.test(normalized)) {
      setUsernameCheckState("invalid");
      return;
    }
    setUsernameCheckState("checking");
    usernameDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profile/check-username?username=${encodeURIComponent(normalized)}`);
        const data = await res.json();
        setUsernameCheckState(data.available ? "available" : "taken");
      } catch {
        setUsernameCheckState("idle");
      }
    }, 500);
    return () => { if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const getCurrentSessionId = async (): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        const parts = session.access_token.split(".");
        if (parts.length === 3) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const pad = (4 - (base64.length % 4)) % 4;
          const padded = base64 + "=".repeat(pad);
          const payload = JSON.parse(atob(padded));
          return payload.session_id || payload.sid || null;
        }
      }
    } catch (err) {
      console.error("Error getting client session ID:", err);
    }
    return null;
  };

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const clientSessionId = await getCurrentSessionId();
      const res = await fetch("/api/auth/sessions", {
        headers: clientSessionId ? { "x-current-session-id": clientSessionId } : {},
      });
      if (!res.ok) {
        throw new Error("Failed to load sessions");
      }
      const data = await res.json();
      const parsedSessions = (data.sessions || []).map((s: Session) => {
        const parsed = parseUserAgent(s.user_agent);
        return {
          ...s,
          browser: parsed.browser,
          os: parsed.os,
          device: parsed.device,
        };
      });
      setSessions(parsedSessions);
      setCurrentSessionId(data.currentSessionId || clientSessionId);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load active sessions.";
      setSessionsError(errMsg);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "sessions") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSessions();
    }
  }, [activeTab, fetchSessions]);

  const handleRevokeSession = async (sessionId: string) => {
    const isCurrent = sessionId === currentSessionId;
    if (isCurrent && !confirm("Are you sure you want to log out of your current device?")) {
      return;
    }

    try {
      const clientSessionId = await getCurrentSessionId();
      const headers: Record<string, string> = {};
      if (clientSessionId) {
        headers["x-current-session-id"] = clientSessionId;
      }

      const res = await fetch(`/api/auth/sessions?id=${sessionId}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to revoke session");
      }

      if (isCurrent) {
        router.push("/login");
      } else {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setMessage({ type: "success", text: "Device logged out successfully." });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to revoke session.";
      setMessage({ type: "error", text: errMsg });
    }
  };

  const handleRevokeOthers = async () => {
    if (!confirm("Are you sure you want to log out from all other devices?")) {
      return;
    }

    try {
      const clientSessionId = await getCurrentSessionId();
      const headers: Record<string, string> = {};
      if (clientSessionId) {
        headers["x-current-session-id"] = clientSessionId;
      }

      const res = await fetch("/api/auth/sessions?others=true", {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to log out other devices");
      }

      setSessions((prev) => prev.filter((s) => s.id === currentSessionId));
      setMessage({ type: "success", text: "Logged out from all other devices." });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to revoke other sessions.";
      setMessage({ type: "error", text: errMsg });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Block save if username is taken or invalid
    if (usernameCheckState === "taken") {
      setMessage({ type: "error", text: "Username is already taken. Please choose a different one." });
      setLoading(false);
      return;
    }
    if (usernameCheckState === "invalid") {
      setMessage({ type: "error", text: "Username format is invalid. Use 3–15 lowercase letters, numbers, or underscores." });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          full_name: fullName, 
          university,
          default_branch: branch,
          default_semester: semester,
          username: username.trim().toLowerCase() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      await refreshAuth();
      setMessage({ type: "success", text: "Settings saved successfully!" });
      router.refresh();
      
      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An error occurred while saving.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownloadInvoice = (purchaseId: string) => {
    window.open(`/api/purchases/${purchaseId}/invoice`, "_blank");
  };

  const getInitials = (name: string, emailStr: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    return emailStr.substring(0, 2).toUpperCase();
  };

  return (
    <div className={styles.container}>
      {/* Modern Profile Card Banner */}
      <div className={styles.profileBanner}>
        <div className={styles.profileBannerOverlay} />
        <div className={styles.profileBannerContent}>
          <div className={styles.avatarWrapper}>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={fullName || "User Avatar"} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarInitials}>
                {getInitials(fullName, email)}
              </div>
            )}
          </div>
          
          <div className={styles.userMainInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.userName}>{fullName || "Student"}</h1>
              {isAdmin ? (
                <span className={styles.roleBadgeAdmin}>Administrator</span>
              ) : (
                <span className={styles.roleBadgeStudent}>Student</span>
              )}
            </div>
            {username && (
              <p style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 0.15rem" }}>
                @{username}
              </p>
            )}
            <p className={styles.userEmailText}>
              <FaEnvelope className={styles.infoIcon} /> {email}
            </p>
            <p className={styles.userUnivText}>
              <FaGraduationCap className={styles.infoIcon} /> {university || "No University Set"}
            </p>
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Member Since</span>
              <span className={styles.statValue}>
                <FaCalendarDays className={styles.statIcon} />
                {createdAt ? new Date(createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "N/A"}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Unlocked Notes</span>
              <span className={styles.statValue}>
                <FaBook className={styles.statIcon} />
                {purchases.length} {purchases.length === 1 ? "File" : "Files"}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Preferences</span>
              <span className={`${styles.statValue} ${branch && semester ? styles.statusConfigured : styles.statusPending}`}>
                <FaSliders className={styles.statIcon} />
                {branch && semester ? "Configured" : "Incomplete"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Horizontal Navigation Tabs */}
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "account" ? styles.tabBtnActive : ""}`}
            onClick={() => { setActiveTab("account"); setMessage(null); }}
          >
            <FaUser className={styles.tabIcon} />
            <span>Account Details</span>
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "preferences" ? styles.tabBtnActive : ""}`}
            onClick={() => { setActiveTab("preferences"); setMessage(null); }}
          >
            <FaSliders className={styles.tabIcon} />
            <span>Study Preferences</span>
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "purchases" ? styles.tabBtnActive : ""}`}
            onClick={() => { setActiveTab("purchases"); setMessage(null); }}
          >
            <FaClock className={styles.tabIcon} />
            <span>Purchase History</span>
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "sessions" ? styles.tabBtnActive : ""}`}
            onClick={() => { setActiveTab("sessions"); setMessage(null); }}
          >
            <FaKey className={styles.tabIcon} />
            <span>Active Sessions</span>
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          <div className={styles.card}>
            
            {activeTab === "account" && (
              <form onSubmit={handleSubmit} className={styles.formElement}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Personal Information</h2>
                  <p className={styles.cardSub}>Update your display name or review registered institution details.</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className={`${styles.input} ${styles.inputReadonly}`}
                      value={email}
                      readOnly
                      disabled
                    />
                    <span className={styles.inputHelp}>Your email address is managed securely via credentials and cannot be edited.</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      className={styles.input}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      required
                    />
                    <span className={styles.inputHelp}>Enter your first and last name. This is displayed on certificates and dashboards.</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="username">Username</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <span style={{ position: "absolute", left: "0.85rem", fontWeight: 700, color: "var(--accent)", fontSize: "1rem", pointerEvents: "none" }}>@</span>
                      <input
                        type="text"
                        id="username"
                        className={`${styles.input} ${usernameCheckState === "available" ? styles.inputSuccess : usernameCheckState === "taken" || usernameCheckState === "invalid" ? styles.inputDanger : ""}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))}
                        placeholder="your_handle"
                        maxLength={15}
                        autoComplete="off"
                        spellCheck={false}
                        style={{ paddingLeft: "2.1rem" }}
                      />
                      {usernameCheckState === "checking" && (
                        <span style={{ position: "absolute", right: "0.8rem", width: "14px", height: "14px", border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      )}
                      {usernameCheckState === "available" && <span style={{ position: "absolute", right: "0.85rem", color: "#22c55e", fontWeight: 700 }}>✓</span>}
                      {(usernameCheckState === "taken" || usernameCheckState === "invalid") && <span style={{ position: "absolute", right: "0.85rem", color: "#ef4444", fontWeight: 700 }}>✗</span>}
                    </div>
                    {usernameCheckState === "available" && <span style={{ fontSize: "0.78rem", color: "#22c55e", fontWeight: 600 }}>@{username} is available!</span>}
                    {usernameCheckState === "taken" && <span style={{ fontSize: "0.78rem", color: "#ef4444", fontWeight: 600 }}>Username already taken.</span>}
                    {usernameCheckState === "invalid" && <span style={{ fontSize: "0.78rem", color: "#ef4444", fontWeight: 600 }}>3–15 chars: start/end with letter/number/_, dots allowed in middle only.</span>}
                    <span className={styles.inputHelp}>Your unique public handle (e.g. @{email.split("@")[0]}). Visible to others on contributions and reviews.</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="university">University / College</label>
                    <input
                      type="text"
                      id="university"
                      className={`${styles.input} ${styles.inputReadonly}`}
                      value={university}
                      readOnly
                      disabled
                      placeholder="e.g. Stanford University"
                    />
                    <span className={styles.inputHelp}>Your university affiliation is locked and set during checkout/registration.</span>
                  </div>
                </div>

                <button type="submit" className={styles.btnSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : "Save Changes"}
                </button>
              </form>
            )}

            {activeTab === "preferences" && (
              <form onSubmit={handleSubmit} className={styles.formElement}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Study Preferences</h2>
                  <p className={styles.cardSub}>Set default parameters to personalize your library dashboard content catalog.</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="branch">Default Branch</label>
                    <select
                      id="branch"
                      className={styles.select}
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    >
                      <option value="">Select your branch</option>
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <span className={styles.inputHelp}>Your course materials will automatically filter to this stream when you log in.</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="semester">Default Semester</label>
                    <select
                      id="semester"
                      className={styles.select}
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                    >
                      <option value="">Select your semester</option>
                      {SEMESTERS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span className={styles.inputHelp}>Filter syllabus sheets and lectures according to this term duration.</span>
                  </div>
                </div>

                <button type="submit" className={styles.btnSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : "Save Preferences"}
                </button>
              </form>
            )}

            {activeTab === "purchases" && (
              <div>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Purchase History & Invoices</h2>
                  <p className={styles.cardSub}>View billing invoices, transaction order logs, and access permissions.</p>
                </div>
                
                {purchases.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIconContainer}>
                      <FaBook className={styles.emptyIcon} />
                    </div>
                    <p className={styles.emptyStateTitle}>No purchase history found</p>
                    <p className={styles.emptyStateDesc}>You haven&apos;t made any paid note purchases. Premium notes will unlock and list invoices here.</p>
                  </div>
                ) : (
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Note</th>
                          <th>Order ID</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map((p) => (
                          <tr key={p.id} className={styles.tableRow}>
                            <td className={styles.tableDate}>{formatDate(p.date)}</td>
                            <td className={styles.tableTitle}>{p.noteTitle}</td>
                            <td className={styles.tableOrderId}>{p.orderId}</td>
                            <td className={styles.tableAmount}>₹{p.amount}</td>
                            <td>
                              <span className={`${styles.badge} ${p.status === "success" ? styles.badgeSuccess : styles.badgeFailed}`}>
                                {p.status === "success" ? "Paid" : p.status}
                              </span>
                            </td>
                            <td>
                              {p.status === "success" ? (
                                <button
                                  type="button"
                                  onClick={() => handleDownloadInvoice(p.id)}
                                  className={styles.btnDownload}
                                  title="Download Invoice PDF"
                                >
                                  <FaFilePdf className={styles.downloadIcon} />
                                  <span>PDF</span>
                                </button>
                              ) : (
                                <span className={styles.textMuted}>—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "sessions" && (
              <div>
                <div className={styles.sessionHeaderContainer}>
                  <div className={styles.cardHeader} style={{ marginBottom: 0, borderBottom: "none", paddingBottom: 0 }}>
                    <h2 className={styles.cardTitle}>Active Sessions</h2>
                    <p className={styles.cardSub}>Review and manage devices where you are currently signed in.</p>
                  </div>
                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={handleRevokeOthers}
                      className={styles.btnRevokeAll}
                    >
                      Log Out Other Devices
                    </button>
                  )}
                </div>
                
                {sessionsLoading ? (
                  <div className={styles.sessionLoadingContainer}>
                    <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading active sessions...</span>
                  </div>
                ) : sessionsError ? (
                  <div className={styles.sessionErrorContainer}>
                    <p>{sessionsError}</p>
                    <button type="button" onClick={fetchSessions} className={styles.btnRetry}>
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className={styles.sessionList}>
                    {sessions.map((s) => {
                      const isCurrent = s.id === currentSessionId;
                      return (
                        <div key={s.id} className={styles.sessionItem}>
                          <div className={styles.sessionDetails}>
                            <div className={styles.deviceIconContainer}>
                              {s.device === "Mobile" ? (
                                <FaMobileScreenButton className={styles.deviceIcon} />
                              ) : s.device === "Tablet" ? (
                                <FaTabletScreenButton className={styles.deviceIcon} />
                              ) : (
                                <FaLaptop className={styles.deviceIcon} />
                              )}
                            </div>
                            <div className={styles.deviceText}>
                              <div className={styles.deviceTitleRow}>
                                <span className={styles.deviceTitle}>
                                  {s.os || "Unknown OS"} • {s.browser || "Unknown Browser"}
                                </span>
                                {isCurrent && (
                                  <span className={styles.badgeCurrent}>This Device</span>
                                )}
                              </div>
                              <div className={styles.deviceMeta}>
                                <span>IP: {formatIpAddress(s.ip)}</span>
                                <span className={styles.metaDivider}>•</span>
                                <span>Started: {new Date(s.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}</span>
                              </div>
                            </div>
                          </div>
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleRevokeSession(s.id)}
                              className={styles.btnRevoke}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {message && (
              <div
                className={`${styles.message} ${
                  message.type === "success" ? styles.success : styles.error
                }`}
              >
                {message.type === "success" ? (
                  <FaCircleCheck className={styles.msgIcon} />
                ) : (
                  <FaCircleExclamation className={styles.msgIcon} />
                )}
                <span>{message.text}</span>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
