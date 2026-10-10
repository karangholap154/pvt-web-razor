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
            <th>User Profile</th>
            <th>Username</th>
            <th>Email Address</th>
            <th>Role</th>
            <th>Status</th>
            <th>University</th>
            <th>Academic Focus</th>
            <th>Joined Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name || "User Avatar"}
                        width={32}
                        height={32}
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
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "var(--accent-light)",
                          color: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          border: "1px solid rgba(251, 191, 36, 0.2)",
                        }}
                      >
                        {(user.full_name || user.username || user.email || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span style={{ fontWeight: 600 }}>{user.full_name || "—"}</span>
                  </div>
                </td>
                <td style={{ color: "var(--accent)", fontWeight: 600 }}>
                  {user.username ? `@${user.username}` : "—"}
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role || "user"}
                    onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                    disabled={updatingUserRoleId === user.id}
                    style={{
                      backgroundColor:
                        (user.role || "user") === "admin"
                          ? "rgba(239, 68, 68, 0.15)"
                          : (user.role || "user") === "contributor"
                          ? "rgba(251, 191, 36, 0.15)"
                          : "rgba(56, 189, 248, 0.15)",
                      color:
                        (user.role || "user") === "admin"
                          ? "#f87171"
                          : (user.role || "user") === "contributor"
                          ? "#fde047"
                          : "#38bdf8",
                      border:
                        (user.role || "user") === "admin"
                          ? "1px solid rgba(239, 68, 68, 0.3)"
                          : (user.role || "user") === "contributor"
                          ? "1px solid rgba(251, 191, 36, 0.3)"
                          : "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: "6px",
                      padding: "0.25rem 0.55rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="user" style={{ background: "#18181b", color: "#fff" }}>User</option>
                    <option value="contributor" style={{ background: "#18181b", color: "#fff" }}>Contributor</option>
                    <option value="admin" style={{ background: "#18181b", color: "#fff" }}>Admin</option>
                  </select>
                </td>
                <td>
                  <select
                    value={user.status || "active"}
                    onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                    disabled={updatingUserStatusId === user.id}
                    style={{
                      backgroundColor:
                        (user.status || "active") === "banned"
                          ? "rgba(239, 68, 68, 0.15)"
                          : (user.status || "active") === "suspended"
                          ? "rgba(251, 191, 36, 0.15)"
                          : "rgba(34, 197, 94, 0.15)",
                      color:
                        (user.status || "active") === "banned"
                          ? "#f87171"
                          : (user.status || "active") === "suspended"
                          ? "#fde047"
                          : "#4ade80",
                      border:
                        (user.status || "active") === "banned"
                          ? "1px solid rgba(239, 68, 68, 0.3)"
                          : (user.status || "active") === "suspended"
                          ? "1px solid rgba(251, 191, 36, 0.3)"
                          : "1px solid rgba(34, 197, 94, 0.3)",
                      borderRadius: "6px",
                      padding: "0.25rem 0.55rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="active" style={{ background: "#18181b", color: "#4ade80" }}>Active</option>
                    <option value="suspended" style={{ background: "#18181b", color: "#fde047" }}>Suspended</option>
                    <option value="banned" style={{ background: "#18181b", color: "#f87171" }}>Banned</option>
                  </select>
                </td>
                <td>
                  <span
                    className={styles.badge}
                    style={{
                      backgroundColor: "rgba(251, 191, 36, 0.12)",
                      color: "#fde047",
                      border: "1px solid rgba(251, 191, 36, 0.25)",
                      fontSize: "0.72rem",
                    }}
                  >
                    {user.university || "—"}
                  </span>
                </td>
                <td>
                  {user.default_branch || user.default_semester ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {user.default_branch && (
                        <span
                          className={styles.badge}
                          style={{
                            backgroundColor: "rgba(56, 189, 248, 0.12)",
                            color: "#38bdf8",
                            border: "1px solid rgba(56, 189, 248, 0.2)",
                            fontSize: "0.7rem",
                            display: "inline-block",
                            width: "fit-content",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.default_branch}
                        </span>
                      )}
                      {user.default_semester && (
                        <span
                          className={styles.badge}
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                            fontSize: "0.7rem",
                            display: "inline-block",
                            width: "fit-content",
                          }}
                        >
                          Semester {user.default_semester}
                        </span>
                      )}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td>
                  <div className={styles.actionsCell} style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className={`${styles.btnAction} ${styles.btnEdit}`}
                      onClick={() => {
                        setResetPasswordUser({ id: user.id, email: user.email });
                        setNewPassword("");
                        setConfirmNewPassword("");
                        setResetError(null);
                      }}
                      title="Change Password"
                      style={{
                        backgroundColor: "rgba(251, 191, 36, 0.15)",
                        color: "var(--accent)",
                        border: "1px solid rgba(251, 191, 36, 0.2)",
                      }}
                    >
                      Password
                    </button>
                    <button
                      className={`${styles.btnAction} ${styles.btnDelete}`}
                      onClick={() => setDeleteUserModal({ id: user.id, email: user.email, name: user.full_name || user.username || undefined })}
                      title="Delete User Account"
                      style={{
                        backgroundColor: "rgba(239, 68, 68, 0.15)",
                        color: "#f87171",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                No matching users found.
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
              <h3>Reset User Password</h3>
              <button className={styles.btnClose} onClick={() => {
                setResetPasswordUser(null);
                setNewPassword("");
                setConfirmNewPassword("");
                setResetError(null);
              }}>✕</button>
            </div>

            <form onSubmit={handlePasswordResetSubmit}>
              <div className={styles.modalBody}>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  Set a new password for account <strong style={{ color: "var(--text-primary)" }}>{resetPasswordUser.email}</strong>:
                </p>

                {resetError && <div className={styles.errorAlert} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem" }}>{resetError}</div>}

                <div className={styles.inputGroup} style={{ marginBottom: "1rem" }}>
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
              <h3 style={{ color: "#f87171" }}>Delete User Account</h3>
              <button className={styles.btnClose} onClick={() => setDeleteUserModal(null)}>✕</button>
            </div>

            <form onSubmit={handleDeleteUserSubmit}>
              <div className={styles.modalBody} style={{ gap: "1rem" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  Are you sure you want to permanently delete user account <strong style={{ color: "#fff" }}>{deleteUserModal.email}</strong>?
                </p>
                <p style={{ color: "#f87171", fontSize: "0.82rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", padding: "0.75rem", borderRadius: "8px" }}>
                  ⚠️ This action cannot be undone. It will remove the user from Supabase Auth and database records.
                </p>
              </div>

              <div className={styles.modalFooter} style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
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
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.6rem 1.25rem",
                    fontWeight: 600,
                    fontSize: "0.875rem",
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
