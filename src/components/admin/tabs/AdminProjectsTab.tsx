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
          <th className={styles.th}>Title</th>
          <th className={styles.th}>Branch</th>
          <th className={styles.th}>Tech Stack</th>
          <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((proj) => (
          <tr key={proj.id} className={styles.tr}>
            <td className={styles.td} style={{ fontWeight: 600 }}>{proj.title}</td>
            <td className={styles.td}>
              <span className={`${styles.badge} ${styles.tagBranch}`} style={{ fontSize: "0.68rem" }}>
                {proj.branch}
              </span>
            </td>
            <td className={styles.td}>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                {proj.tech_stack && proj.tech_stack.length > 0 ? (
                  proj.tech_stack.map((t, idx) => (
                    <span key={idx} className={styles.tagMono} style={{ fontSize: "0.68rem" }}>
                      {t}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>—</span>
                )}
              </div>
            </td>
            <td className={styles.td} style={{ textAlign: "right" }}>
              <div className={styles.actionsCell} style={{ justifyContent: "flex-end" }}>
                {proj.github_url && (
                  <a
                    href={proj.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnAction}
                    title="View GitHub repository"
                    style={{ textDecoration: "none" }}
                  >
                    Code ↗
                  </a>
                )}
                <button
                  className={`${styles.btnAction} ${styles.btnEdit}`}
                  onClick={() => openEditProject(proj)}
                  title="Edit project"
                >
                  Edit
                </button>
                <button
                  className={`${styles.btnAction} ${styles.btnDelete}`}
                  onClick={() => handleDeleteItem(proj.id)}
                  title="Delete project"
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
