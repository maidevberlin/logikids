import { OpenAI } from 'openai';
import { OpenAITextConfig, OpenAIImageConfig } from '../../config/ai';
import { AIClient, TextGenerateOptions, TextGenerateResponse, ImageGenerateOptions, ImageGenerateResponse } from './base';

export class OpenAIClient extends AIClient {
  private client: OpenAI;

  constructor(
    private config: OpenAITextConfig | OpenAIImageConfig,
    type: 'text' | 'image'
  ) {
    super('openai', config.model, type);
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async generateText(prompt: string, options?: TextGenerateOptions): Promise<TextGenerateResponse> {
    if (this.type !== 'text') {
      throw new Error('This client is not configured for text generation');
    }

    const config = this.config as OpenAITextConfig;
    try {
      const completion = await this.client.chat.completions.create({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? config.temperature,
        max_tokens: options?.maxTokens ?? config.maxTokens,
        top_p: options?.topP ?? config.topP,
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

  async generateImage(prompt: string, options?: ImageGenerateOptions): Promise<ImageGenerateResponse> {
    if (this.type !== 'image') {
      throw new Error('This client is not configured for image generation');
    }

    const config = this.config as OpenAIImageConfig;
    try {
      const response = await this.client.images.generate({
        model: config.model,
        prompt,
        n: 1,
        size: (options?.size ?? config.size ?? '1024x1024') as '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792',
        quality: (options?.quality ?? config.quality ?? 'standard') as 'standard' | 'hd',
        style: (options?.style ?? config.style ?? 'natural') as 'natural' | 'vivid',
        response_format: 'url'
      });

      if (!response.data[0]?.url) {
        throw new Error('No image URL in response');
      }

      return {
        url: response.data[0].url,
        provider: this.provider,
        model: this.model
      };
    } catch (error) {
      console.error('Error calling OpenAI for image generation:', error);
      throw new Error('Failed to generate image using OpenAI');
    }
  }
} 