export interface Note {
  id: string;
  title: string;
  branch: "Computer" | "IT" | "AIML" | "Mechanical" | "Chemical";
  semester: string;
  description: string;
  downloadUrl: string;
  videoUrl: string;
  price?: number;
  university?: string;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: "Guidance" | "Tutorial" | "Project Ideas" | "Software Tips";
  summary: string;
  content: string;
}
