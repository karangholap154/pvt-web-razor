"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "@/app/admin/admin.module.css";
import { User } from "@/types/admin";
import { useToast } from "@/components/providers/ToastProvider";

interface AdminUsersTabProps {
  usersList: User[];
  setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
  userSearchQuery: string;
}

export default function AdminUsersTab({
  usersList,
  setUsersList,
  userSearchQuery,
}: AdminUsersTabProps) {
  const toast = useToast();

  const [updatingUserRoleId, setUpdatingUserRoleId] = useState<string | null>(null);
  const [updatingUserStatusId, setUpdatingUserStatusId] = useState<string | null>(null);

  // Modals state
  const [resetPasswordUser, setResetPasswordUser] = useState<{ id: string; email: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const [deleteUserModal, setDeleteUserModal] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);

  const handleUserRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserRoleId(userId);
    try {
      const res = await fetch("/api/admin/users/role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user role");

      toast.success(`User role updated to ${newRole}!`);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update user role";
      toast.error(msg);
    } finally {
      setUpdatingUserRoleId(null);
    }
  };

  const handleUserStatusChange = async (userId: string, newStatus: string) => {
    if (updatingUserStatusId) return;
    setUpdatingUserStatusId(userId);
    try {
      const res = await fetch("/api/admin/users/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user status");

      toast.success(`User status updated to ${newStatus}!`);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update user status";
      toast.error(msg);
    } finally {
      setUpdatingUserStatusId(null);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser) return;
    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    setResetLoading(true);
    setResetError(null);
    try {
      const res = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: resetPasswordUser.id,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      toast.success(`Password for ${resetPasswordUser.email} has been updated.`);
      setResetPasswordUser(null);
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error resetting password.";
      setResetError(msg);
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  };

  const handleDeleteUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteUserModal || deletingUser) return;
    setDeletingUser(true);
    try {
      const res = await fetch(`/api/admin/users/delete?userId=${deleteUserModal.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      toast.success(`User account ${deleteUserModal.email} deleted successfully!`);
      setUsersList((prev) => prev.filter((u) => u.id !== deleteUserModal.id));
      setDeleteUserModal(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete user account";
      toast.error(msg);
    } finally {
      setDeletingUser(false);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const query = userSearchQuery.toLowerCase();
    return (
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.username && u.username.toLowerCase().includes(query)) ||
      (u.full_name && u.full_name.toLowerCase().includes(query)) ||
      (u.university && u.university.toLowerCase().includes(query)) ||
      (u.role && u.role.toLowerCase().includes(query)) ||
      (u.status && u.status.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>User Profile</th>
            <th className={styles.th}>Username</th>
            <th className={styles.th}>Email Address</th>
            <th className={styles.th}>Role</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>University</th>
            <th className={styles.th}>Academic Focus</th>
            <th className={styles.th}>Joined Date</th>
            <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id} className={styles.tr}>
                <td className={styles.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name || "User Avatar"}
                        width={28}
                        height={28}
                        unoptimized
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1px solid var(--border)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(245, 158, 11, 0.12)",
                          color: "var(--accent, #f59e0b)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          border: "1px solid rgba(245, 158, 11, 0.25)",
                        }}
                      >
                        {(user.full_name || user.username || user.email || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span style={{ fontWeight: 600 }}>{user.full_name || "—"}</span>
                  </div>
                </td>
                <td className={styles.td} style={{ color: "var(--accent, #f59e0b)", fontWeight: 600 }}>
                  {user.username ? `@${user.username}` : "—"}
                </td>
                <td className={styles.td} style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                  {user.email}
                </td>
                <td className={styles.td}>
                  <select
                    value={user.role || "user"}
                    onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                    disabled={updatingUserRoleId === user.id}
                    className={styles.select}
                    style={{
                      padding: "0.2rem 1.6rem 0.2rem 0.45rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      width: "auto",
                      backgroundColor:
                        (user.role || "user") === "admin"
                          ? "rgba(239, 68, 68, 0.12)"
                          : (user.role || "user") === "contributor"
                          ? "rgba(245, 158, 11, 0.12)"
                          : "rgba(56, 189, 248, 0.12)",
                      color:
                        (user.role || "user") === "admin"
                          ? "#f87171"
                          : (user.role || "user") === "contributor"
                          ? "#f59e0b"
                          : "#38bdf8",
                      borderColor:
                        (user.role || "user") === "admin"
                          ? "rgba(239, 68, 68, 0.3)"
                          : (user.role || "user") === "contributor"
                          ? "rgba(245, 158, 11, 0.3)"
                          : "rgba(56, 189, 248, 0.3)",
                    }}
                  >
                    <option value="user">User</option>
                    <option value="contributor">Contributor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className={styles.td}>
                  <select
                    value={user.status || "active"}
                    onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                    disabled={updatingUserStatusId === user.id}
                    className={styles.select}
                    style={{
                      padding: "0.2rem 1.6rem 0.2rem 0.45rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      width: "auto",
                      backgroundColor:
                        (user.status || "active") === "banned"
                          ? "rgba(239, 68, 68, 0.12)"
                          : (user.status || "active") === "suspended"
                          ? "rgba(245, 158, 11, 0.12)"
                          : "rgba(34, 197, 94, 0.12)",
                      color:
                        (user.status || "active") === "banned"
                          ? "#f87171"
                          : (user.status || "active") === "suspended"
                          ? "#f59e0b"
                          : "#22c55e",
                      borderColor:
                        (user.status || "active") === "banned"
                          ? "rgba(239, 68, 68, 0.3)"
                          : (user.status || "active") === "suspended"
                          ? "rgba(245, 158, 11, 0.3)"
                          : "rgba(34, 197, 94, 0.3)",
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </td>
                <td className={styles.td}>
                  <span className={styles.tagMono} style={{ fontSize: "0.72rem" }}>
                    {user.university
                      ? user.university
                          .replace("University", "Univ.")
                          .replace("Savitribai Phule Pune", "SPPU")
                          .replace("Dr. Babasaheb Ambedkar Technological", "DBATU")
                      : "—"}
                  </span>
                </td>
                <td className={styles.td}>
                  {user.default_branch || user.default_semester ? (
                    <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                      {user.default_branch && (
                        <span className={`${styles.badge} ${styles.tagBranch}`} style={{ fontSize: "0.68rem" }}>
                          {user.default_branch}
                        </span>
                      )}
                      {user.default_semester && (
                        <span className={`${styles.badge} ${styles.tagSemester}`} style={{ fontSize: "0.68rem" }}>
                          Sem {user.default_semester}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>—</span>
                  )}
                </td>
                <td className={styles.td}>
                  <span className={styles.tagMono}>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        })
                      : "—"}
                  </span>
                </td>
                <td className={styles.td} style={{ textAlign: "right" }}>
                  <div className={styles.actionsCell} style={{ justifyContent: "flex-end" }}>
                    <button
                      className={`${styles.btnAction} ${styles.btnEdit}`}
                      onClick={() => {
                        setResetPasswordUser({ id: user.id, email: user.email });
                        setNewPassword("");
                        setConfirmNewPassword("");
                        setResetError(null);
                      }}
                      title="Reset User Password"
                    >
                      Password
                    </button>
                    <button
                      className={`${styles.btnAction} ${styles.btnDelete}`}
                      onClick={() =>
                        setDeleteUserModal({
                          id: user.id,
                          email: user.email,
                          name: user.full_name || user.username || undefined,
                        })
                      }
                      title="Delete User Account"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2.5rem" }}>
                No users found matching query.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PASSWORD RESET MODAL */}
      {resetPasswordUser && (
        <div className={styles.modalBackdrop} onClick={() => {
          setResetPasswordUser(null);
          setNewPassword("");
          setConfirmNewPassword("");
          setResetError(null);
        }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "450px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Reset User Password</h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => {
                  setResetPasswordUser(null);
                  setNewPassword("");
                  setConfirmNewPassword("");
                  setResetError(null);
                }}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordResetSubmit}>
              <div className={styles.modalBody}>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                  Set a new password for account <strong style={{ color: "var(--text-primary)" }}>{resetPasswordUser.email}</strong>:
                </p>

                {resetError && (
                  <div
                    style={{
                      background: "#FEF2F2",
                      border: "1px solid rgba(220, 38, 38, 0.3)",
                      color: "#DC2626",
                      padding: "0.75rem 1rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {resetError}
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label className={styles.label}>New Password</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={resetLoading}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Confirm New Password</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={resetLoading}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => {
                    setResetPasswordUser(null);
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setResetError(null);
                  }}
                  className={styles.btnCancel}
                  disabled={resetLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnSave}
                  disabled={resetLoading}
                >
                  {resetLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {deleteUserModal && (
        <div className={styles.modalBackdrop} onClick={() => setDeleteUserModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ color: "#DC2626" }}>Delete User Account</h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setDeleteUserModal(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDeleteUserSubmit}>
              <div className={styles.modalBody} style={{ gap: "1rem" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.5" }}>
                  Are you sure you want to permanently delete user account <strong style={{ color: "var(--text-primary)" }}>{deleteUserModal.email}</strong>?
                </p>
                <p
                  style={{
                    color: "#DC2626",
                    fontSize: "0.825rem",
                    background: "#FEF2F2",
                    border: "1px solid rgba(220, 38, 38, 0.25)",
                    padding: "0.75rem",
                    borderRadius: "6px",
                  }}
                >
                  ⚠️ This action cannot be undone. It will remove the user from Supabase Auth and all database records.
                </p>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setDeleteUserModal(null)}
                  className={styles.btnCancel}
                  disabled={deletingUser}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#DC2626",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.55rem 1.25rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: deletingUser ? "not-allowed" : "pointer",
                    opacity: deletingUser ? 0.7 : 1,
                  }}
                  disabled={deletingUser}
                >
                  {deletingUser ? "Deleting..." : "Permanently Delete Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
