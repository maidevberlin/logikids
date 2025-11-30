import 'reflect-metadata'
import { container } from 'tsyringe'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { registerSchema, loginSchema, refreshSchema } from './schemas'
import { AuthController } from './controller'

const getController = () => container.resolve(AuthController)

export const authRouter = router({
  register: publicProcedure.input(registerSchema).mutation(async ({ input }) => {
    return getController().register(input)
  }),

  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    return getController().login(input)
  }),

  refresh: publicProcedure.input(refreshSchema).mutation(async ({ input }) => {
    return getController().refresh(input)
  }),

  verify: protectedProcedure.query(async ({ ctx }) => {
    return getController().verify(ctx.userId)
  }),

  getAccount: protectedProcedure.query(async ({ ctx }) => {
    return getController().getAccount(ctx.userId)
  }),
})
