import { Router } from 'express'
import { SyncController } from './sync.controller'
import { SyncService } from './sync.service'
import { StorageService } from './storage.service'
import rateLimit from 'express-rate-limit'
import { requireAuth, requireOwnUserId } from '../auth/auth.middleware'

/**
 * Create and configure sync router with rate limiting
 */
export function createSyncRouter(): Router {
  const router = Router()

  // Initialize services
  const storage = new StorageService()
  const service = new SyncService(storage)
  const controller = new SyncController(service)

  // Initialize storage directory
  storage.init().catch(error => {
    console.error('[SyncRouter] Failed to initialize storage:', error)
  })

  // Rate limiting: 100 requests per userId per hour
  const syncRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100,
    keyGenerator: (req) => req.params.userId || 'unknown',
    message: {
      error: 'Too many sync requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test', // Skip in tests
  })

  // Apply rate limiting to all sync routes
  router.use(syncRateLimiter)

  // Sync endpoints - all require auth and userId verification
  router.put('/:userId', requireAuth, requireOwnUserId, controller.upload)
  router.get('/:userId', requireAuth, requireOwnUserId, controller.download)
  router.post('/:userId/verify', requireAuth, requireOwnUserId, controller.verify)
  router.delete('/:userId', requireAuth, requireOwnUserId, controller.delete)

  return router
}
