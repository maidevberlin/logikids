import 'reflect-metadata'
import { container } from 'tsyringe'
import { router, protectedProcedure } from '../trpc'
import { synthesizeInputSchema } from './schemas'
import { TTSController } from './controller'
import { checkRateLimit } from '../common/rateLimit'

const getController = () => container.resolve(TTSController)

export const ttsRouter = router({
  synthesize: protectedProcedure.input(synthesizeInputSchema).mutation(async ({ input, ctx }) => {
    checkRateLimit(ctx)
    return getController().synthesize(input, ctx.userId)
  }),
})
