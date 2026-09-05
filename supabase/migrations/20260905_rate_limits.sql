-- Migration: Distributed Rate Limiting System for Serverless Deployments
-- Created: 2026-09-05
-- Description: Creates rate_limits table and automatic cleanup index for API route rate limiting.

CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  count INT NOT NULL DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Index for expired record cleanup
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON public.rate_limits(reset_at);
