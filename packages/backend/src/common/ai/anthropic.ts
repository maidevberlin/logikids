import Anthropic from '@anthropic-ai/sdk';
import { AnthropicConfig } from '../../config/ai';
import { AIClient, GenerateOptions, GenerateResponse, JSONSchema } from './base';

export class AnthropicClient extends AIClient {
  private client: Anthropic;

  constructor(private config: AnthropicConfig) {
    super('anthropic', config.model);

    const key = config.apiKey;
    console.log('[AnthropicClient] Initializing with API key:', key.substring(0, 10) + '...' + key.substring(key.length - 4));
    console.log('[AnthropicClient] Model:', config.model);
    console.log('[AnthropicClient] Max tokens:', config.maxTokens);
    console.log('[AnthropicClient] Temperature:', config.temperature);

    this.client = new Anthropic({
      apiKey: config.apiKey,
    });

    console.log('[AnthropicClient] Client initialized successfully');
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<GenerateResponse> {
    const config = this.config as AnthropicConfig;
    const startTime = Date.now();

    console.log('[Anthropic] Starting API call...');
    console.log('[Anthropic] Model:', config.model);
    console.log('[Anthropic] Prompt length:', prompt.length, 'chars');

    try {
      console.log('[Anthropic] Calling Anthropic API...');
      const message = await this.client.messages.create({
        model: config.model,
        max_tokens: config.maxTokens || 4096,
        temperature: config.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const duration = Date.now() - startTime;
      console.log(`[Anthropic] API call completed in ${duration}ms`);
      console.log('[Anthropic] Model used:', message.model);
      console.log('[Anthropic] Tokens - Input:', message.usage.input_tokens, 'Output:', message.usage.output_tokens);

      const response = message.content[0]?.type === 'text' ? message.content[0].text : '';

      if (!response) {
        throw new Error('Anthropic returned empty response');
      }

      console.log('[Anthropic] Response length:', response.length, 'chars');

      return {
        response,
        provider: this.provider,
        model: message.model
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[Anthropic] Error after ${duration}ms:`, error instanceof Error ? error.message : 'Unknown error');
      if (error instanceof Error) {
        console.error('[Anthropic] Error stack:', error.stack);
      }
      throw error;
    }
  }

  async generateStructured<T = unknown>(
    prompt: string,
    schema: JSONSchema,
    options?: GenerateOptions
  ): Promise<T> {
    const config = this.config as AnthropicConfig;
    const startTime = Date.now();

    console.log('[Anthropic] Starting structured generation...');
    console.log('[Anthropic] Model:', config.model);
    console.log('[Anthropic] Prompt length:', prompt.length, 'chars');

    try {
      console.log('[Anthropic] Calling Anthropic API with tool use pattern...');

      // Use tool calling pattern for structured output
      // Claude will call this tool with properly formatted JSON
      const message = await this.client.messages.create({
        model: config.model,
        max_tokens: options?.maxTokens ?? config.maxTokens ?? 4096,
        temperature: options?.temperature ?? config.temperature ?? 0.7,
        tools: [
          {
            name: 'provide_response',
            description: 'Provide the response in structured format',
            input_schema: schema as Anthropic.Tool.InputSchema
          }
        ],
        tool_choice: { type: 'tool', name: 'provide_response' },
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const duration = Date.now() - startTime;
      console.log(`[Anthropic] API call completed in ${duration}ms`);
      console.log('[Anthropic] Tokens - Input:', message.usage.input_tokens, 'Output:', message.usage.output_tokens);

      // Extract the tool use from the response
      const toolUse = message.content.find(
        (block): block is Anthropic.Messages.ToolUseBlock => block.type === 'tool_use'
      );

      if (!toolUse) {
        throw new Error('Anthropic did not return a tool use response');
      }

      console.log('[Anthropic] Successfully received tool use response');

      // The tool input is validated by Anthropic's API to match our schema
      return toolUse.input as T;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[Anthropic] Error after ${duration}ms:`, error instanceof Error ? error.message : 'Unknown error');
      if (error instanceof Error) {
        console.error('[Anthropic] Error stack:', error.stack);
      }
      throw error;
    }
  }
}
