import { OpenAI } from 'openai';
import { OpenAIConfig } from '../../config/ai';
import { AIClient, GenerateOptions, GenerateResponse, JSONSchema } from './base';

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
      console.error('[OpenAI] Error:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async generateStructured<T = unknown>(
    prompt: string,
    schema: JSONSchema,
    options?: GenerateOptions
  ): Promise<T> {
    const config = this.config as OpenAIConfig;
    const startTime = Date.now();

    console.log('[OpenAI] Starting structured generation...');
    console.log('[OpenAI] Model:', config.model);
    console.log('[OpenAI] Prompt length:', prompt.length, 'chars');

    try {
      console.log('[OpenAI] Calling OpenAI API with structured output...');
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
      console.log(`[OpenAI] API call completed in ${duration}ms`);

      const responseContent = completion.choices[0]?.message?.content;

      if (!responseContent) {
        throw new Error('OpenAI returned empty response');
      }

      console.log('[OpenAI] Response length:', responseContent.length, 'chars');

      // Parse JSON - OpenAI's structured outputs guarantee schema compliance
      const parsed = JSON.parse(responseContent);

      console.log('[OpenAI] Successfully parsed structured response');

      return parsed as T;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[OpenAI] Error after ${duration}ms:`, error instanceof Error ? error.message : 'Unknown error');
      if (error instanceof Error) {
        console.error('[OpenAI] Error stack:', error.stack);
      }
      throw error;
    }
  }
} 
