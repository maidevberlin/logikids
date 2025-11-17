import { ApplicationError } from './base';

/**
 * Thrown when required configuration is missing or invalid
 *
 * @example
 * ```typescript
 * if (!config.ai) {
 *   throw new ConfigurationError('No AI configuration found');
 * }
 * ```
 */
export class ConfigurationError extends ApplicationError {
  constructor(message: string) {
    super(message, 500, 'CONFIGURATION_ERROR');
  }
}

/**
 * Thrown when an unsupported AI provider is requested
 *
 * @example
 * ```typescript
 * if (!['openai', 'anthropic', 'ollama'].includes(provider)) {
 *   throw new UnsupportedProviderError(provider);
 * }
 * ```
 */
export class UnsupportedProviderError extends ApplicationError {
  constructor(provider: string) {
    super(`Unsupported AI provider: ${provider}`, 500, 'UNSUPPORTED_PROVIDER');
  }
}
