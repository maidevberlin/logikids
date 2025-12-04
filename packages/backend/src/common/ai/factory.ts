import { AIClient } from './base'
import { OllamaClient } from './ollama'
import { OpenAIClient } from './openai'
import { AnthropicClient } from './anthropic'
import { getConfig } from '../../config'
import { getApiKey, OllamaConfig, OpenAIConfig, AnthropicConfig } from '../../config/ai'
import { ConfigurationError, UnsupportedProviderError } from '../errors'

export interface AIClientOverrides {
  provider?: 'ollama' | 'openai' | 'anthropic'
  model?: string
}

export async function createAIClient(overrides?: AIClientOverrides): Promise<AIClient> {
  const aiConfig = await getConfig('ai')

  if (!aiConfig) {
    throw new ConfigurationError('No configuration found for AI')
  }

  // Use override provider if specified, otherwise use config
  const provider = overrides?.provider ?? aiConfig.provider

  // Config is validated via Zod refinement, so provider-specific config is guaranteed to exist
  switch (provider) {
    case 'ollama': {
      const config: OllamaConfig = {
        ...aiConfig.ollama!,
        // Override model if specified
        model: overrides?.model ?? aiConfig.ollama?.model ?? 'llama2',
      }
      return new OllamaClient(config)
    }

    case 'openai': {
      // API key comes from environment, not config file
      const config: OpenAIConfig = {
        ...aiConfig.openai!,
        apiKey: getApiKey('openai'),
        // Override model if specified
        model: overrides?.model ?? aiConfig.openai?.model ?? 'gpt-5-mini',
      }
      return new OpenAIClient(config)
    }

    case 'anthropic': {
      // API key comes from environment, not config file
      const config: AnthropicConfig = {
        ...aiConfig.anthropic!,
        apiKey: getApiKey('anthropic'),
        // Override model if specified
        model: overrides?.model ?? aiConfig.anthropic?.model ?? 'claude-sonnet-4-5-20250929',
      }
      return new AnthropicClient(config)
    }

    default:
      throw new UnsupportedProviderError(provider)
  }
}
