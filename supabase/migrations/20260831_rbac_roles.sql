-- Migration: Role-Based Access Control (RBAC) System
-- Created: 2026-08-31
-- Description: Adds 'role' column to users table with performance indexing.

-- 1. Extend 'users' table to support RBAC roles ('user', 'contributor', 'admin')
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Performance Index on role column
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 3. Constraint to validate allowed roles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_user_role'
    ) THEN
        ALTER TABLE public.users 
          ADD CONSTRAINT check_user_role 
          CHECK (role IN ('user', 'contributor', 'admin'));
    END IF;
END $$;
