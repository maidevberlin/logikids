import { Request, Response } from 'express'
import { SyncService } from './sync.service'
import { SyncPayloadSchema } from './sync.schema'
import { ZodError } from 'zod'

/**
 * HTTP controller for encrypted data sync endpoints
 *
 * Rate limiting applied at middleware level (see router.ts)
 */
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /**
   * PUT /api/sync/:userId
   * Upload encrypted user data
   */
  upload = async (req: Request, res: Response): Promise<void> => {
    try {
      // Already validated by middleware
      const { userId } = req.params

      // Validate request body
      const payload = SyncPayloadSchema.parse(req.body)

      // Check payload size (max 1MB)
      const blobSize = Buffer.from(payload.encryptedBlob, 'base64').length
      if (blobSize > 1_000_000) {
        res.status(413).json({ error: 'Payload too large (max 1MB)' })
        return
      }

      // Store encrypted data
      await this.syncService.upload(userId, payload)

      res.json({ success: true })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  /**
   * GET /api/sync/:userId
   * Download encrypted user data
   */
  download = async (req: Request, res: Response): Promise<void> => {
    try {
      // Already validated by middleware
      const { userId } = req.params

      // Fetch encrypted data
      const payload = await this.syncService.download(userId)

      if (!payload) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      res.json(payload)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  /**
   * POST /api/sync/:userId/verify
   * Verify user exists (for pairing validation)
   */
  verify = async (req: Request, res: Response): Promise<void> => {
    try {
      // Already validated by middleware
      const { userId } = req.params

      // Check existence
      const exists = await this.syncService.verify(userId)

      res.json({ exists })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  /**
   * DELETE /api/sync/:userId
   * Delete user data (GDPR right to erasure)
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      // Already validated by middleware
      const { userId } = req.params

      // Delete user data
      await this.syncService.deleteUser(userId)

      res.json({ success: true })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  /**
   * Error handling helper
   */
  private handleError(error: unknown, res: Response): void {
    console.error('[SyncController] Error:', error)

    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      })
      return
    }

    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      })
      return
    }

    res.status(500).json({
      error: 'Internal server error',
    })
  }
}
