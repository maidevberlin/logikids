import { z } from 'zod';

export type AIProvider = 'ollama' | 'openai' | 'anthropic';

export interface OllamaConfig {
  host: string;
  model: string;
  temperature?: number;
  top_k?: number;
  top_p?: number;
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
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
});

// Default configuration
export const defaultConfig: AIConfig = {
    provider: 'ollama',
    ollama: {
      host: 'http://host.docker.internal:11434',
      model: 'llama2',
    }
}; 