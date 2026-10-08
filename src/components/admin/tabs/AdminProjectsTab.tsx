"use client";

import styles from "@/app/admin/admin.module.css";
import { Project } from "@/types/admin";

interface AdminProjectsTabProps {
  projects: Project[];
  openEditProject: (project: Project) => void;
  handleDeleteItem: (id: string) => void;
}

export default function AdminProjectsTab({
  projects,
  openEditProject,
  handleDeleteItem,
}: AdminProjectsTabProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Branch</th>
          <th>Tech Stack</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((proj) => (
          <tr key={proj.id}>
            <td style={{ fontWeight: 600 }}>{proj.title}</td>
            <td>
              <span className={`${styles.badge} ${styles.tagBranch}`}>{proj.branch}</span>
            </td>
            <td>
              <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                {proj.tech_stack ? (
                  proj.tech_stack.map((t, idx) => (
                    <span key={idx} className={styles.badge} style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", fontSize: "0.7rem" }}>
                      {t}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>None</span>
                )}
              </div>
            </td>
            <td>
              <div className={styles.actionsCell}>
                <button className={`${styles.btnAction} ${styles.btnEdit}`} onClick={() => openEditProject(proj)} title="Edit">
                  Edit
                </button>
                <button className={`${styles.btnAction} ${styles.btnDelete}`} onClick={() => handleDeleteItem(proj.id)} title="Delete">
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
