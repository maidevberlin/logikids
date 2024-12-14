import { OllamaConfig } from '../../config/ai';
import { AIClient, GenerateOptions, GenerateResponse } from './base';

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
} 
