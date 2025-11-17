import { z } from 'zod';

const ollamaSchema = z.object({
  host: z.string(),
  model: z.string(),
  temperature: z.number().optional(),
  top_k: z.number().optional(),
  top_p: z.number().optional(),
});

const openaiSchema = z.object({
  apiKey: z.string(),
  model: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  topP: z.number().optional(),
});

const anthropicSchema = z.object({
  apiKey: z.string(),
  model: z.string(),
  maxTokens: z.number().optional(),
  temperature: z.number().optional(),
});

export const aiConfigSchema = z.object({
  provider: z.enum(['ollama', 'openai', 'anthropic']),
  ollama: ollamaSchema.optional(),
  openai: openaiSchema.optional(),
  anthropic: anthropicSchema.optional(),
}).refine(
  (config) => {
    // Ensure provider-specific config is present when provider is selected
    if (config.provider === 'ollama' && !config.ollama) {
      return false;
    }
    if (config.provider === 'openai' && !config.openai) {
      return false;
    }
    if (config.provider === 'anthropic' && !config.anthropic) {
      return false;
    }
    return true;
  },
  (config) => ({
    message: `${config.provider.charAt(0).toUpperCase() + config.provider.slice(1)} configuration is required when using ${config.provider.charAt(0).toUpperCase() + config.provider.slice(1)} provider`,
    path: [config.provider],
  })
);

// Infer types from schemas (single source of truth)
export type OllamaConfig = z.infer<typeof ollamaSchema>;
export type OpenAIConfig = z.infer<typeof openaiSchema>;
export type AnthropicConfig = z.infer<typeof anthropicSchema>;
export type AIConfig = z.infer<typeof aiConfigSchema>;
export type AIProvider = AIConfig['provider'];

// Default configuration
export const defaultConfig: AIConfig = {
    provider: 'ollama',
    ollama: {
      host: 'http://host.docker.internal:11434',
      model: 'llama2',
    }
}; 