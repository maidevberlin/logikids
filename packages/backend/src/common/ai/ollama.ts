import { OllamaConfig } from '../../config/ai'
import {
  AIClient,
  GenerateOptions,
  GenerateResponse,
  JSONSchema,
  StructuredGenerateResponse,
} from './base'
import { internalError } from '../errors'
import { withErrorHandling } from './errorHandler'
import { trackCost } from './cost-tracker'

/**
 * Response from Ollama /api/generate endpoint
 */
interface OllamaGenerateResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  // Token usage metrics
  prompt_eval_count?: number
  eval_count?: number
  // Timing metrics (nanoseconds)
  total_duration?: number
  load_duration?: number
  prompt_eval_duration?: number
  eval_duration?: number
}

export class OllamaClient extends AIClient {
  constructor(private config: OllamaConfig) {
    super('ollama', config.model)
  }

  async generate(prompt: string, options: GenerateOptions = {}): Promise<GenerateResponse> {
    const config = this.config as OllamaConfig

    return withErrorHandling(async () => {
      const startTime = Date.now()

      const response = await fetch(`${config.host}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          prompt,
          stream: false,
          options: {
            temperature: options?.temperature ?? config.temperature,
            top_k: options?.topK ?? config.top_k,
            top_p: options?.topP ?? config.top_p,
          },
        }),
      })

      if (!response.ok) {
        throw internalError(`Ollama API error: ${response.statusText}`)
      }

      const result = (await response.json()) as OllamaGenerateResponse

      if (!result.response) {
        throw internalError('Ollama returned empty response')
      }

      // Build usage info (Ollama is free, cost = 0)
      const usage =
        result.prompt_eval_count !== undefined && result.eval_count !== undefined
          ? {
              inputTokens: result.prompt_eval_count,
              outputTokens: result.eval_count,
              totalTokens: result.prompt_eval_count + result.eval_count,
              cost: 0, // Ollama runs locally, no API cost
            }
          : undefined

      // Track cost if context is provided (will be 0 for Ollama)
      if (options?.costTracking && usage) {
        await trackCost(options.costTracking, {
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          provider: this.provider,
          model: result.model,
        })
      }

      return {
        response: result.response,
        context: result.context,
        provider: this.provider,
        model: result.model,
        usage,
      }
    }, 'Ollama chat completion')
  }

  async generateStructured<T = unknown>(
    prompt: string,
    schema: JSONSchema,
    options?: GenerateOptions
  ): Promise<StructuredGenerateResponse<T>> {
    const config = this.config as OllamaConfig

    return withErrorHandling(async () => {
      const startTime = Date.now()

      // Ollama 0.5+ supports passing a JSON schema directly to the format parameter
      // This provides better structured output than the old format: 'json'
      const response = await fetch(`${config.host}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          prompt,
          stream: false,
          format: schema, // Pass the JSON schema directly (Ollama 0.5+)
          options: {
            temperature: options?.temperature ?? config.temperature ?? 0, // Lower temp for structured output
            top_k: options?.topK ?? config.top_k,
            top_p: options?.topP ?? config.top_p,
          },
        }),
      })

      if (!response.ok) {
        throw internalError(`Ollama API error: ${response.statusText}`)
      }

      const result = (await response.json()) as OllamaGenerateResponse

      if (!result.response) {
        throw internalError('Ollama returned empty response')
      }

      // Parse JSON - Ollama with schema format should produce valid JSON
      const parsed = JSON.parse(result.response)

      // Build usage info (Ollama is free, cost = 0)
      const usage =
        result.prompt_eval_count !== undefined && result.eval_count !== undefined
          ? {
              inputTokens: result.prompt_eval_count,
              outputTokens: result.eval_count,
              totalTokens: result.prompt_eval_count + result.eval_count,
              cost: 0, // Ollama runs locally, no API cost
            }
          : undefined

      // Track cost if context is provided (will be 0 for Ollama)
      if (options?.costTracking && usage) {
        await trackCost(options.costTracking, {
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          provider: this.provider,
          model: result.model,
        })
      }

      return {
        result: parsed as T,
        usage,
      }
    }, 'Ollama structured generation')
  }
}
