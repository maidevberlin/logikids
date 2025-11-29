import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { InviteService } from '../invites/invite.service';

const inviteService = new InviteService();

/**
 * Invites router - check invite code validity
 */
export const invitesRouter = router({
  /**
   * Check if invite code is valid (without marking as used)
   */
  check: publicProcedure
    .input(
      z.object({
        code: z
          .string()
          .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/i, 'Invalid invite code format. Expected format: XXXX-YYYY'),
      })
    )
    .mutation(async ({ input }) => {
      const result = await inviteService.check(input.code);
      return result;
    }),
});
