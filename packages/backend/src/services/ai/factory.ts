import { AIConfig } from '../../config/ai';
import { AIClient } from './base';
import { OllamaClient } from './ollama';
import { OpenAIClient } from './openai';

export class AIClientFactory {
  static create(config: AIConfig): AIClient {
    switch (config.provider) {
      case 'ollama':
        if (!config.ollama) {
          throw new Error('Ollama configuration is required when using Ollama provider');
        }
        return new OllamaClient(config.ollama);
      
      case 'openai':
        if (!config.openai) {
          throw new Error('OpenAI configuration is required when using OpenAI provider');
        }
        return new OpenAIClient(config.openai);
      
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }
} 