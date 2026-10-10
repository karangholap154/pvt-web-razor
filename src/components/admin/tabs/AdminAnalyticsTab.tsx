"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import styles from "@/app/admin/admin.module.css";
import BranchSelect from "@/components/ui/BranchSelect";
import { Note } from "@/data/mockData";
import { Purchase, User } from "@/types/admin";

// Code-split SVG line chart so heavy path math & SVG DOM are loaded on-demand
const AdminRevenueChart = dynamic(() => import("./AdminRevenueChart"), {
  ssr: false,
  loading: () => (
    <div
      className={styles.chartCard}
      style={{
        gridColumn: "span 2",
        minHeight: "310px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
      }}
    >
      Loading revenue trend chart...
    </div>
  ),
});

interface AdminAnalyticsTabProps {
  initialPurchases: Purchase[];
  initialUsers: User[];
  notes: Note[];
}

export default function AdminAnalyticsTab({
  initialPurchases,
  initialUsers,
  notes,
}: AdminAnalyticsTabProps) {
  // Analytics filter states
  const [analyticsDateRange, setAnalyticsDateRange] = useState<"7days" | "30days" | "alltime">("30days");
  const [analyticsBranch, setAnalyticsBranch] = useState<string>("All branches");

  // Filtered successful purchases based on selected branch and timeframe
  const filteredPurchasesForAnalytics = useMemo(() => {
    let list = initialPurchases.filter((p) => p.status === "success");

    // 1. Filter by branch
    if (analyticsBranch !== "All branches") {
      list = list.filter((p) => {
        if (!p.note_id) return false;
        const matchingNote = notes.find((n) => n.id === p.note_id);
        return matchingNote?.branch === analyticsBranch;
      });
    }

    // 2. Filter by timeframe
    if (analyticsDateRange !== "alltime") {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const limitDays = analyticsDateRange === "7days" ? 7 : 30;

      list = list.filter((p) => {
        if (!p.created_at) return false;
        const purchaseDate = new Date(p.created_at);
        const purchaseDateStart = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth(), purchaseDate.getDate());
        const diffTime = todayStart.getTime() - purchaseDateStart.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < limitDays;
      });
    }

    return list;
  }, [initialPurchases, analyticsBranch, analyticsDateRange, notes]);

  // Filtered users based on selected timeframe
  const filteredUsersForAnalytics = useMemo(() => {
    if (analyticsDateRange === "alltime") {
      return initialUsers;
    }
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const limitDays = analyticsDateRange === "7days" ? 7 : 30;

    return initialUsers.filter((u) => {
      if (!u.created_at) return false;
      const regDate = new Date(u.created_at);
      const regDateStart = new Date(regDate.getFullYear(), regDate.getMonth(), regDate.getDate());
      const diffTime = todayStart.getTime() - regDateStart.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays < limitDays;
    });
  }, [initialUsers, analyticsDateRange]);

  // Compute metrics based on filtered purchases and users
  const metrics = useMemo(() => {
    const totalRev = filteredPurchasesForAnalytics.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const totalSales = filteredPurchasesForAnalytics.length;
    const totalUsers = filteredUsersForAnalytics.length;
    const avgOrderValue = totalSales > 0 ? totalRev / totalSales : 0;
    return { totalRev, totalSales, totalUsers, avgOrderValue };
  }, [filteredPurchasesForAnalytics, filteredUsersForAnalytics]);

  // Aggregate daily sales with dynamic timeframe length
  const dailySales = useMemo(() => {
    const data = [];
    const now = new Date();

    let daysToLoop = 30;
    if (analyticsDateRange === "7days") {
      daysToLoop = 7;
    } else if (analyticsDateRange === "30days") {
      daysToLoop = 30;
    } else if (analyticsDateRange === "alltime") {
      if (filteredPurchasesForAnalytics.length > 0) {
        const timestamps = filteredPurchasesForAnalytics.map((p) => new Date(p.created_at || "").getTime());
        const earliestTimestamp = Math.min(...timestamps);
        const earliestDate = new Date(earliestTimestamp);
        const diffTime = Math.abs(now.getTime() - earliestDate.getTime());
        daysToLoop = Math.max(7, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
      }
    }

    for (let i = daysToLoop - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const revenue = filteredPurchasesForAnalytics
        .filter((p) => {
          if (!p.created_at) return false;
          const pD = new Date(p.created_at);
          const pYear = pD.getFullYear();
          const pMonth = String(pD.getMonth() + 1).padStart(2, "0");
          const pDay = String(pD.getDate()).padStart(2, "0");
          const pDate = `${pYear}-${pMonth}-${pDay}`;
          return pDate === dateKey;
        })
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      data.push({ date: dateStr, key: dateKey, revenue });
    }
    return data;
  }, [filteredPurchasesForAnalytics, analyticsDateRange]);

  // Find max revenue for line chart scaling
  const maxRevenue = useMemo(() => {
    const maxVal = Math.max(...dailySales.map((d) => d.revenue));
    return maxVal > 0 ? maxVal : 100;
  }, [dailySales]);

  // Top Performing Notes
  const topNotes = useMemo(() => {
    const noteCounts: Record<string, { count: number; revenue: number }> = {};

    filteredPurchasesForAnalytics.forEach((p) => {
      if (!p.note_id) return;
      if (!noteCounts[p.note_id]) {
        noteCounts[p.note_id] = { count: 0, revenue: 0 };
      }
      noteCounts[p.note_id].count += 1;
      noteCounts[p.note_id].revenue += Number(p.amount) || 0;
    });

    return Object.entries(noteCounts)
      .map(([noteId, stats]) => {
        const matchingNote = notes.find((n) => n.id === noteId);
        return {
          id: noteId,
          title: matchingNote ? matchingNote.title : noteId,
          branch: matchingNote ? matchingNote.branch : "Unknown",
          ...stats,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredPurchasesForAnalytics, notes]);

  // Find max note revenue for note bar chart scaling
  const maxNoteRevenue = useMemo(() => {
    const maxVal = Math.max(...topNotes.map((n) => n.revenue));
    return maxVal > 0 ? maxVal : 100;
  }, [topNotes]);

  // University Registration Distribution
  const universityDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    filteredUsersForAnalytics.forEach((u) => {
      const univ = u.university || "General / Unknown";
      dist[univ] = (dist[univ] || 0) + 1;
    });

    const totalUsers = filteredUsersForAnalytics.length || 1;

    return Object.entries(dist)
      .map(([university, count]) => ({
        university,
        count,
        percentage: (count / totalUsers) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredUsersForAnalytics]);

  return (
    <div className={styles.analyticsContainer}>
      {/* Analytics Filters Control Bar */}
      <div className={styles.analyticsFilterBar}>
        <div className={styles.filterGroup}>
          <label htmlFor="analytics-date-range-select" className={styles.filterLabel}>Timeframe</label>
          <select
            id="analytics-date-range-select"
            value={analyticsDateRange}
            onChange={(e) => setAnalyticsDateRange(e.target.value as "7days" | "30days" | "alltime")}
            className={styles.select}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="alltime">All Time</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="analytics-branch-select" className={styles.filterLabel}>Branch Specialty</label>
          <BranchSelect
            id="analytics-branch-select"
            value={analyticsBranch}
            onChange={setAnalyticsBranch}
            includeAllOption={true}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Total Revenue</span>
            <span className={styles.metricIconWrapper} style={{ color: "var(--accent)", backgroundColor: "rgba(251, 191, 36, 0.1)" }}>
              ₹
            </span>
          </div>
          <div className={styles.metricValue}>₹{metrics.totalRev}</div>
          <div className={styles.metricSubtext}>Earnings from successful purchases</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Successful Sales</span>
            <span className={styles.metricIconWrapper} style={{ color: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.1)" }}>
              🛒
            </span>
          </div>
          <div className={styles.metricValue}>{metrics.totalSales}</div>
          <div className={styles.metricSubtext}>Completed orders volume</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>
              {analyticsDateRange === "alltime" ? "Enrolled Students" : "New Registrations"}
            </span>
            <span className={styles.metricIconWrapper} style={{ color: "#4ade80", backgroundColor: "rgba(74, 222, 128, 0.1)" }}>
              👥
            </span>
          </div>
          <div className={styles.metricValue}>{metrics.totalUsers}</div>
          <div className={styles.metricSubtext}>
            {analyticsDateRange === "alltime" ? "Registered user profiles" : `Signups in ${analyticsDateRange === "7days" ? "last 7 days" : "last 30 days"}`}
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Avg. Order Value</span>
            <span className={styles.metricIconWrapper} style={{ color: "#f472b6", backgroundColor: "rgba(244, 114, 182, 0.1)" }}>
              📈
            </span>
          </div>
          <div className={styles.metricValue}>₹{metrics.avgOrderValue.toFixed(2)}</div>
          <div className={styles.metricSubtext}>Average cart size per unlock</div>
        </div>
      </div>

      {/* Charts Area */}
      <div className={styles.chartsGrid}>
        {/* Code-split SVG Line Chart */}
        <AdminRevenueChart
          dailySales={dailySales}
          maxRevenue={maxRevenue}
          analyticsDateRange={analyticsDateRange}
        />

        {/* Top Performing Notes Card */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle} style={{ marginBottom: "1rem" }}>Top Performing Notes</h3>
          <div className={styles.barList}>
            {topNotes.length > 0 ? (
              topNotes.map((note) => {
                const widthPercent = maxNoteRevenue > 0 ? (note.revenue / maxNoteRevenue) * 100 : 0;
                return (
                  <div key={note.id} className={styles.barItem}>
                    <div className={styles.barItemLabels}>
                      <span className={styles.barItemTitle} title={note.title}>{note.title}</span>
                      <span className={styles.barItemValue}>₹{note.revenue}</span>
                    </div>
                    <div className={styles.barItemTrack}>
                      <div
                        className={styles.barItemFill}
                        style={{
                          width: `${widthPercent}%`,
                          background: "linear-gradient(90deg, var(--accent), #fb923c)"
                        }}
                      />
                    </div>
                    <div className={styles.barItemMeta}>
                      <span>{note.branch} Engineering</span>
                      <span>{note.count} {note.count === 1 ? "purchase" : "purchases"}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>No notes sales data found yet.</div>
            )}
          </div>
        </div>

        {/* University Registration Breakdown Card */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle} style={{ marginBottom: "1rem" }}>University Enrollment</h3>
          <div className={styles.barList}>
            {universityDistribution.length > 0 ? (
              universityDistribution.map((univ) => {
                return (
                  <div key={univ.university} className={styles.barItem}>
                    <div className={styles.barItemLabels}>
                      <span className={styles.barItemTitle} title={univ.university}>{univ.university}</span>
                      <span className={styles.barItemValue}>{univ.count} {univ.count === 1 ? "student" : "students"}</span>
                    </div>
                    <div className={styles.barItemTrack}>
                      <div
                        className={styles.barItemFill}
                        style={{
                          width: `${univ.percentage}%`,
                          background: "linear-gradient(90deg, #38bdf8, #60a5fa)"
                        }}
                      />
                    </div>
                    <div className={styles.barItemMeta}>
                      <span>{univ.percentage.toFixed(1)}% Share</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>No user registration data found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className={styles.transactionsSection}>
        <h3 className={styles.chartTitle} style={{ marginBottom: "1rem" }}>Recent Transactions Log</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Note Resource</th>
                <th>Razorpay Payment ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchasesForAnalytics.length > 0 ? (
                filteredPurchasesForAnalytics.map((purchase) => {
                  const matchingNote = notes.find((n) => n.id === purchase.note_id);
                  return (
                    <tr key={purchase.id}>
                      <td style={{ fontWeight: 600 }}>{purchase.email}</td>
                      <td>{matchingNote ? matchingNote.title : purchase.note_id || "Unknown note"}</td>
                      <td style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {purchase.razorpay_payment_id || "—"}
                      </td>
                      <td style={{ fontWeight: 700, color: purchase.status === "success" ? "#4ade80" : "inherit" }}>
                        ₹{purchase.amount}
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {purchase.created_at ? new Date(purchase.created_at).toLocaleString() : "—"}
                      </td>
                      <td>
                        <span
                          className={styles.badge}
                          style={{
                            backgroundColor: purchase.status === "success" ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                            color: purchase.status === "success" ? "#22c55e" : "#ef4444",
                            border: purchase.status === "success" ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)",
                          }}
                        >
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                    No transactions recorded in the logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
