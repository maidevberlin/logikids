import 'reflect-metadata';
import { container } from 'tsyringe';
import { router, publicProcedure } from '../trpc';
import { checkInviteInputSchema } from './schemas';
import { InvitesController } from './controller';

const getController = () => container.resolve(InvitesController);

export const invitesRouter = router({
  check: publicProcedure.input(checkInviteInputSchema).mutation(async ({ input }) => {
    return getController().check(input.code);
  }),
});
