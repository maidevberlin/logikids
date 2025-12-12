import { cleanupRegistry } from './cleanupRegistry'

/**
 * Service that periodically cleans up all registered resources.
 *
 * REDIS MIGRATION: When all resources migrate to Redis, this service
 * becomes optional. Redis handles TTL natively, so no cleanup needed.
 * You can either:
 * 1. Keep this service for any remaining in-memory resources
 * 2. Remove entirely once everything uses Redis
 */
class CleanupService {
  private intervalId: ReturnType<typeof setInterval> | null = null
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 minutes

  start(): void {
    if (this.intervalId) return

    this.intervalId = setInterval(() => {
      this.runCleanup()
    }, this.CLEANUP_INTERVAL)
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  private runCleanup(): void {
    const resources = cleanupRegistry.getAll()
    for (const resource of resources) {
      try {
        resource.cleanup()
      } catch {
        // Silently ignore cleanup errors - non-critical operation
      }
    }
  }
}

export const cleanupService = new CleanupService()
