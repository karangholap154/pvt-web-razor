"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../articles/articles.module.css"; // Reuse header and spacing
import cardStyles from "../page.module.css"; // Reuse buttons

function ContactFormInner() {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Prefill subject from URL query parameter
  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    if (subjectParam) {
      // If parameter is one of the option values or starts with "Application for" or "project"
      if (subjectParam.startsWith("Application for")) {
        setFormData((prev) => ({ ...prev, subject: "Careers Application", message: `Applying for: ${subjectParam.replace("Application for ", "")}\n\n[Please enter your cover letter, qualifications, and portfolio link here]` }));
      } else if (subjectParam === "project-submission") {
        setFormData((prev) => ({ ...prev, subject: "Project Submission", message: "Branch:\nTech Stack:\nGitHub URL:\nProject Description:" }));
      } else {
        setFormData((prev) => ({ ...prev, subject: subjectParam }));
      }
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus("error");
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setFormStatus("submitting");

    // Mock API request delay
    setTimeout(() => {
      setFormStatus("success");
      // Reset form fields
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
      });
    }, 1200);
  };

  return (
    <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "2.5rem 2rem", maxWidth: "600px", width: "100%", margin: "0 auto" }}>
      {formStatus === "success" && (
        <div style={{ backgroundColor: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "1.25rem", borderRadius: "8px", color: "#4ade80", marginBottom: "1.5rem", fontSize: "0.95rem" }} id="contact-success-alert">
          <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Message sent successfully!</div>
          Thank you for reaching out. We will get back to you at the email address provided within 24-48 hours.
        </div>
      )}

      {formStatus === "error" && (
        <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "1.25rem", borderRadius: "8px", color: "#f87171", marginBottom: "1.5rem", fontSize: "0.95rem" }} id="contact-error-alert">
          <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Failed to send message</div>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} id="academy-contact-form">
        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="name-input" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Full Name <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            type="text"
            id="name-input"
            name="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleInputChange}
            disabled={formStatus === "submitting"}
            style={{ width: "100%", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-sans)", outline: "none" }}
          />
        </div>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="email-input" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Email Address <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            type="email"
            id="email-input"
            name="email"
            placeholder="john.doe@example.com"
            required
            value={formData.email}
            onChange={handleInputChange}
            disabled={formStatus === "submitting"}
            style={{ width: "100%", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-sans)", outline: "none" }}
          />
        </div>

        {/* Subject */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="subject-select" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Subject <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <select
            id="subject-select"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            disabled={formStatus === "submitting"}
            style={{
              width: "100%",
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              padding: "0.75rem 1.25rem",
              fontFamily: "var(--font-sans)",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Suggest Notes">Suggest Notes / Resources</option>
            <option value="Report an Error">Report an Error</option>
            <option value="Project Submission">Project Submission</option>
            <option value="Careers Application">Careers Application</option>
            <option value="Collaboration">Collaboration</option>
          </select>
        </div>

        {/* Message */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="message-input" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Your Message <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <textarea
            id="message-input"
            name="message"
            placeholder="Type your message here..."
            required
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            disabled={formStatus === "submitting"}
            style={{ width: "100%", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-sans)", outline: "none", resize: "vertical" }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={cardStyles.btnPrimary}
          disabled={formStatus === "submitting"}
          style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
          id="btn-submit-contact-form"
        >
          {formStatus === "submitting" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header} id="contact-header">
        <h1 className={styles.title} id="contact-title">Contact Private Academy</h1>
        <p className={styles.description} id="contact-desc">
          Have notes to share? Want to report an issue or inquire about careers? Drop us a line below.
        </p>
      </header>

      {/* Info grids & Form */}
      <main style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "start" }} id="contact-main">
        {/* Info Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem" }}>Direct Contact Channels</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>
              Feel free to email our admin desk directly, or connect through the telegram channel for urgent student submissions.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <div style={{ color: "var(--accent)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>Email Address</div>
                <a href="mailto:privateacademy.in@gmail.com" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  privateacademy.in@gmail.com
                </a>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <div style={{ color: "#22c55e" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>Location</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  India Desk
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "1.5rem", backgroundColor: "rgba(99, 102, 241, 0.05)", border: "1px solid rgba(99, 102, 241, 0.15)", borderRadius: "var(--radius)", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
            <strong>💡 Quick Note:</strong> When submitting notes, please ensure that you own the files, or they are open-resource slides. We strictly respect intellectual properties.
          </div>
        </div>

        {/* Form Column */}
        <Suspense fallback={<div>Loading form parameters...</div>}>
          <ContactFormInner />
        </Suspense>
      </main>
    </div>
  );
}
