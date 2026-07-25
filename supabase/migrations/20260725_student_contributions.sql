-- Migration: Student Contributions, Gamified Badges & Payout System
-- Created: 2026-07-25

-- 1. Extend 'notes' table for contributor attribution
ALTER TABLE public.notes 
  ADD COLUMN IF NOT EXISTS contributor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_community_contributed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS platform_commission_rate NUMERIC DEFAULT 0.20;

-- 2. Extend 'users' table for UPI details and gamification metrics
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS upi_id TEXT,
  ADD COLUMN IF NOT EXISTS payout_name TEXT,
  ADD COLUMN IF NOT EXISTS badge_tier TEXT DEFAULT 'contributor',
  ADD COLUMN IF NOT EXISTS approved_notes_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_downloads_count INT DEFAULT 0;

-- 3. Create 'note_submissions' table for pending/rejected upload review
CREATE TABLE IF NOT EXISTS public.note_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  university TEXT NOT NULL,
  branch TEXT NOT NULL,
  semester TEXT NOT NULL,
  file_url TEXT NOT NULL,
  suggested_price NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create 'payout_requests' table for student UPI payout management
CREATE TABLE IF NOT EXISTS public.payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  upi_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  utr_reference TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_notes_contributor ON public.notes(contributor_id);
CREATE INDEX IF NOT EXISTS idx_note_submissions_user ON public.note_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_note_submissions_status ON public.note_submissions(status);
CREATE INDEX IF NOT EXISTS idx_payout_requests_user ON public.payout_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON public.payout_requests(status);

-- 6. Storage Bucket for Student Submissions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('submissions-bucket', 'submissions-bucket', false)
ON CONFLICT (id) DO NOTHING;
