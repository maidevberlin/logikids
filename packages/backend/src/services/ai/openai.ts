import { OpenAI } from 'openai';
import { OpenAIConfig } from '../../config/ai';
import { AIClient, GenerateOptions, GenerateResponse } from './base';

export class OpenAIClient extends AIClient {
  private client: OpenAI;

  constructor(private config: OpenAIConfig) {
    super();
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<GenerateResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? this.config.temperature,
        max_tokens: options?.maxTokens ?? this.config.maxTokens,
        top_p: options?.topP ?? this.config.topP,
      });

      return {
        response: completion.choices[0]?.message?.content || '',
      };
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw new Error('Failed to generate completion using OpenAI');
    }
  }
} 