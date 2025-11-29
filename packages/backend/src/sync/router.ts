import 'reflect-metadata';
import { container } from 'tsyringe';
import { router, protectedProcedure } from '../trpc';
import { uploadInputSchema, downloadInputSchema, verifyInputSchema, deleteInputSchema } from './schemas';
import { SyncController } from './controller';

const getController = () => container.resolve(SyncController);

export const syncRouter = router({
  upload: protectedProcedure.input(uploadInputSchema).mutation(async ({ input, ctx }) => {
    return getController().upload(input.userId, input.payload, ctx.userId);
  }),

  download: protectedProcedure.input(downloadInputSchema).query(async ({ input, ctx }) => {
    return getController().download(input.userId, ctx.userId);
  }),

  verify: protectedProcedure.input(verifyInputSchema).query(async ({ input, ctx }) => {
    return getController().verify(input.userId, ctx.userId);
  }),

  delete: protectedProcedure.input(deleteInputSchema).mutation(async ({ input, ctx }) => {
    return getController().delete(input.userId, ctx.userId);
  }),
});
