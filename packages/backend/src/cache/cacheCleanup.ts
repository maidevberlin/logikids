import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { TaskCache } from './taskCache'

/**
 * Periodically clean expired tasks from cache
 */
@injectable()
export class CacheCleanupService {
  private intervalId?: Timer
  private readonly intervalMs = 5 * 60 * 1000 // 5 minutes

  constructor(@inject(TaskCache) private readonly taskCache: TaskCache) {}

  start(): void {
    if (this.intervalId) {
      return
    }

    // Run immediately
    this.cleanup()

    // Then run periodically
    this.intervalId = setInterval(() => {
      this.cleanup()
    }, this.intervalMs)
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
  }

  private cleanup(): void {
    this.taskCache.cleanExpired()
  }
}
