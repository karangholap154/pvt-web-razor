export const BRANCHES = [
  "Computer Engineering",
  "Information Technology",
  "AIML",
  "Mechanical",
  "Chemical"
] as const;

export const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export type Branch = typeof BRANCHES[number];
export type Semester = typeof SEMESTERS[number];

export interface Note {
  id: string;
  title: string;
  branch: Branch;
  semester: Semester;
  description: string;
  downloadUrl: string;
  videoUrl: string;
  price?: number;
  university?: string;
  is_community_contributed?: boolean | null;
  contributor_id?: string | null;
  contributor_username?: string | null;
  contributor_name?: string | null;
}

export interface Article {
  id: string;
  title: string;
  author?: string;
  date?: string;
  readTime: string;
  category: "Guidance" | "Tutorial" | "Project Ideas" | "Software Tips";
  summary: string;
  content: string;
}
