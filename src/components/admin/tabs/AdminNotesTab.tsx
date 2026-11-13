"use client";

import Link from "next/link";
import styles from "@/app/admin/admin.module.css";
import { Note } from "@/data/mockData";

interface AdminNotesTabProps {
  notes: Note[];
  openEditNote: (note: Note) => void;
  handleDeleteItem: (id: string) => void;
}

export default function AdminNotesTab({
  notes,
  openEditNote,
  handleDeleteItem,
}: AdminNotesTabProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Title & Classification</th>
          <th className={styles.th}>Related Subject / Course</th>
          <th className={styles.th}>University</th>
          <th className={styles.th}>Branch & Sem</th>
          <th className={styles.th}>Price</th>
          <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {notes.map((note) => (
          <tr key={note.id} className={styles.tr}>
            <td className={styles.td} style={{ maxWidth: "260px" }}>
              <div style={{ fontWeight: 600 }}>{note.title}</div>
              <div style={{ marginTop: "0.2rem" }}>
                <span
                  className={styles.badge}
                  style={{
                    fontSize: "0.68rem",
                    backgroundColor:
                      note.resource_type === "official_subject" || !note.is_community_contributed
                        ? "#ECFDF5"
                        : "var(--accent-light, #E6EBFF)",
                    color:
                      note.resource_type === "official_subject" || !note.is_community_contributed
                        ? "#059669"
                        : "var(--accent, #2447F5)",
                    border:
                      note.resource_type === "official_subject" || !note.is_community_contributed
                        ? "1px solid rgba(5, 150, 105, 0.25)"
                        : "1px solid rgba(36, 71, 245, 0.25)",
                  }}
                >
                  {note.resource_type === "official_subject" || !note.is_community_contributed
                    ? "Official Subject Note"
                    : "Supplementary Guide"}
                </span>
              </div>
            </td>
            <td className={styles.td} style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
              {note.subject || note.title}
            </td>
            <td className={styles.td}>
              <span className={styles.tagMono} style={{ fontSize: "0.72rem" }}>
                {note.university
                  ? note.university
                      .replace("University", "Univ.")
                      .replace("Savitribai Phule Pune", "SPPU")
                      .replace("Dr. Babasaheb Ambedkar Technological", "DBATU")
                      .replace("Shivaji", "SUK")
                  : "—"}
              </span>
            </td>
            <td className={styles.td}>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                <span className={`${styles.badge} ${styles.tagBranch}`} style={{ fontSize: "0.68rem" }}>
                  {note.branch}
                </span>
                <span className={`${styles.badge} ${styles.tagSemester}`} style={{ fontSize: "0.68rem" }}>
                  Sem {note.semester}
                </span>
              </div>
            </td>
            <td className={styles.td}>
              {note.price && note.price > 0 ? (
                <span className={`${styles.badge} ${styles.tagPricePaid}`}>₹{note.price}</span>
              ) : (
                <span className={`${styles.badge} ${styles.tagPrice}`}>Free</span>
              )}
            </td>
            <td className={styles.td} style={{ textAlign: "right" }}>
              <div className={styles.actionsCell} style={{ justifyContent: "flex-end" }}>
                <Link
                  href={`/notes/${note.id}`}
                  target="_blank"
                  className={styles.btnAction}
                  title="View live note page"
                  style={{ textDecoration: "none" }}
                >
                  View ↗
                </Link>
                <button
                  className={`${styles.btnAction} ${styles.btnEdit}`}
                  onClick={() => openEditNote(note)}
                  title="Edit note details"
                >
                  Edit
                </button>
                <button
                  className={`${styles.btnAction} ${styles.btnDelete}`}
                  onClick={() => handleDeleteItem(note.id)}
                  title="Delete note"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
