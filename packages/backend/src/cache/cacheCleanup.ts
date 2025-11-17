import { taskCache } from './taskCache';
import { createLogger } from '../common/logger';

const logger = createLogger('CacheCleanup');

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
      logger.debug('Already running');
      return;
    }

    logger.debug(`[CacheCleanup] Starting cleanup job (every ${this.intervalMs / 60000} minutes)`);

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
      logger.debug('Stopped');
    }
  }

  private cleanup(): void {
    logger.debug('Running cleanup...');
    const startTime = Date.now();
    taskCache.cleanExpired();
    const duration = Date.now() - startTime;
    logger.debug(`[CacheCleanup] Cleanup completed in ${duration}ms`);
  }
}

// Export singleton
export const cacheCleanupService = new CacheCleanupService();
