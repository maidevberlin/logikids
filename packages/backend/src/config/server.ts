import { z } from 'zod'

export const serverConfigSchema = z.object({
  port: z.number(),
})

// Infer type from schema (single source of truth)
export type ServerConfig = z.infer<typeof serverConfigSchema>

/**
 * Load server configuration from environment variables
 */
export function loadServerConfigFromEnv(): ServerConfig {
  const port = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000

  if (isNaN(port)) {
    throw new Error(`Invalid SERVER_PORT environment variable: ${process.env.SERVER_PORT}`)
  }

  return { port }
}
