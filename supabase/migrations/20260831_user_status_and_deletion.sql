-- Migration: User Status Management (Active/Suspended/Banned) System
-- Created: 2026-08-31
-- Description: Adds 'status' column to users table with performance indexing and constraint.

-- 1. Extend 'users' table to support account status ('active', 'suspended', 'banned')
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. Performance Index on status column
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- 3. Constraint to validate allowed status values
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_user_status'
    ) THEN
        ALTER TABLE public.users 
          ADD CONSTRAINT check_user_status 
          CHECK (status IN ('active', 'suspended', 'banned'));
    END IF;
END $$;
