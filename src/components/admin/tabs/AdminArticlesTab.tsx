"use client";

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
          <th>Title</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((art) => (
          <tr key={art.id}>
            <td style={{ fontWeight: 600 }}>{art.title}</td>
            <td>
              <span className={`${styles.badge} ${styles.tagBranch}`}>{art.category}</span>
            </td>
            <td>
              <div className={styles.actionsCell}>
                <button className={`${styles.btnAction} ${styles.btnEdit}`} onClick={() => openEditArticle(art)} title="Edit">
                  Edit
                </button>
                <button className={`${styles.btnAction} ${styles.btnDelete}`} onClick={() => handleDeleteItem(art.id)} title="Delete">
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
