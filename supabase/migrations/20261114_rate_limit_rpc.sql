-- Migration: Atomic distributed rate limiting RPC
-- Description: Creates an atomic increment function that handles upsert and increment in a single Postgres transaction.
-- Safety Guarantee: Purely additive. Does NOT alter, delete, truncate, or drop any existing tables or rows.

CREATE OR REPLACE FUNCTION public.increment_rate_limit(
  p_key TEXT,
  p_reset_at TIMESTAMPTZ
)
RETURNS TABLE (
  current_count INT,
  reset_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.rate_limits (key, count, reset_at)
  VALUES (p_key, 1, p_reset_at)
  ON CONFLICT (key) DO UPDATE
  SET
    count = CASE
      WHEN public.rate_limits.reset_at < NOW() THEN 1
      ELSE public.rate_limits.count + 1
    END,
    reset_at = CASE
      WHEN public.rate_limits.reset_at < NOW() THEN p_reset_at
      ELSE public.rate_limits.reset_at
    END
  RETURNING public.rate_limits.count, public.rate_limits.reset_at;
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.increment_rate_limit(TEXT, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_rate_limit(TEXT, TIMESTAMPTZ) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_rate_limit(TEXT, TIMESTAMPTZ) TO authenticated;
