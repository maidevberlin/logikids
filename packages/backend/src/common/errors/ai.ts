import { ApplicationError } from './base';

/**
 * Thrown when AI provider returns an empty or invalid response
 *
 * @example
 * ```typescript
 * if (!response.choices?.[0]?.message?.content) {
 *   throw new EmptyAIResponseError('OpenAI');
 * }
 * ```
 */
export class EmptyAIResponseError extends ApplicationError {
  constructor(provider?: string) {
    const message = provider
      ? `${provider} returned empty response`
      : 'AI provider returned empty response';
    super(message, 500, 'EMPTY_AI_RESPONSE');
  }
}

/**
 * Thrown when AI provider API returns an error
 *
 * @example
 * ```typescript
 * if (!response.ok) {
 *   throw new AIProviderError('Ollama', response.statusText);
 * }
 * ```
 */
export class AIProviderError extends ApplicationError {
  constructor(provider: string, details: string, public readonly cause?: unknown) {
    super(`${provider} API error: ${details}`, 500, 'AI_PROVIDER_ERROR');
  }
}

/**
 * Thrown when AI generation fails generally
 *
 * @example
 * ```typescript
 * try {
 *   return await ollama.generate(prompt);
 * } catch (err) {
 *   throw new AIGenerationError('Failed to generate completion using Ollama', err);
 * }
 * ```
 */
export class AIGenerationError extends ApplicationError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, 500, 'AI_GENERATION_ERROR');
  }
}

/**
 * Thrown when AI does not return expected tool use response
 *
 * @example
 * ```typescript
 * if (content[0]?.type !== 'tool_use') {
 *   throw new NoToolUseError('Anthropic');
 * }
 * ```
 */
export class NoToolUseError extends ApplicationError {
  constructor(provider?: string) {
    const message = provider
      ? `${provider} did not return a tool use response`
      : 'AI did not return a tool use response';
    super(message, 500, 'NO_TOOL_USE');
  }
}
