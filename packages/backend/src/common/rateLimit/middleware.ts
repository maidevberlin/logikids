import { TRPCError } from '@trpc/server'
import { RateLimiter } from './rateLimiter'
import type { Context } from '../../trpc'

/**
 * Rate limiter instance for task generation and TTS.
 * 2 requests per minute per user.
 *
 * REDIS MIGRATION: Replace RateLimiter with Redis-backed version.
 * The middleware itself doesn't change, only the RateLimiter implementation.
 */
const taskRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 2,
})

/**
 * Extract client identifier for rate limiting.
 * Uses userId if authenticated, falls back to IP address.
 */
function getIdentifier(ctx: Context): string {
  // Prefer userId for authenticated requests
  if (ctx.userId) {
    return `user:${ctx.userId}`
  }

  // Fall back to IP address
  const ip = getClientIp(ctx.req)
  return `ip:${ip}`
}

/**
 * Extract client IP from request headers.
 * Checks x-forwarded-for for proxied requests.
 */
function getClientIp(req: Request): string {
  // Check x-forwarded-for header (set by proxies/load balancers)
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs; first one is the client
    const firstIp = forwarded.split(',')[0].trim()
    if (firstIp) return firstIp
  }

  // Check x-real-ip header (nginx)
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp

  // Fallback - shouldn't happen in production
  return 'unknown'
}

/**
 * Check rate limit and throw if exceeded.
 * Call this at the start of rate-limited procedures.
 */
export function checkRateLimit(ctx: Context): void {
  const identifier = getIdentifier(ctx)
  const result = taskRateLimiter.check(identifier)

  if (!result.allowed) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Please wait before generating another task',
      cause: { retryAfter: result.retryAfter },
    })
  }
}
