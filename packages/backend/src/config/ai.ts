import { z } from 'zod';

export type AIProvider = 'ollama' | 'openai' | 'anthropic';

export interface OllamaConfig {
  host: string;
  model: string;
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

export interface AnthropicConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIConfig {
  provider: AIProvider;
  ollama?: OllamaConfig;
  openai?: OpenAIConfig;
  anthropic?: AnthropicConfig;
}

const ollamaSchema = z.object({
  host: z.string(),
  model: z.string(),
});

const openaiSchema = z.object({
  apiKey: z.string(),
  model: z.string(),
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
});

// Default configuration
export const defaultConfig: AIConfig = {
    provider: 'ollama',
    ollama: {
      host: 'http://host.docker.internal:11434',
      model: 'llama2',
    }
}; 