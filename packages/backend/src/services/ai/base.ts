export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

export interface GenerateResponse {
  response: string;
  context?: unknown;
}

export abstract class AIClient {
  abstract generate(prompt: string, options?: GenerateOptions): Promise<GenerateResponse>;

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