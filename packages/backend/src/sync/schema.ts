import { z } from 'zod'

/**
 * Schema for encrypted sync payload
 * This is what clients upload and download from the server
 */
export const SyncPayloadSchema = z.object({
  encryptedBlob: z.string().min(1).max(1_000_000), // Max 1MB base64
  iv: z.string().length(16), // 12 bytes base64 = 16 chars
  timestamp: z.number().int().positive(),
  checksum: z.string().length(64), // SHA-256 hex = 64 chars
})

export type SyncPayload = z.infer<typeof SyncPayloadSchema>

/**
 * Schema for stored sync record
 * Additional metadata for server storage
 */
export const SyncRecordSchema = SyncPayloadSchema.extend({
  userId: z.string().uuid(),
  createdAt: z.date(),
  lastAccessed: z.date(),
  blobSize: z.number().int().positive(),
})

export type SyncRecord = z.infer<typeof SyncRecordSchema>
