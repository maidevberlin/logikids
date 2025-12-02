import { z } from 'zod'
import { aiConfigSchema, loadAIConfigFromEnv } from './ai'
import { serverConfigSchema, loadServerConfigFromEnv } from './server'
import { createLogger } from '../common/logger'

const logger = createLogger('Config')

const configSchema = z.object({
  ai: aiConfigSchema,
  server: serverConfigSchema,
  // Add other configuration sections here as needed
})

// Infer type from schema (single source of truth)
export type Config = z.infer<typeof configSchema>

let cachedConfig: Config | null = null

/**
 * Load configuration from environment variables.
 * All configuration is now read from .env file.
 */
export async function loadConfig(): Promise<Config> {
  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig
  }

  try {
    logger.info('Loading configuration from environment variables')

    // Load each config section from env vars
    const config: Config = {
      ai: loadAIConfigFromEnv(),
      server: loadServerConfigFromEnv(),
    }

    // Validate the complete config
    const validated = configSchema.parse(config)

    // Cache the config
    cachedConfig = validated
    logger.info(`Configuration loaded successfully (AI provider: ${validated.ai.provider})`)
    return validated
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Error loading configuration from environment:', error.message)
      throw error
    } else {
      logger.error('Unknown error loading configuration')
      throw new Error('Failed to load configuration')
    }
  }
}

// Helper function to get a specific section of the config
export async function getConfig<K extends keyof Config>(section: K): Promise<Config[K]> {
  const config = await loadConfig()
  return config[section]
}
