/**
 * Interface for resources that need periodic cleanup.
 *
 * REDIS MIGRATION: When migrating to Redis, resources using Redis
 * don't need cleanup (Redis handles TTL natively). Simply don't
 * register Redis-backed resources with the CleanupRegistry.
 */
export interface Cleanable {
  /** Human-readable name for logging */
  name: string
  /** Perform cleanup of expired/stale entries */
  cleanup(): void
}
