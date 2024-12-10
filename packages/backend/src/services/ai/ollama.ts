import { OllamaConfig } from '../../config/ai';
import { AIClient, GenerateOptions, GenerateResponse } from './base';

export class OllamaClient extends AIClient {
  constructor(private config: OllamaConfig) {
    super('ollama', config.model);
  }

  async generate(prompt: string, options: GenerateOptions = {}): Promise<GenerateResponse> {
    try {
      const response = await fetch(`${this.config.host}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          prompt,
          stream: false,
          temperature: options.temperature ?? this.config.temperature,
          top_k: options.topK ?? this.config.top_k,
          top_p: options.topP ?? this.config.top_p,
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