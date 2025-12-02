import { z } from 'zod'

/**
 * All AI configuration is loaded from environment variables.
 * This keeps all configuration in one place (.env file).
 */
export function getApiKey(provider: 'openai' | 'anthropic'): string {
  const envVar = provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'
  const key = process.env[envVar]

  if (!key) {
    throw new Error(
      `Missing ${envVar} environment variable. ` +
        `Set it in .env or run ./install.sh to configure.`
    )
  }

  return key
}

function getEnvString(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value || defaultValue!
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key]
  if (!value) return defaultValue
  const num = Number(value)
  if (isNaN(num)) {
    throw new Error(`Invalid number for environment variable ${key}: ${value}`)
  }
  return num
}

const ollamaSchema = z.object({
  host: z.string(),
  model: z.string(),
  temperature: z.number().optional(),
  top_k: z.number().optional(),
  top_p: z.number().optional(),
})

// Note: apiKey is optional in schema because it comes from env vars
const openaiSchema = z.object({
  apiKey: z.string().optional(), // Ignored - loaded from OPENAI_API_KEY env var
  model: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  topP: z.number().optional(),
})

// Note: apiKey is optional in schema because it comes from env vars
const anthropicSchema = z.object({
  apiKey: z.string().optional(), // Ignored - loaded from ANTHROPIC_API_KEY env var
  model: z.string(),
  maxTokens: z.number().optional(),
  temperature: z.number().optional(),
})

export const aiConfigSchema = z
  .object({
    provider: z.enum(['ollama', 'openai', 'anthropic']),
    ollama: ollamaSchema.optional(),
    openai: openaiSchema.optional(),
    anthropic: anthropicSchema.optional(),
  })
  .refine(
    (config) => {
      // Ensure provider-specific config is present when provider is selected
      if (config.provider === 'ollama' && !config.ollama) {
        return false
      }
      if (config.provider === 'openai' && !config.openai) {
        return false
      }
      return !(config.provider === 'anthropic' && !config.anthropic)
    },
    (config) => ({
      message: `${config.provider.charAt(0).toUpperCase() + config.provider.slice(1)} configuration is required when using ${config.provider.charAt(0).toUpperCase() + config.provider.slice(1)} provider`,
      path: [config.provider],
    })
  )

// Infer types from schemas (single source of truth)
export type OllamaConfig = z.infer<typeof ollamaSchema>
export type OpenAIConfig = z.infer<typeof openaiSchema>
export type AnthropicConfig = z.infer<typeof anthropicSchema>
export type AIConfig = z.infer<typeof aiConfigSchema>

// Default configuration
export const defaultConfig: AIConfig = {
  provider: 'ollama',
  ollama: {
    host: 'http://host.docker.internal:11434',
    model: 'llama2',
  },
}

/**
 * Load AI configuration from environment variables
 */
export function loadAIConfigFromEnv(): AIConfig {
  const provider = getEnvString('AI_PROVIDER', 'ollama') as 'ollama' | 'openai' | 'anthropic'

  const config: AIConfig = {
    provider,
  }

  switch (provider) {
    case 'ollama':
      config.ollama = {
        host: getEnvString('OLLAMA_HOST', 'http://host.docker.internal:11434'),
        model: getEnvString('OLLAMA_MODEL', 'llama2'),
        temperature: getEnvNumber('OLLAMA_TEMPERATURE', 0.7),
        top_k: process.env.OLLAMA_TOP_K ? getEnvNumber('OLLAMA_TOP_K', 40) : undefined,
        top_p: process.env.OLLAMA_TOP_P ? getEnvNumber('OLLAMA_TOP_P', 0.9) : undefined,
      }
      break

    case 'openai':
      config.openai = {
        model: getEnvString('OPENAI_MODEL', 'gpt-4o'),
        temperature: process.env.OPENAI_TEMPERATURE
          ? getEnvNumber('OPENAI_TEMPERATURE', 0.7)
          : undefined,
        maxTokens: process.env.OPENAI_MAX_TOKENS
          ? getEnvNumber('OPENAI_MAX_TOKENS', 4096)
          : undefined,
        topP: process.env.OPENAI_TOP_P ? getEnvNumber('OPENAI_TOP_P', 1.0) : undefined,
      }
      break

    case 'anthropic':
      config.anthropic = {
        model: getEnvString('ANTHROPIC_MODEL', 'claude-sonnet-4-5'),
        maxTokens: getEnvNumber('ANTHROPIC_MAX_TOKENS', 4096),
        temperature: getEnvNumber('ANTHROPIC_TEMPERATURE', 0.7),
      }
      break
  }

  // Validate the configuration
  return aiConfigSchema.parse(config)
}
