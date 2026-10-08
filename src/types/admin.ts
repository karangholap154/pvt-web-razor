import { Note, Article } from "@/data/mockData";

export interface Project {
  id: string;
  title: string;
  branch: string;
  tech_stack: string[] | null;
  description: string | null;
  github_url: string | null;
}

export interface Purchase {
  id: string;
  email: string;
  note_id: string | null;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  status: string;
  created_at: string | null;
}

export interface User {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  university: string | null;
  default_branch: string | null;
  default_semester: string | null;
  created_at: string | null;
  avatar_url: string | null;
  role?: string | null;
  status?: string | null;
}

export interface AdminSubmission {
  id: string;
  user_id: string;
  title: string;
  university: string;
  branch: string;
  semester: string;
  suggested_price: number;
  file_url: string;
  status: "pending" | "approved" | "rejected";
  admin_feedback?: string | null;
  created_at: string;
  subject?: string | null;
  resource_type?: string | null;
  is_supplementary?: boolean | null;
  user_profile?: { username?: string | null; email?: string | null; full_name?: string | null };
}

export interface AdminPayoutRequest {
  id: string;
  user_id: string;
  amount: number;
  upi_id: string;
  status: "pending" | "processing" | "completed" | "rejected";
  utr_reference?: string | null;
  admin_notes?: string | null;
  created_at: string;
  user_profile?: { username?: string | null; email?: string | null; full_name?: string | null };
}

export interface AdminConsoleProps {
  initialNotes: Note[];
  initialArticles: Article[];
  initialProjects: Project[];
  initialPurchases: Purchase[];
  initialUsers: User[];
}
