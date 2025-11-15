import { z } from 'zod';

/**
 * Schema for invite code validation
 * Format: XXXX-YYYY where X and Y are alphanumeric
 */
export const validateInviteSchema = z.object({
  code: z.string().regex(
    /^[A-Z0-9]{4}-[A-Z0-9]{4}$/i,
    'Invalid invite code format. Expected format: XXXX-YYYY'
  )
});

// Inferred type
export type ValidateInviteRequest = z.infer<typeof validateInviteSchema>;
