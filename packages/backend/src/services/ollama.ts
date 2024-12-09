import { OLLAMA_HOST } from '../config/models';

interface GenerateOptions {
  stream?: boolean;
  temperature?: number;
  top_k?: number;
  top_p?: number;
  context?: number[];
}

interface GenerateResponse {
  model: string;
  response: string;
  context?: number[];
}

export class OllamaClient {
  constructor(private baseUrl: string = OLLAMA_HOST) {}

  /**
   * Generates a completion using the Ollama API
   * @param model The model to use for generation
   * @param prompt The prompt to generate from
   * @param options Additional generation options
   * @returns The generated response
   */
  public async generate(
    model: string, 
    prompt: string, 
    options: GenerateOptions = { stream: false }
  ): Promise<GenerateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw new Error('Failed to generate completion using Ollama');
    }
  }

  /**
   * Extracts JSON from a text response if present
   * @param text The text to extract JSON from
   * @returns The parsed JSON object or null if no valid JSON found
   */
  public static extractJSON(text: string): unknown | null {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
} 