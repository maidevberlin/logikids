import { z } from 'zod'

/**
 * API keys are loaded from environment variables, not config.yaml.
 * This keeps secrets out of config files entirely.
 */
export function getApiKey(provider: 'openai' | 'anthropic'): string {
  const envVar = provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'
  const key = process.env[envVar]

  if (!key) {
    throw new Error(
      `Missing ${envVar} environment variable. ` + `Set it in .env or run ./setup.sh to configure.`
    )
  }

  return key
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
