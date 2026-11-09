"use client";

import Link from "next/link";
import styles from "@/app/admin/admin.module.css";
import { Article } from "@/data/mockData";

interface AdminArticlesTabProps {
  articles: Article[];
  openEditArticle: (article: Article) => void;
  handleDeleteItem: (id: string) => void;
}

export default function AdminArticlesTab({
  articles,
  openEditArticle,
  handleDeleteItem,
}: AdminArticlesTabProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Title</th>
          <th className={styles.th}>Category</th>
          <th className={styles.th}>Estimated Read</th>
          <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((art) => (
          <tr key={art.id} className={styles.tr}>
            <td className={styles.td} style={{ fontWeight: 600 }}>{art.title}</td>
            <td className={styles.td}>
              <span className={`${styles.badge} ${styles.tagBranch}`} style={{ fontSize: "0.68rem" }}>
                {art.category}
              </span>
            </td>
            <td className={styles.td}>
              <span className={styles.tagMono} style={{ fontSize: "0.72rem" }}>
                {art.readTime || "3 min read"}
              </span>
            </td>
            <td className={styles.td} style={{ textAlign: "right" }}>
              <div className={styles.actionsCell} style={{ justifyContent: "flex-end" }}>
                <Link
                  href={`/articles/${art.id}`}
                  target="_blank"
                  className={styles.btnAction}
                  title="View live article"
                  style={{ textDecoration: "none" }}
                >
                  View ↗
                </Link>
                <button
                  className={`${styles.btnAction} ${styles.btnEdit}`}
                  onClick={() => openEditArticle(art)}
                  title="Edit article"
                >
                  Edit
                </button>
                <button
                  className={`${styles.btnAction} ${styles.btnDelete}`}
                  onClick={() => handleDeleteItem(art.id)}
                  title="Delete article"
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
