import { z } from 'zod'
import { SyncPayloadSchema } from './schema'

export const uploadInputSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
  payload: SyncPayloadSchema,
})

export const downloadInputSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
})

export const verifyInputSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
})

export const deleteInputSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
})
