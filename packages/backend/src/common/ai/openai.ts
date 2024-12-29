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
    const startTime = Date.now();
    
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
        model: this.model
      };
    } catch (error) {
      console.error('[OpenAI] Error:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
} 