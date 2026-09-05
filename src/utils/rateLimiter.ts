import { supabaseAdmin } from "./supabaseAdmin";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();
const MAX_MAP_SIZE = 1000;

/**
 * Synchronous sliding window rate limiter (In-Memory fallback / local dev).
 * @param key Unique key to track (e.g. IP + endpoint)
 * @param limit Maximum allowed requests in window
 * @param windowMs Time window in milliseconds (default: 15 minutes)
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Periodic cleanup of expired keys
  if (ipMap.size > MAX_MAP_SIZE) {
    for (const [k, rec] of ipMap.entries()) {
      if (rec.resetTime < now) {
        ipMap.delete(k);
      }
    }
  }

  const record = ipMap.get(key);

  if (!record || record.resetTime < now) {
    ipMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.count >= limit) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Asynchronous persistent rate limiter for serverless deployments (backed by Supabase DB).
 * Automatically falls back to in-memory rate limiting if database is unreachable.
 * @param key Unique key to track (e.g. IP + endpoint)
 * @param limit Maximum allowed requests in window
 * @param windowMs Time window in milliseconds (default: 15 minutes)
 */
export async function checkRateLimitAsync(
  key: string,
  limit: number = 10,
  windowMs: number = 15 * 60 * 1000
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  try {
    const now = Date.now();
    const resetIso = new Date(now + windowMs).toISOString();

    // Cast client to dynamic query table for rate_limits
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabaseAdmin as any;

    const { data: record, error } = await client
      .from("rate_limits")
      .select("count, reset_at")
      .eq("key", key)
      .maybeSingle();

    if (error || !record || new Date(record.reset_at).getTime() < now) {
      await client
        .from("rate_limits")
        .upsert(
          { key, count: 1, reset_at: resetIso },
          { onConflict: "key" }
        );

      return { allowed: true, retryAfterSeconds: 0 };
    }

    const resetMs = new Date(record.reset_at).getTime();

    if (record.count >= limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((resetMs - now) / 1000));
      return { allowed: false, retryAfterSeconds };
    }

    await client
      .from("rate_limits")
      .update({ count: Number(record.count || 0) + 1 })
      .eq("key", key);

    return { allowed: true, retryAfterSeconds: 0 };
  } catch (err) {
    console.warn("Persistent rate limiter fallback to in-memory:", err);
    return checkRateLimit(key, limit, windowMs);
  }
}
