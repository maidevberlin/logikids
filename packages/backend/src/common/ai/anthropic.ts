import Anthropic from '@anthropic-ai/sdk'
import { AnthropicConfig } from '../../config/ai'
import {
  AIClient,
  GenerateOptions,
  GenerateResponse,
  JSONSchema,
  StructuredGenerateResponse,
} from './base'
import { withErrorHandling } from './errorHandler'
import { trackCost, calculateCost } from './cost-tracker'
import { internalError } from '../errors'

export class AnthropicClient extends AIClient {
  private client: Anthropic

  constructor(private config: AnthropicConfig) {
    super('anthropic', config.model)
    this.client = new Anthropic({
      apiKey: config.apiKey,
    })
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<GenerateResponse> {
    const config = this.config as AnthropicConfig

    return withErrorHandling(async () => {
      const startTime = Date.now()
      const message = await this.client.messages.create({
        model: config.model,
        max_tokens: config.maxTokens || 4096,
        temperature: config.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const response = message.content[0]?.type === 'text' ? message.content[0].text : ''

      if (!response) {
        throw internalError('Anthropic returned empty response')
      }

      // Track cost if context is provided
      if (options?.costTracking) {
        await trackCost(options.costTracking, {
          inputTokens: message.usage.input_tokens,
          outputTokens: message.usage.output_tokens,
          provider: this.provider,
          model: message.model,
        })
      }

      return {
        response,
        provider: this.provider,
        model: message.model,
      }
    }, 'Anthropic chat completion')
  }

  async generateStructured<T = unknown>(
    prompt: string,
    schema: JSONSchema,
    options?: GenerateOptions
  ): Promise<StructuredGenerateResponse<T>> {
    const config = this.config as AnthropicConfig

    return withErrorHandling(async () => {
      const startTime = Date.now()

      // Use tool calling pattern for structured output
      // Claude will call this tool with properly formatted JSON
      const message = await this.client.messages.create({
        model: config.model,
        max_tokens: options?.maxTokens ?? config.maxTokens ?? 4096,
        temperature: options?.temperature ?? config.temperature ?? 0.7,
        tools: [
          {
            name: 'provide_response',
            description: 'Provide the response in structured format',
            input_schema: schema as Anthropic.Tool.InputSchema,
          },
        ],
        tool_choice: { type: 'tool', name: 'provide_response' },
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      // Extract the tool use from the response
      const toolUse = message.content.find(
        (block): block is Anthropic.Messages.ToolUseBlock => block.type === 'tool_use'
      )

      if (!toolUse) {
        throw internalError('Anthropic did not return tool use response')
      }

      // Track cost if context is provided
      if (options?.costTracking) {
        await trackCost(options.costTracking, {
          inputTokens: message.usage.input_tokens,
          outputTokens: message.usage.output_tokens,
          provider: this.provider,
          model: message.model,
        })
      }

      // The tool input is validated by Anthropic's API to match our schema
      const usageInfo = {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        provider: this.provider,
        model: message.model,
      }

      return {
        result: toolUse.input as T,
        usage: {
          inputTokens: message.usage.input_tokens,
          outputTokens: message.usage.output_tokens,
          totalTokens: message.usage.input_tokens + message.usage.output_tokens,
          cost: calculateCost(usageInfo),
        },
      }
    }, 'Anthropic structured generation')
  }
}
