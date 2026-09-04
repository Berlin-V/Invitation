import type { NextRequest } from "next/server";

/**
 * Per-instance in-memory rate limiter, shared by the chat and wishes routes
 * (each previously kept an identical copy). Resets on cold start, which is an
 * acceptable tradeoff for this site's traffic — its job is to cap runaway
 * spam/API cost from a single visitor, not to be an authoritative quota.
 */
export function createRateLimiter({
  windowMs,
  max,
}: {
  windowMs: number;
  max: number;
}) {
  const log = new Map<string, number[]>();
  let lastSweep = Date.now();

  // Every key would otherwise linger for the life of the instance, so the map
  // grows once per unique visitor. Drop fully-expired keys occasionally —
  // amortised onto calls rather than a timer, which would keep a serverless
  // instance from idling down.
  function sweep(now: number) {
    if (now - lastSweep < windowMs) return;
    lastSweep = now;
    for (const [k, hits] of log) {
      if (hits.every((t) => now - t >= windowMs)) log.delete(k);
    }
  }

  return function isRateLimited(key: string): boolean {
    const now = Date.now();
    sweep(now);

    const recent = (log.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      log.set(key, recent);
      return true;
    }
    recent.push(now);
    log.set(key, recent);
    return false;
  };
}

/** Best-effort client identity for rate limiting. */
export function clientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
