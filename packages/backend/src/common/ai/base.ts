import { CostTrackingContext } from './cost-tracker';

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  costTracking?: CostTrackingContext;
}

export interface UsageInfo {
  inputTokens: number;
  outputTokens: number;
  totalTokens?: number;
  cost?: number; // Cost in USD
}

export interface GenerateResponse {
  response: string;
  /** Ollama-specific conversation context for multi-turn conversations */
  context?: number[];
  provider: 'ollama' | 'openai' | 'anthropic';
  model: string;
  usage?: UsageInfo;
}

export interface StructuredGenerateResponse<T> {
  result: T;
  usage?: UsageInfo;
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
   * @returns Object containing the validated response and usage information
   */
  abstract generateStructured<T = unknown>(
    prompt: string,
    schema: JSONSchema,
    options?: GenerateOptions
  ): Promise<StructuredGenerateResponse<T>>;
} 