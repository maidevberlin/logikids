import 'reflect-metadata'
import { container } from 'tsyringe'
import { router, protectedProcedure } from '../trpc'
import { getTaskInputSchema, getHintInputSchema } from './schemas'
import { TasksController } from './controller'
import { checkRateLimit } from '../common/rateLimit'

const getController = () => container.resolve(TasksController)

export const tasksRouter = router({
  get: protectedProcedure.input(getTaskInputSchema).query(async ({ input, ctx }) => {
    checkRateLimit(ctx)
    return getController().getTask(input, ctx.userId)
  }),

  getHint: protectedProcedure.input(getHintInputSchema).mutation(async ({ input, ctx }) => {
    return getController().getHint(input.taskId, ctx.userId)
  }),
})
