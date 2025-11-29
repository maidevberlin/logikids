import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';
import { SyncService } from '../sync/sync.service';
import { StorageService } from '../sync/storage.service';
import { SyncPayloadSchema } from '../sync/sync.schema';

// Initialize services
const storage = new StorageService();
const syncService = new SyncService(storage);

// Initialize storage directory
storage.init().catch((error) => {
  console.error('Failed to initialize storage', error);
});

/**
 * Sync router - encrypted data sync for cross-device support
 * All endpoints require authentication and userId ownership verification
 */
export const syncRouter = router({
  /**
   * Upload encrypted user data
   */
  upload: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid('userId must be a valid UUID'),
        payload: SyncPayloadSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user can only upload their own data
      if (input.userId !== ctx.userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot upload data for another user' });
      }

      // Check payload size (max 1MB)
      const blobSize = Buffer.from(input.payload.encryptedBlob, 'base64').length;
      if (blobSize > 1_000_000) {
        throw new TRPCError({ code: 'PAYLOAD_TOO_LARGE', message: 'Payload too large (max 1MB)' });
      }

      // Store encrypted data
      await syncService.upload(input.userId, input.payload);

      return { success: true };
    }),

  /**
   * Download encrypted user data
   */
  download: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid('userId must be a valid UUID'),
      })
    )
    .query(async ({ input, ctx }) => {
      // Verify user can only download their own data
      if (input.userId !== ctx.userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot download data for another user' });
      }

      // Fetch encrypted data
      const payload = await syncService.download(input.userId);

      if (!payload) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return payload;
    }),

  /**
   * Verify user exists (for pairing validation)
   */
  verify: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid('userId must be a valid UUID'),
      })
    )
    .query(async ({ input, ctx }) => {
      // Verify user can only check their own existence
      if (input.userId !== ctx.userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot verify another user' });
      }

      // Check existence
      const exists = await syncService.verify(input.userId);

      return { exists };
    }),

  /**
   * Delete user data (GDPR right to erasure)
   */
  delete: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid('userId must be a valid UUID'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user can only delete their own data
      if (input.userId !== ctx.userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot delete data for another user' });
      }

      // Delete user data
      await syncService.deleteUser(input.userId);

      return { success: true };
    }),
});
