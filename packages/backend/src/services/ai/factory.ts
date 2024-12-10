import { AIClient } from './base';
import { OllamaClient } from './ollama';
import { OpenAIClient } from './openai';
import { getConfig } from '../../config';

export async function createAIClient(): Promise<AIClient> {
  const aiConfig = await getConfig('ai');
  
  switch (aiConfig.provider) {
    case 'ollama':
      if (!aiConfig.ollama) {
        throw new Error('Ollama configuration is required when using Ollama provider');
      }
      return new OllamaClient(aiConfig.ollama);
      
    case 'openai':
      if (!aiConfig.openai) {
        throw new Error('OpenAI configuration is required when using OpenAI provider');
      }
      return new OpenAIClient(aiConfig.openai);
      
    default:
      throw new Error(`Unsupported AI provider: ${aiConfig.provider}`);
  }
} 