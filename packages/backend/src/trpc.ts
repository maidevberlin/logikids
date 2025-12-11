import { initTRPC, TRPCError } from '@trpc/server'
import * as Sentry from '@sentry/bun'
import jwt from 'jsonwebtoken'
import { env } from './config/env'
import { AppError } from './common/errors'

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
 * Error handling middleware
 * Catches AppError and converts to appropriate TRPCError codes
 * All other errors are treated as internal server errors
 */
const errorHandlingMiddleware = t.middleware(async ({ next }) => {
  try {
    return await next()
  } catch (error) {
    // If it's already a TRPCError, just re-throw it
    if (error instanceof TRPCError) {
      throw error
    }

    // Handle AppError - map statusCode to tRPC error codes
    if (error instanceof AppError) {
      const codeMap: Record<number, TRPCError['code']> = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        500: 'INTERNAL_SERVER_ERROR',
      }

      const code = codeMap[error.statusCode] || 'INTERNAL_SERVER_ERROR'

      throw new TRPCError({
        code,
        message: error.message,
        cause: error.cause,
      })
    }

    // Handle plain Error - treat as internal error
    if (error instanceof Error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
        cause: error,
      })
    }

    // Unknown error type
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      cause: error,
    })
  }
})

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router

/**
 * Base procedure with Sentry error tracking and error handling
 */
export const publicProcedure = t.procedure.use(sentryMiddleware).use(errorHandlingMiddleware)

/**
 * Protected procedure - requires authentication + Sentry tracking + error handling
 */
export const protectedProcedure = t.procedure
  .use(sentryMiddleware)
  .use(errorHandlingMiddleware)
  .use(async ({ ctx, next }) => {
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
