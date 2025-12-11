import { z } from 'zod'
import { SyncPayloadSchema } from './schema'

export const uploadInputSchema = z
  .object({
    userId: z.string().uuid('userId must be a valid UUID'),
    payload: SyncPayloadSchema,
  })
  .refine(
    (data) => {
      const blobSize = Buffer.from(data.payload.encryptedBlob, 'base64').length
      return blobSize <= 1_000_000
    },
    {
      message: 'Payload too large (max 1MB)',
      path: ['payload', 'encryptedBlob'],
    }
  )

export type UploadInput = z.infer<typeof uploadInputSchema>

export const downloadInputSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
})

export type DownloadInput = z.infer<typeof downloadInputSchema>

export const verifyInputSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
})

export type VerifyInput = z.infer<typeof verifyInputSchema>

export const deleteInputSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
})

export type DeleteInput = z.infer<typeof deleteInputSchema>
