/**
 * Simple in-memory sliding window rate limiter for API endpoints.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();

/**
 * Checks if a key (e.g. IP address or email) has exceeded the max allowed attempts.
 * @param key Unique key to track (e.g. IP + endpoint)
 * @param limit Maximum allowed requests in window
 * @param windowMs Time window in milliseconds (default: 15 minutes)
 * @returns boolean True if allowed, false if rate limit exceeded
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Periodic cleanup of expired keys
  if (ipMap.size > 2000) {
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
