import { z } from 'zod';

export type AIProvider = 'ollama' | 'openai';

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

export interface AIConfig {
  provider: AIProvider;
  ollama?: OllamaConfig;
  openai?: OpenAIConfig;
}

export const aiConfigSchema = z.object({
  provider: z.enum(['ollama', 'openai']),
  ollama: z.object({
    host: z.string(),
    model: z.string(),
    temperature: z.number().optional(),
    top_k: z.number().optional(),
    top_p: z.number().optional(),
  }).optional(),
  openai: z.object({
    apiKey: z.string(),
    model: z.string(),
    temperature: z.number().optional(),
    maxTokens: z.number().optional(),
    topP: z.number().optional(),
  }).optional(),
});

// Default configuration
export const defaultConfig: AIConfig = {
  provider: 'ollama',
  ollama: {
    host: 'http://host.docker.internal:11434',
    model: 'llama2',
    temperature: 0.7,
  }
}; 