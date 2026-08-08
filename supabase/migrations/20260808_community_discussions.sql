-- Migration: Dedicated Student Community Discussions Hub
-- Date: 2026-08-08
-- Description: Enables lightweight, text-only student discussions, Q&A, and doubt solving with automatic counter triggers.

-- 1. Create 'discussions' table
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  note_id TEXT REFERENCES public.notes(id) ON DELETE SET NULL, -- Matched to notes(id) TEXT type
  university TEXT NOT NULL,
  branch TEXT NOT NULL,
  semester TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Text/Markdown content
  tags TEXT[] DEFAULT '{}',
  upvotes_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'discussion_replies' table
CREATE TABLE IF NOT EXISTS public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL, -- Text/Markdown reply content
  is_accepted_answer BOOLEAN DEFAULT FALSE,
  upvotes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create 'discussion_votes' table for upvote tracking
CREATE TABLE IF NOT EXISTS public.discussion_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  vote_type INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_target CHECK (
    (discussion_id IS NOT NULL AND reply_id IS NULL) OR
    (discussion_id IS NULL AND reply_id IS NOT NULL)
  )
);

-- 4. Composite Performance Indexes
CREATE INDEX IF NOT EXISTS idx_discussions_univ_branch_sem ON public.discussions(university, branch, semester);
CREATE INDEX IF NOT EXISTS idx_discussions_created ON public.discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_note ON public.discussions(note_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_disc ON public.discussion_replies(discussion_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_discussion_votes_disc_user ON public.discussion_votes(discussion_id, user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_votes_reply_user ON public.discussion_votes(reply_id, user_id);

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to discussions" ON public.discussions;
DROP POLICY IF EXISTS "Allow authenticated users to create discussions" ON public.discussions;
DROP POLICY IF EXISTS "Allow original poster to update discussion" ON public.discussions;
DROP POLICY IF EXISTS "Allow public read access to discussion replies" ON public.discussion_replies;
DROP POLICY IF EXISTS "Allow authenticated users to create replies" ON public.discussion_replies;
DROP POLICY IF EXISTS "Allow update replies" ON public.discussion_replies;
DROP POLICY IF EXISTS "Allow public read votes" ON public.discussion_votes;
DROP POLICY IF EXISTS "Allow authenticated user to vote" ON public.discussion_votes;
DROP POLICY IF EXISTS "Allow authenticated user to delete vote" ON public.discussion_votes;

-- Discussions Policies
CREATE POLICY "Allow public read access to discussions" ON public.discussions
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create discussions" ON public.discussions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow original poster to update discussion" ON public.discussions
  FOR UPDATE USING (auth.uid() = user_id);

-- Replies Policies
CREATE POLICY "Allow public read access to discussion replies" ON public.discussion_replies
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create replies" ON public.discussion_replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update replies" ON public.discussion_replies
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT d.user_id FROM public.discussions d WHERE d.id = discussion_id
    )
  );

-- Votes Policies
CREATE POLICY "Allow public read votes" ON public.discussion_votes
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated user to vote" ON public.discussion_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated user to delete vote" ON public.discussion_votes
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Automatic Upvote Counter Trigger Function (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.sync_discussion_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.discussion_id IS NOT NULL THEN
    UPDATE public.discussions
    SET upvotes_count = (SELECT COUNT(*) FROM public.discussion_votes WHERE discussion_id = NEW.discussion_id)
    WHERE id = NEW.discussion_id;
  ELSIF (TG_OP = 'DELETE') AND OLD.discussion_id IS NOT NULL THEN
    UPDATE public.discussions
    SET upvotes_count = (SELECT COUNT(*) FROM public.discussion_votes WHERE discussion_id = OLD.discussion_id)
    WHERE id = OLD.discussion_id;
  ELSIF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.reply_id IS NOT NULL THEN
    UPDATE public.discussion_replies
    SET upvotes_count = (SELECT COUNT(*) FROM public.discussion_votes WHERE reply_id = NEW.reply_id)
    WHERE id = NEW.reply_id;
  ELSIF (TG_OP = 'DELETE') AND OLD.reply_id IS NOT NULL THEN
    UPDATE public.discussion_replies
    SET upvotes_count = (SELECT COUNT(*) FROM public.discussion_votes WHERE reply_id = OLD.reply_id)
    WHERE id = OLD.reply_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_sync_discussion_upvotes ON public.discussion_votes;
CREATE TRIGGER trigger_sync_discussion_upvotes
AFTER INSERT OR UPDATE OR DELETE ON public.discussion_votes
FOR EACH ROW EXECUTE FUNCTION public.sync_discussion_upvotes();

-- 7. Automatic Reply Counter Trigger Function (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.sync_discussion_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    UPDATE public.discussions
    SET replies_count = (SELECT COUNT(*) FROM public.discussion_replies WHERE discussion_id = NEW.discussion_id)
    WHERE id = NEW.discussion_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.discussions
    SET replies_count = (SELECT COUNT(*) FROM public.discussion_replies WHERE discussion_id = OLD.discussion_id)
    WHERE id = OLD.discussion_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_sync_discussion_replies ON public.discussion_replies;
CREATE TRIGGER trigger_sync_discussion_replies
AFTER INSERT OR UPDATE OR DELETE ON public.discussion_replies
FOR EACH ROW EXECUTE FUNCTION public.sync_discussion_replies_count();
