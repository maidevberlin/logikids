import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { cleanupService } from '../common/cleanup'

// Import to trigger registration with cleanup registry
import './taskCache'

/**
 * Service wrapper for the centralized cleanup system.
 *
 * REDIS MIGRATION: When all resources migrate to Redis:
 * 1. Resources won't register with cleanupRegistry (Redis handles TTL)
 * 2. This service can be removed entirely
 * 3. Remove the start/stop calls from index.ts
 */
@injectable()
export class CacheCleanupService {
  start(): void {
    cleanupService.start()
  }

  stop(): void {
    cleanupService.stop()
  }
}
