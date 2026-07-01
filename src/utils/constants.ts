/**
 * Shared configuration constants for the application.
 */

export const ALLOWED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "aol.com",
  "live.com",
  "zohomail.in",
  "zohomail.com",
  "privateacademy.in",
];

export interface UniversityConfig {
  value: string;
  abbr: string;
  color: string;
  bg: string;
}

export const UNIVERSITIES: UniversityConfig[] = [
  { value: "Mumbai University", abbr: "MU", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.05)" },
  { value: "Savitribai Phule Pune University", abbr: "SPPU", color: "#e879f9", bg: "rgba(232, 121, 249, 0.05)" },
  { value: "Nagpur University", abbr: "NU", color: "#34d399", bg: "rgba(52, 211, 153, 0.05)" },
  { value: "Amravati University", abbr: "AU", color: "#fb7185", bg: "rgba(251, 113, 133, 0.05)" },
  { value: "Dr. Babasaheb Ambedkar Technological University", abbr: "DBATU", color: "#fb923c", bg: "rgba(251, 146, 60, 0.05)" },
  { value: "Shivaji University", abbr: "SUK", color: "#60a5fa", bg: "rgba(96, 165, 250, 0.05)" },
];

