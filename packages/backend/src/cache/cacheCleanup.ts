import { taskCache } from './taskCache';

/**
 * Periodically clean expired tasks from cache
 */
export class CacheCleanupService {
  private intervalId?: Timer;
  private readonly intervalMs: number;

  constructor(intervalMinutes: number = 5) {
    this.intervalMs = intervalMinutes * 60 * 1000;
  }

  start(): void {
    if (this.intervalId) {
      console.log('[CacheCleanup] Already running');
      return;
    }

    console.log(`[CacheCleanup] Starting cleanup job (every ${this.intervalMs / 60000} minutes)`);

    // Run immediately
    this.cleanup();

    // Then run periodically
    this.intervalId = setInterval(() => {
      this.cleanup();
    }, this.intervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      console.log('[CacheCleanup] Stopped');
    }
  }

  private cleanup(): void {
    console.log('[CacheCleanup] Running cleanup...');
    const startTime = Date.now();
    taskCache.cleanExpired();
    const duration = Date.now() - startTime;
    console.log(`[CacheCleanup] Cleanup completed in ${duration}ms`);
  }
}

// Export singleton
export const cacheCleanupService = new CacheCleanupService();
