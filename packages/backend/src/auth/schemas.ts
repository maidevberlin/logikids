import { z } from 'zod'

export const registerInputSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
  inviteCode: z
    .string()
    .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/i, 'Invalid invite code format. Expected format: XXXX-YYYY'),
})

export type RegisterInput = z.infer<typeof registerInputSchema>

export const loginInputSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
})

export type LoginInput = z.infer<typeof loginInputSchema>

export const refreshInputSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
})

export type RefreshInput = z.infer<typeof refreshInputSchema>

// Legacy exports for backward compatibility
/** @deprecated Use registerInputSchema instead */
export const registerSchema = registerInputSchema
/** @deprecated Use loginInputSchema instead */
export const loginSchema = loginInputSchema
/** @deprecated Use refreshInputSchema instead */
export const refreshSchema = refreshInputSchema
