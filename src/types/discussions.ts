export interface DiscussionUser {
  id: string;
  username: string | null;
  full_name?: string | null;
  badge_tier?: string | null;
}

export interface DiscussionLinkedNote {
  id: string;
  title: string;
  branch: string;
  semester: string;
  university?: string;
}

export interface DiscussionPost {
  id: string;
  user_id: string;
  note_id?: string | null;
  university: string;
  branch: string;
  semester: string;
  title: string;
  content: string;
  tags: string[];
  upvotes_count: number;
  replies_count: number;
  is_resolved: boolean;
  created_at: string;
  updated_at?: string;
  
  // Joined fields
  author?: DiscussionUser;
  linked_note?: DiscussionLinkedNote | null;
  has_user_voted?: boolean;
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  is_accepted_answer: boolean;
  upvotes_count: number;
  created_at: string;
  
  // Joined fields
  author?: DiscussionUser;
  has_user_voted?: boolean;
}

export interface CreateDiscussionPayload {
  title: string;
  content: string;
  university: string;
  branch: string;
  semester: string;
  tags?: string[];
  note_id?: string | null;
}

export interface CreateReplyPayload {
  discussion_id: string;
  content: string;
}

export interface VotePayload {
  discussion_id?: string;
  reply_id?: string;
}
