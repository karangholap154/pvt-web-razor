"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { BRANCHES, SEMESTERS } from "../../data/mockData";
import { useAuth } from "@/components/providers/AuthProvider";

interface Purchase {
  id: string;
  amount: number;
  date: string;
  orderId: string;
  status: string;
  noteTitle: string;
}

interface ProfileClientProps {
  initialFullName: string;
  initialUniversity: string;
  initialBranch: string;
  initialSemester: string;
  email: string;
  purchases: Purchase[];
}

type TabState = "account" | "preferences" | "purchases";

export default function ProfileClient({
  initialFullName,
  initialUniversity,
  initialBranch,
  initialSemester,
  email,
  purchases,
}: ProfileClientProps) {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<TabState>("account");

  const [fullName, setFullName] = useState(initialFullName);
  const [university] = useState(initialUniversity);
  const [branch, setBranch] = useState(initialBranch);
  const [semester, setSemester] = useState(initialSemester);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

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
          default_semester: semester
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      await refreshAuth();
      setMessage({ type: "success", text: "Settings saved successfully!" });
      router.refresh();
      
      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving." });
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

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <h1 className={styles.title}>Account & Settings</h1>
        <p className={styles.subtitle}>Manage your profile, preferences, and view your purchase history.</p>
      </div>

      <div className={styles.mainLayout}>
        {/* Sidebar Navigation */}
        <div className={styles.sidebar}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "account" ? styles.tabBtnActive : ""}`}
            onClick={() => { setActiveTab("account"); setMessage(null); }}
          >
            Account Details
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "preferences" ? styles.tabBtnActive : ""}`}
            onClick={() => { setActiveTab("preferences"); setMessage(null); }}
          >
            Study Preferences
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "purchases" ? styles.tabBtnActive : ""}`}
            onClick={() => { setActiveTab("purchases"); setMessage(null); }}
          >
            Purchase History
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          <div className={styles.card}>
            
            {activeTab === "account" && (
              <form onSubmit={handleSubmit}>
                <h2 className={styles.cardTitle}>Personal Information</h2>
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
                  />
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
                </div>

                <button type="submit" className={styles.btnSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <svg style={{ animation: "spin 1s linear infinite", marginRight: "8px", width: "16px", height: "16px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : "Save Changes"}
                </button>
              </form>
            )}

            {activeTab === "preferences" && (
              <form onSubmit={handleSubmit}>
                <h2 className={styles.cardTitle}>Study Preferences</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                  Set your default branch and semester so we can tailor the dashboard and library to your needs.
                </p>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="branch">Default Branch</label>
                  <select
                    id="branch"
                    className={styles.input}
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    style={{ appearance: "auto" }}
                  >
                    <option value="">Select your branch</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="semester">Default Semester</label>
                  <select
                    id="semester"
                    className={styles.input}
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    style={{ appearance: "auto" }}
                  >
                    <option value="">Select your semester</option>
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className={styles.btnSubmit} disabled={loading}>
                  {loading ? "Saving..." : "Save Preferences"}
                </button>
              </form>
            )}

            {activeTab === "purchases" && (
              <div>
                <h2 className={styles.cardTitle}>Purchase History & Invoices</h2>
                
                {purchases.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>You haven&apos;t made any purchases yet.</p>
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
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map((p) => (
                          <tr key={p.id}>
                            <td>{formatDate(p.date)}</td>
                            <td style={{ fontWeight: 500 }}>{p.noteTitle}</td>
                            <td style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                              {p.orderId}
                            </td>
                            <td>₹{p.amount}</td>
                            <td>
                              <span className={`${styles.badge} ${p.status === "success" ? styles.badgeSuccess : ""}`}>
                                {p.status === "success" ? "Paid" : p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                )}
                {message.text}
              </div>
            )}
            
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
