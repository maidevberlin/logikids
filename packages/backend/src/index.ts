import 'reflect-metadata'
import * as Sentry from '@sentry/bun'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './router'
import { createContext } from './trpc'
import { cacheCleanupService } from './cache/cacheCleanup'
import { subjectRegistry } from './subjects/registry'
import { taskTypeRegistry } from './tasks/task-types'
import { initializeDatabase, closeDatabase } from '../database/db'
import { initializeContainer } from './container'
import { createLogger } from './common/logger'
import { handleTTSRequest } from './tts'

// Initialize Sentry error tracking
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: true,
    environment: process.env.NODE_ENV || 'development',
  })
}

const logger = createLogger('Server')

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Initialize registries, database, and DI container before starting server
async function initializeServices() {
  logger.debug('Initializing registries, database, and DI container...')
  await Promise.all([
    subjectRegistry.initialize(),
    taskTypeRegistry.initialize(),
    initializeDatabase(),
  ])
  await initializeContainer()
  logger.debug('All services initialized')
}

// Start cache cleanup job
cacheCleanupService.start()

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.debug('SIGTERM received, shutting down gracefully...')
  cacheCleanupService.stop()
  await closeDatabase()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.debug('SIGINT received, shutting down gracefully...')
  cacheCleanupService.stop()
  await closeDatabase()
  process.exit(0)
})

// Start server (skip only if explicitly imported as module in tests)
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith(process.argv[1] || '') ||
  process.env.NODE_ENV === 'production'

if (isMainModule) {
  const port = 3000

  // Initialize all services before starting server
  await initializeServices()

  // Start Bun HTTP server with tRPC fetch adapter
  Bun.serve({
    port,
    idleTimeout: 120, // 120 seconds - needed for slow AI task generation (default is 10s since Bun 1.1.26)
    async fetch(req) {
      const url = new URL(req.url)

      // Handle CORS preflight for all routes
      if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders })
      }

      // Handle TTS requests (binary audio response)
      if (url.pathname === '/api/tts') {
        return handleTTSRequest(req)
      }

      // Handle tRPC requests
      if (url.pathname.startsWith('/api')) {
        logger.debug('tRPC request received', { path: url.pathname, method: req.method })

        try {
          const response = await fetchRequestHandler({
            endpoint: '/api',
            req,
            router: appRouter,
            createContext: () => createContext({ req }),
            responseMeta() {
              return {
                headers: corsHeaders,
              }
            },
            onError({ error }) {
              // Sentry captures errors via trpcMiddleware, but log them too
              logger.error('tRPC error', { error })
            },
          })

          // Read the response body to ensure Content-Length is set
          // This is needed because the fetch adapter returns a stream without Content-Length
          // which causes issues with HTTP/1.1 proxies (like Vite's dev proxy)
          const bodyText = await response.text()

          logger.debug('tRPC response', {
            status: response.status,
            contentType: response.headers.get('content-type'),
            bodyLength: bodyText.length,
            bodyPreview: bodyText.substring(0, 500),
          })

          // Create new response with explicit Content-Length
          const newHeaders = new Headers(response.headers)
          newHeaders.set('Content-Length', String(Buffer.byteLength(bodyText, 'utf-8')))

          return new Response(bodyText, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          })
        } catch (err) {
          logger.error('tRPC handler threw exception', { error: err })
          throw err
        }
      }

      // Not found for other routes
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    },
  })

  logger.debug(`Server running on port ${port}`)
}

export type { AppRouter } from './router.ts'
