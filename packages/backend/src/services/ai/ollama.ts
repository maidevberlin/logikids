import { OllamaTextConfig, OllamaImageConfig } from '../../config/ai';
import { AIClient, TextGenerateOptions, TextGenerateResponse, ImageGenerateOptions, ImageGenerateResponse } from './base';

export class OllamaClient extends AIClient {
  constructor(
    private config: OllamaTextConfig | OllamaImageConfig,
    type: 'text' | 'image'
  ) {
    super('ollama', config.model, type);
  }

  async generateText(prompt: string, options: TextGenerateOptions = {}): Promise<TextGenerateResponse> {
    if (this.type !== 'text') {
      throw new Error('This client is not configured for text generation');
    }

    const config = this.config as OllamaTextConfig;
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
          temperature: options.temperature ?? config.temperature,
          top_k: options.topK ?? config.top_k,
          top_p: options.topP ?? config.top_p,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        response: result.response,
        context: result.context,
        provider: this.provider,
        model: this.model
      };
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw new Error('Failed to generate completion using Ollama');
    }
  }

  async generateImage(prompt: string, _options?: ImageGenerateOptions): Promise<ImageGenerateResponse> {
    if (this.type !== 'image') {
      throw new Error('This client is not configured for image generation');
    }

    const config = this.config as OllamaImageConfig;
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
          format: 'base64',
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      // For Ollama, we get a base64 image back
      return {
        url: `data:image/jpeg;base64,${result.response}`,
        provider: this.provider,
        model: this.model
      };
    } catch (error) {
      console.error('Error calling Ollama for image generation:', error);
      throw new Error('Failed to generate image using Ollama');
    }
  }
} 