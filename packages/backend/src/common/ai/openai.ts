import { OpenAI } from 'openai';
import { OpenAIConfig } from '../../config/ai';
import { AIClient, GenerateOptions, GenerateResponse, JSONSchema } from './base';
import { createLogger } from '../logger';
import { withErrorHandling } from './errorHandler';

const logger = createLogger('OpenAIClient');

export class OpenAIClient extends AIClient {
  private client: OpenAI;

  constructor(private config: OpenAIConfig) {
    super('openai', config.model);
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<GenerateResponse> {
    const config = this.config as OpenAIConfig;

    try {
      const completion = await this.client.chat.completions.create({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('OpenAI returned empty response');
      }

      return {
        response,
        provider: this.provider,
        model: completion.model
      };
    } catch (error) {
      logger.error('Error:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async generateStructured<T = unknown>(
    prompt: string,
    schema: JSONSchema,
    options?: GenerateOptions
  ): Promise<T> {
    const config = this.config as OpenAIConfig;

    logger.debug('Starting structured generation...', { model: config.model, promptLength: prompt.length });

    return withErrorHandling(
      async () => {
        logger.debug('Calling OpenAI API with structured output...');
        const startTime = Date.now();
        const completion = await this.client.chat.completions.create({
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'response',
              schema: schema,
              strict: true
            }
          },
          temperature: options?.temperature ?? config.temperature,
          max_tokens: options?.maxTokens ?? config.maxTokens,
          top_p: options?.topP ?? config.topP
        });

        const duration = Date.now() - startTime;
        logger.info('API call completed', { duration });

        const responseContent = completion.choices[0]?.message?.content;

        if (!responseContent) {
          throw new Error('OpenAI returned empty response');
        }

        logger.debug('Response received', { responseLength: responseContent.length });

        // Parse JSON - OpenAI's structured outputs guarantee schema compliance
        const parsed = JSON.parse(responseContent);

        logger.debug('Successfully parsed structured response');

        return parsed as T;
      },
      'OpenAI structured generation',
      logger
    );
  }
} 
