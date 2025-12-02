import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './router'
import { createContext } from './trpc'
import { errorHandler } from './common/middleware/errorHandler'
import { cacheCleanupService } from './cache/cacheCleanup'
import { subjectRegistry } from './subjects/registry'
import { taskTypeRegistry } from './tasks/task-types'
import { initializeDatabase, closeDatabase } from '../database/db'
import { initializeContainer } from './container'
import { createLogger } from './common/logger'

const logger = createLogger('Server')

// Load configuration
const configPath = path.join(__dirname, '../config.yaml')
const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as Record<string, any>

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

const app = express()
app.use(cors())
app.use(express.json())

// Mount tRPC handler
app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
)

// Error handling (for non-tRPC routes if any)
app.use(errorHandler)

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
  const port = config.server?.port || 3000

  // Initialize all services before starting server
  await initializeServices()

  app.listen(port, () => {
    logger.debug(`Server running on port ${port}`)
  })
}

export type { AppRouter } from './router.ts'
