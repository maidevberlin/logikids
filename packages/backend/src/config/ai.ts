import { z } from 'zod';

export type AIProvider = 'ollama' | 'openai';

export interface OllamaTextConfig {
  host: string;
  model: string;
  temperature?: number;
  top_k?: number;
  top_p?: number;
}

export interface OllamaImageConfig {
  host: string;
  model: string;
  temperature?: number;
  top_k?: number;
  top_p?: number;
}

export interface OpenAITextConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface OpenAIImageConfig {
  apiKey: string;
  model: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'natural' | 'vivid';
}

export interface TextConfig {
  provider: AIProvider;
  ollama?: OllamaTextConfig;
  openai?: OpenAITextConfig;
}

export interface ImageConfig {
  provider: AIProvider;
  ollama?: OllamaImageConfig;
  openai?: OpenAIImageConfig;
}

export interface AIConfig {
  text: TextConfig;
  image: ImageConfig;
}

const ollamaTextSchema = z.object({
  host: z.string(),
  model: z.string(),
  temperature: z.number().optional(),
  top_k: z.number().optional(),
  top_p: z.number().optional(),
});

const ollamaImageSchema = z.object({
  host: z.string(),
  model: z.string(),
  temperature: z.number().optional(),
  top_k: z.number().optional(),
  top_p: z.number().optional(),
});

const openaiTextSchema = z.object({
  apiKey: z.string(),
  model: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  topP: z.number().optional(),
});

const openaiImageSchema = z.object({
  apiKey: z.string(),
  model: z.string(),
  size: z.enum(['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792']).optional(),
  quality: z.enum(['standard', 'hd']).optional(),
  style: z.enum(['natural', 'vivid']).optional(),
});

const configSchema = z.object({
  provider: z.enum(['ollama', 'openai']),
  ollama: z.object({}).optional(),
  openai: z.object({}).optional(),
});

export const aiConfigSchema = z.object({
  text: configSchema.extend({
    ollama: ollamaTextSchema.optional(),
    openai: openaiTextSchema.optional(),
  }),
  image: configSchema.extend({
    ollama: ollamaImageSchema.optional(),
    openai: openaiImageSchema.optional(),
  }),
});

// Default configuration
export const defaultConfig: AIConfig = {
  text: {
    provider: 'ollama',
    ollama: {
      host: 'http://host.docker.internal:11434',
      model: 'llama2',
      temperature: 0.7,
    }
  },
  image: {
    provider: 'openai',
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'dall-e-3',
      size: '1024x1024',
      quality: 'standard',
      style: 'natural',
    }
  }
}; 