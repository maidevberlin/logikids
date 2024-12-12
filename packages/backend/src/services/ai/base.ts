export interface TextGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

export interface ImageGenerateOptions {
  size?: string;
  quality?: string;
  style?: string;
}

export interface TextGenerateResponse {
  response: string;
  context?: unknown;
  provider: 'ollama' | 'openai';
  model: string;
}

export interface ImageGenerateResponse {
  url: string;
  provider: 'ollama' | 'openai';
  model: string;
}

export abstract class AIClient {
  constructor(
    public readonly provider: 'ollama' | 'openai',
    public readonly model: string,
    public readonly type: 'text' | 'image'
  ) {}

  abstract generateText(prompt: string, options?: TextGenerateOptions): Promise<TextGenerateResponse>;
  abstract generateImage(prompt: string, options?: ImageGenerateOptions): Promise<ImageGenerateResponse>;

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