import { OllamaConfig } from '../../config/ai';
import { AIClient, GenerateOptions, GenerateResponse, JSONSchema } from './base';
import { createLogger } from '../logger';
import { AIProviderError } from '../errors';
import { withErrorHandling } from './errorHandler';

const logger = createLogger('OllamaClient');

export class OllamaClient extends AIClient {
  constructor(private config: OllamaConfig) {
    super('ollama', config.model);
  }

  async generate(prompt: string, options: GenerateOptions = {}): Promise<GenerateResponse> {
    const config = this.config as OllamaConfig;
    try {
      const response = await fetch(`${config.host}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new AIProviderError('ollama', `Ollama API error: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        response: result.response,
        context: result.context,
        provider: this.provider,
        model: this.model
      };
    } catch (error) {
      logger.error('Error calling Ollama', error);
      throw new AIProviderError('ollama', 'Failed to generate completion using Ollama');
    }
  }

  async generateStructured<T = unknown>(
    prompt: string,
    schema: JSONSchema,
    options?: GenerateOptions
  ): Promise<T> {
    const config = this.config as OllamaConfig;

    logger.debug('Starting structured generation...', { model: config.model, promptLength: prompt.length });

    return withErrorHandling(
      async () => {
        logger.debug('Calling Ollama API with JSON format...');
        const startTime = Date.now();

        const response = await fetch(`${config.host}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: config.model,
            prompt,
            stream: false,
            format: 'json', // Force JSON output
            options: {
              temperature: options?.temperature ?? config.temperature,
              top_k: options?.topK ?? config.top_k,
              top_p: options?.topP ?? config.top_p,
            }
          }),
        });

        if (!response.ok) {
          throw new AIProviderError('ollama', `Ollama API error: ${response.statusText}`);
        }

        const result = await response.json();
        const duration = Date.now() - startTime;

        logger.info('API call completed', { duration, responseLength: result.response.length });

        // Parse JSON - Ollama doesn't guarantee schema compliance
        // We trust the schema is correct for now (no runtime validation)
        const parsed = JSON.parse(result.response);

        logger.debug('Successfully parsed JSON response');

        return parsed as T;
      },
      'Ollama structured generation',
      logger
    );
  }
} 
