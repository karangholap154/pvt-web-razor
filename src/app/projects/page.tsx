"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "../articles/articles.module.css"; // Reuse card grid structure
import cardStyles from "../page.module.css"; // Reuse card effects
import { supabase } from "../../utils/supabaseClient";

interface Project {
  id: string;
  title: string;
  branch: "Computer" | "IT" | "AIML" | "Mechanical" | "Chemical";
  techStack: string[];
  description: string;
  githubUrl: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>("All");

  const branches = ["All", "Computer", "IT", "AIML", "Mechanical", "Chemical"];

  // Fetch projects from Supabase
  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("title", { ascending: true });

        if (error || !data) {
          console.warn("Failed to fetch projects from Supabase.", error);
          setProjects([]);
        } else {
          setProjects(
            data.map((item) => ({
              id: item.id,
              title: item.title,
              branch: item.branch as any,
              techStack: item.tech_stack || [],
              description: item.description || "",
              githubUrl: item.github_url || ""
            }))
          );
        }
      } catch (err) {
        console.error("General error loading projects from Supabase.", err);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedBranch === "All") return projects;
    return projects.filter((proj) => proj.branch === selectedBranch);
  }, [projects, selectedBranch]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header} id="projects-header">
        <h1 className={styles.title} id="projects-title">Engineering Projects Showcase</h1>
        <p className={styles.description} id="projects-desc">
          Browse capstone and final year projects created by students across departments. Check stacks, systems, and open code.
        </p>
      </header>

      {/* Branch selector tabs */}
      <nav className={styles.categoryRow} id="projects-filter-row" aria-label="Project Branches">
        {branches.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBranch(b)}
            className={`${styles.categoryBtn} ${selectedBranch === b ? styles.categoryBtnActive : ""}`}
            id={`btn-proj-branch-${b.toLowerCase()}`}
          >
            {b}
          </button>
        ))}
      </nav>

      {/* Grid */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
          <div style={{ width: "30px", height: "30px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem auto" }}></div>
          <h3>Loading projects showcase...</h3>
        </div>
      ) : (
        <main className={styles.grid} id="projects-grid">
          {filteredProjects.map((proj) => (
            <article className={styles.card} key={proj.id} id={proj.id}>
              <div className={styles.cardHeader}>
                <span className={styles.categoryTag}>{proj.branch} Engineering</span>
              </div>
              
              <h2 className={styles.cardTitle}>{proj.title}</h2>
              <p className={styles.summary}>{proj.description}</p>
              
              {/* Tech stack badges */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.5rem 0 1rem 0" }}>
                {proj.techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: "0.725rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px"
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={proj.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnRead}
                id={`btn-github-${proj.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Directing to mock GitHub repository for: ${proj.title}`);
                }}
              >
                View Code Repository
              </a>
            </article>
          ))}
        </main>
      )}

      <footer style={{ borderTop: "1px solid var(--border)", paddingTop: "2.5rem", textAlign: "center", marginTop: "3rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Have a project to showcase?</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Submit your repository link, report, and CAD drawings. Help next semester students learn from your architecture.
        </p>
        <Link
          href="/contact?subject=project-submission"
          className={cardStyles.btnPrimary}
          id="btn-submit-project"
        >
          Submit Your Project
        </Link>
      </footer>
    </div>
  );
}
