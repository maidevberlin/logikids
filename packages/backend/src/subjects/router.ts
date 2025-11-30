import 'reflect-metadata'
import { container } from 'tsyringe'
import { router, protectedProcedure } from '../trpc'
import { subjectsInputSchema } from './schemas'
import { SubjectsController } from './controller'

const getController = () => container.resolve(SubjectsController)

export const subjectsRouter = router({
  getAll: protectedProcedure.input(subjectsInputSchema).query(({ input }) => {
    return getController().getAll(input)
  }),
})
