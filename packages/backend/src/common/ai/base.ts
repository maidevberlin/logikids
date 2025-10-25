export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

export interface GenerateResponse {
  response: string;
  context?: unknown;
  provider: 'ollama' | 'openai' | 'anthropic';
  model: string;
}

// JSON Schema type (standard JSON Schema format)
export type JSONSchema = Record<string, unknown>;

export abstract class AIClient {
  constructor(
    public readonly provider: 'ollama' | 'openai' | 'anthropic',
    public readonly model: string
  ) {}

  abstract generate(prompt: string, options?: GenerateOptions): Promise<GenerateResponse>;

  /**
   * Generate structured output that conforms to a JSON Schema
   * @param prompt The prompt to send to the AI
   * @param schema JSON Schema definition
   * @param options Optional generation parameters
   * @returns The validated and parsed response object
   */
  abstract generateStructured<T = unknown>(
    prompt: string,
    schema: JSONSchema,
    options?: GenerateOptions
  ): Promise<T>;
} 