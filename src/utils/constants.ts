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

/**
 * Branch name aliases for flexible database filtering across varied naming conventions.
 */
export const BRANCH_ALIASES: Record<string, string[]> = {
  "Information Technology (IT)": ["Information Technology (IT)", "Information Technology", "IT"],
  "Information Technology": ["Information Technology (IT)", "Information Technology", "IT"],
  "Artificial Intelligence & Machine Learning (AIML)": ["Artificial Intelligence & Machine Learning (AIML)", "AIML"],
  "AIML": ["Artificial Intelligence & Machine Learning (AIML)", "AIML"],
  "Computer Science & Engineering (CSE)": ["Computer Science & Engineering (CSE)", "CSE"],
  "Electronics & Telecommunication (EXTC)": ["Electronics & Telecommunication (EXTC)", "EXTC"],
};

export function getBranchFilterValues(branch: string): string[] {
  return BRANCH_ALIASES[branch] || [branch];
}

/**
 * Username format validation regex.
 * Dot allowed in middle only — not first/last char, no consecutive dots.
 * Pattern: first=[a-z0-9_], middle=[a-z0-9_.]{1,13}, last=[a-z0-9_] = 3-15 chars total.
 */
export const USERNAME_REGEX = /^(?!.*\.\.)[a-z0-9_][a-z0-9_.]{1,13}[a-z0-9_]$/;

export function isValidUsername(username: string): boolean {
  return USERNAME_REGEX.test(username.trim().toLowerCase());
}

/**
 * Shorten university name for compact badge and metadata display
 */
export function getShortUniversity(uni?: string | null): string {
  if (!uni) return "MU";
  const upper = uni.toUpperCase();
  if (upper.includes("MUMBAI")) return "MU";
  if (upper.includes("PUNE") || upper.includes("SPPU")) return "SPPU";
  if (upper.includes("NAGPUR")) return "NU";
  if (upper.includes("AMRAVATI")) return "AU";
  if (upper.includes("BATU")) return "DBATU";
  if (upper.includes("SHIVAJI")) return "SUK";
  return upper.length > 6 ? upper.slice(0, 5) : upper;
}

/**
 * Shorten branch name for compact badge and metadata display (e.g. COMP, IT, EXTC)
 */
export function getShortBranch(branch?: string | null): string {
  if (!branch) return "ENGINEERING";
  const b = branch.toUpperCase();
  if (b.includes("COMPUTER") || b.includes("CSE")) return "COMP";
  if (b.includes("INFORMATION") || b.includes("IT")) return "IT";
  if (b.includes("AIML")) return "AIML";
  if (b.includes("AIDS") || b.includes("DATA SCIENCE")) return "AIDS";
  if (b.includes("EXTC") || b.includes("TELECOMMUNICATION")) return "EXTC";
  if (b.includes("MECHANICAL")) return "MECH";
  if (b.includes("ELECTRICAL")) return "ELEC";
  if (b.includes("CIVIL")) return "CIVIL";
  if (b.includes("ROBOTICS")) return "ROBOTICS";
  if (b.includes("AUTOMOBILE")) return "AUTO";
  if (b.includes("CHEMICAL")) return "CHEM";
  if (b.includes("BIOMEDICAL")) return "BIOMED";
  return branch.split(" ")[0].toUpperCase();
}

