import 'reflect-metadata'
import { container } from 'tsyringe'
import { router, protectedProcedure } from '../trpc'
import { synthesizeInputSchema } from './schemas'
import { TTSController } from './controller'

const getController = () => container.resolve(TTSController)

export const ttsRouter = router({
  synthesize: protectedProcedure.input(synthesizeInputSchema).mutation(async ({ input, ctx }) => {
    return getController().synthesize(input, ctx.userId)
  }),
})
