import { z } from 'zod'

export const checkInviteInputSchema = z.object({
  code: z
    .string()
    .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/i, 'Invalid invite code format. Expected format: XXXX-YYYY'),
})
