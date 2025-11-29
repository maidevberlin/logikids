import { AIClient } from './base';
import { OllamaClient } from './ollama';
import { OpenAIClient } from './openai';
import { AnthropicClient } from './anthropic';
import { getConfig } from '../../config';
import { ConfigurationError, UnsupportedProviderError } from '../errors';

export async function createAIClient(): Promise<AIClient> {
  const aiConfig = await getConfig('ai');

  if (!aiConfig) {
    throw new ConfigurationError('No configuration found for AI');
  }

  // Config is validated via Zod refinement, so provider-specific config is guaranteed to exist
  switch (aiConfig.provider) {
    case 'ollama':
      return new OllamaClient(aiConfig.ollama!);

    case 'openai':
      return new OpenAIClient(aiConfig.openai!);

    case 'anthropic':
      return new AnthropicClient(aiConfig.anthropic!);

    default:
      throw new UnsupportedProviderError(aiConfig.provider);
  }
} 