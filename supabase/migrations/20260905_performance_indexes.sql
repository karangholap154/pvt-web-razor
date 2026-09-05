-- Migration: High-Performance Composite Database Indexes
-- Created: 2026-09-05
-- Description: Adds composite performance indexes for purchases permission checks, note catalog filtering, and discussions sorting.

-- 1. Purchases table index for instant access permission checks in proxy-pdf
CREATE INDEX IF NOT EXISTS idx_purchases_email_note_status ON public.purchases(email, note_id, status);

-- 2. Notes table composite index for catalog search & filter speedup
CREATE INDEX IF NOT EXISTS idx_notes_filter_composite ON public.notes(university, branch, semester, price);

-- 3. Discussions table index for feed sorting & status lookup
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON public.discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_resolved ON public.discussions(is_resolved);
