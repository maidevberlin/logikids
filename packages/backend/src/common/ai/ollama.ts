import { OllamaConfig } from '../../config/ai';
import { AIClient, GenerateOptions, GenerateResponse, JSONSchema } from './base';

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

  async generateStructured<T = unknown>(
    prompt: string,
    schema: JSONSchema,
    options?: GenerateOptions
  ): Promise<T> {
    const config = this.config as OllamaConfig;
    const startTime = Date.now();

    console.log('[Ollama] Starting structured generation...');
    console.log('[Ollama] Model:', config.model);
    console.log('[Ollama] Prompt length:', prompt.length, 'chars');

    try {
      console.log('[Ollama] Calling Ollama API with JSON format...');

      const response = await fetch(`${config.host}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          prompt,
          stream: false,
          format: 'json', // Force JSON output
          options: {
            temperature: options?.temperature ?? config.temperature,
            top_k: options?.topK ?? config.top_k,
            top_p: options?.topP ?? config.top_p,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const result = await response.json();
      const duration = Date.now() - startTime;

      console.log(`[Ollama] API call completed in ${duration}ms`);
      console.log('[Ollama] Response length:', result.response.length, 'chars');

      // Parse JSON - Ollama doesn't guarantee schema compliance
      // We trust the schema is correct for now (no runtime validation)
      const parsed = JSON.parse(result.response);

      console.log('[Ollama] Successfully parsed JSON response');

      return parsed as T;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[Ollama] Error after ${duration}ms:`, error instanceof Error ? error.message : 'Unknown error');
      if (error instanceof Error) {
        console.error('[Ollama] Error stack:', error.stack);
      }
      throw error;
    }
  }
} 
