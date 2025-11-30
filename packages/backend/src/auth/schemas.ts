import { z } from 'zod'

export const registerSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
  inviteCode: z
    .string()
    .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/i, 'Invalid invite code format. Expected format: XXXX-YYYY'),
})

export const loginSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
})

export const refreshSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
})
