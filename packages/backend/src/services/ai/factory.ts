import { AIClient } from './base';
import { OllamaClient } from './ollama';
import { OpenAIClient } from './openai';
import { getConfig } from '../../config';

export async function createAIClient(type: 'text' | 'image' = 'text'): Promise<AIClient> {
  const aiConfig = await getConfig('ai');
  const config = aiConfig[type];
  
  if (!config) {
    throw new Error(`No configuration found for AI type: ${type}`);
  }
  
  switch (config.provider) {
    case 'ollama':
      if (!config.ollama) {
        throw new Error('Ollama configuration is required when using Ollama provider');
      }
      return new OllamaClient(config.ollama, type);
      
    case 'openai':
      if (!config.openai) {
        throw new Error('OpenAI configuration is required when using OpenAI provider');
      }
      return new OpenAIClient(config.openai, type);
      
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
} 