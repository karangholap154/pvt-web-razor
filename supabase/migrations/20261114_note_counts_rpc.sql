-- Migration: Optimized catalog folder metadata RPC
-- Description: Aggregates lightweight catalog note metadata in Postgres without payload bloat.
-- Safety Guarantee: Purely additive. Does NOT alter, delete, truncate, or drop any existing tables or rows.

CREATE OR REPLACE FUNCTION public.get_catalog_folder_meta(
  p_university TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'all'
)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  branch TEXT,
  semester TEXT,
  university TEXT,
  subject TEXT,
  resource_type TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.title,
    n.branch,
    n.semester,
    n.university,
    n.subject,
    n.resource_type
  FROM public.notes n
  WHERE 
    (p_university IS NULL OR p_university = 'All universities' OR p_university = 'All Universities' OR n.university = p_university)
    AND (
      p_source = 'all'
      OR (p_source = 'official' AND (n.resource_type = 'official_subject' OR (n.is_community_contributed IS NOT TRUE AND n.resource_type IS NULL)))
      OR (p_source = 'community' AND (n.resource_type <> 'official_subject' OR n.is_community_contributed IS TRUE))
    );
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.get_catalog_folder_meta(TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_catalog_folder_meta(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_catalog_folder_meta(TEXT, TEXT) TO authenticated;
