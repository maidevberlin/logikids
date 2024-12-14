import { z } from 'zod';

export type AIProvider = 'ollama' | 'openai';

export interface OllamaConfig {
  host: string;
  model: string;
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

export interface AIConfig {
  provider: AIProvider;
  ollama?: OllamaConfig;
  openai?: OpenAIConfig;
}

const ollamaSchema = z.object({
  host: z.string(),
  model: z.string(),
});

const openaiSchema = z.object({
  apiKey: z.string(),
  model: z.string(),
});

export const aiConfigSchema = z.object({
  provider: z.enum(['ollama', 'openai']),
  ollama: ollamaSchema.optional(),
  openai: openaiSchema.optional(),
});

// Default configuration
export const defaultConfig: AIConfig = {
    provider: 'ollama',
    ollama: {
      host: 'http://host.docker.internal:11434',
      model: 'llama2',
    }
}; 