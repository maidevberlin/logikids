import { initTRPC, TRPCError } from '@trpc/server'
import * as Sentry from '@sentry/bun'
import jwt from 'jsonwebtoken'
import { env } from './config/env'

const JWT_SECRET = env.JWT_SECRET

interface CreateContextOptions {
  req: Request
}

/**
 * Create context for each request
 */
export async function createContext({ req }: CreateContextOptions) {
  // Extract userId from JWT token if present
  let userId: string | undefined

  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
      userId = decoded.userId
    } catch (error) {
      // Invalid token, userId remains undefined
    }
  }

  return {
    req,
    userId,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().create()

/**
 * Sentry middleware for error tracking
 */
const sentryMiddleware = t.middleware(
  Sentry.trpcMiddleware({
    attachRpcInput: true,
  })
)

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router

/**
 * Base procedure with Sentry error tracking
 */
export const publicProcedure = t.procedure.use(sentryMiddleware)

/**
 * Protected procedure - requires authentication + Sentry tracking
 */
export const protectedProcedure = t.procedure.use(sentryMiddleware).use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId, // Now guaranteed to be defined
    },
  })
})
