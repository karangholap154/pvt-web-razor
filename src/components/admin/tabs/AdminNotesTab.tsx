"use client";

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
          <th>Title & Classification</th>
          <th>Related Subject / Course</th>
          <th>University</th>
          <th>Branch & Sem</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {notes.map((note) => (
          <tr key={note.id}>
            <td style={{ fontWeight: 600 }}>
              <div>{note.title}</div>
              <div style={{ marginTop: "0.25rem" }}>
                <span
                  className={styles.badge}
                  style={{
                    fontSize: "0.68rem",
                    backgroundColor:
                      note.resource_type === "official_subject" || !note.is_community_contributed
                        ? "rgba(34, 197, 94, 0.12)"
                        : "rgba(245, 158, 11, 0.12)",
                    color:
                      note.resource_type === "official_subject" || !note.is_community_contributed
                        ? "#22c55e"
                        : "#f59e0b",
                    border:
                      note.resource_type === "official_subject" || !note.is_community_contributed
                        ? "1px solid rgba(34, 197, 94, 0.25)"
                        : "1px solid rgba(245, 158, 11, 0.25)",
                  }}
                >
                  {note.resource_type === "official_subject" || !note.is_community_contributed
                    ? "Official Subject Note"
                    : "Supplementary Guide"}
                </span>
              </div>
            </td>
            <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {note.subject || note.title}
            </td>
            <td>
              <span className={styles.badge} style={{ backgroundColor: "rgba(251,191,36,0.12)", color: "#fde047", border: "1px solid rgba(251,191,36,0.25)", fontSize: "0.72rem" }}>
                {note.university ? note.university.replace("University", "Univ.").replace("Savitribai Phule Pune", "SPPU").replace("Dr. Babasaheb Ambedkar Technological", "DBATU").replace("Shivaji", "SUK") : "—"}
              </span>
            </td>
            <td>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                <span className={`${styles.badge} ${styles.tagBranch}`}>{note.branch}</span>
                <span className={`${styles.badge} ${styles.tagSemester}`}>Sem {note.semester}</span>
              </div>
            </td>
            <td>
              {note.price && note.price > 0 ? (
                <span className={`${styles.badge} ${styles.tagPrice}`}>₹{note.price}</span>
              ) : (
                <span className={styles.badge} style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>Free</span>
              )}
            </td>
            <td>
              <div className={styles.actionsCell}>
                <button className={`${styles.btnAction} ${styles.btnEdit}`} onClick={() => openEditNote(note)} title="Edit">
                  Edit
                </button>
                <button className={`${styles.btnAction} ${styles.btnDelete}`} onClick={() => handleDeleteItem(note.id)} title="Delete">
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
