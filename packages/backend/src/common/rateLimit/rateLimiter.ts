import { cleanupRegistry } from '../cleanup'
import type { Cleanable } from '../cleanup'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter: number | null // seconds until next request allowed
}

/**
 * In-memory sliding window rate limiter.
 *
 * REDIS MIGRATION: Replace this class with a Redis-backed implementation:
 * 1. Use Redis INCR + EXPIRE for atomic counter with TTL
 * 2. Or use Redis sorted sets for sliding window
 * 3. Remove registration from cleanupRegistry (Redis handles TTL)
 *
 * Example Redis implementation:
 * ```
 * const key = `ratelimit:${identifier}`
 * const count = await redis.incr(key)
 * if (count === 1) await redis.expire(key, windowSeconds)
 * return { allowed: count <= limit, remaining: Math.max(0, limit - count) }
 * ```
 */
export class RateLimiter implements Cleanable {
  name = 'RateLimiter'
  private windows = new Map<string, number[]>()
  private readonly windowMs: number
  private readonly limit: number

  constructor(options: { windowMs: number; limit: number }) {
    this.windowMs = options.windowMs
    this.limit = options.limit

    // Register for cleanup
    cleanupRegistry.register(this)
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Get or create timestamps array
    let timestamps = this.windows.get(identifier) || []

    // Filter to only timestamps within current window
    timestamps = timestamps.filter((ts) => ts > windowStart)

    if (timestamps.length < this.limit) {
      // Allowed - record this request
      timestamps.push(now)
      this.windows.set(identifier, timestamps)

      return {
        allowed: true,
        remaining: this.limit - timestamps.length,
        retryAfter: null,
      }
    }

    // Rate limited - calculate when oldest request expires
    const oldestTimestamp = timestamps[0]
    const retryAfter = Math.ceil((oldestTimestamp + this.windowMs - now) / 1000)

    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    }
  }

  cleanup(): void {
    const now = Date.now()
    const windowStart = now - this.windowMs

    for (const [identifier, timestamps] of this.windows.entries()) {
      const valid = timestamps.filter((ts) => ts > windowStart)
      if (valid.length === 0) {
        this.windows.delete(identifier)
      } else {
        this.windows.set(identifier, valid)
      }
    }
  }
}
