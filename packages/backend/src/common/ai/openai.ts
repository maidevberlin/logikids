import { OpenAI } from 'openai';
import { OpenAIConfig } from '../../config/ai';
import { AIClient, GenerateOptions, GenerateResponse } from './base';

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

      return {
        response: completion.choices[0]?.message?.content || '',
        provider: this.provider,
        model: this.model
      };
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw new Error('Failed to generate completion using OpenAI');
    }
  }
} 