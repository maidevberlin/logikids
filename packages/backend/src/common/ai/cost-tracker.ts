import { pool } from '../../../database/db'
import { createLogger } from '../logger'

const logger = createLogger('CostTracker')

export interface CostTrackingContext {
  userId?: string
  subject?: string
  concept?: string
}

export interface UsageInfo {
  inputTokens: number
  outputTokens: number
  provider: string
  model: string
}

// Pricing per 1M tokens (as of December 2025)
// Sources:
// - Anthropic: https://www.anthropic.com/pricing
// - OpenAI: https://openai.com/api/pricing/
const PRICING = {
  anthropic: {
    // Claude 4.5 Sonnet
    'claude-sonnet-4-5-20250929': {
      input: 3.0, // $3 per 1M input tokens
      output: 15.0, // $15 per 1M output tokens
    },
    // Claude 4.5 Haiku
    'claude-haiku-4-5-20250929': {
      input: 1.0, // $1 per 1M input tokens
      output: 5.0, // $5 per 1M output tokens
    },
    // Claude 4.1 Opus
    'claude-opus-4-1-20250929': {
      input: 15.0, // $15 per 1M input tokens
      output: 75.0, // $75 per 1M output tokens
    },
  },
  openai: {
    // GPT-5 family (August 2025)
    'gpt-5': {
      input: 1.25, // $1.25 per 1M input tokens
      output: 10.0, // $10 per 1M output tokens
    },
    'gpt-5-mini': {
      input: 0.25, // $0.25 per 1M input tokens
      output: 2.0, // $2 per 1M output tokens
    },
    'gpt-5-nano': {
      input: 0.05, // $0.05 per 1M input tokens
      output: 0.4, // $0.40 per 1M output tokens
    },
  },
} as const

/**
 * Calculate cost based on token usage and model pricing
 * @returns Cost in USD
 */
export function calculateCost(usage: UsageInfo): number {
  // Ollama runs locally - no API cost
  if (usage.provider === 'ollama') {
    return 0
  }

  // Get provider pricing
  if (usage.provider === 'anthropic') {
    const modelPricing = PRICING.anthropic[usage.model as keyof typeof PRICING.anthropic]
    if (!modelPricing) {
      logger.warn('Unknown Anthropic model for cost calculation', { model: usage.model })
      return 0
    }
    const inputCost = (usage.inputTokens / 1_000_000) * modelPricing.input
    const outputCost = (usage.outputTokens / 1_000_000) * modelPricing.output
    return inputCost + outputCost
  } else if (usage.provider === 'openai') {
    const modelPricing = PRICING.openai[usage.model as keyof typeof PRICING.openai]
    if (!modelPricing) {
      logger.warn('Unknown OpenAI model for cost calculation', { model: usage.model })
      return 0
    }
    const inputCost = (usage.inputTokens / 1_000_000) * modelPricing.input
    const outputCost = (usage.outputTokens / 1_000_000) * modelPricing.output
    return inputCost + outputCost
  } else {
    logger.warn('Unknown provider for cost calculation', { provider: usage.provider })
    return 0
  }
}

/**
 * Track AI API costs in the database
 */
export async function trackCost(context: CostTrackingContext, usage: UsageInfo): Promise<void> {
  try {
    // Skip tracking if no user ID (shouldn't happen with requireAuth, but defensive)
    if (!context.userId) {
      logger.debug('Skipping cost tracking - no user ID')
      return
    }

    const totalCost = calculateCost(usage)

    await pool.query(
      `INSERT INTO task_costs
        (user_id, subject, concept, input_tokens, output_tokens, total_cost, provider, model, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        context.userId,
        context.subject || 'unknown',
        context.concept || 'unknown',
        usage.inputTokens,
        usage.outputTokens,
        totalCost,
        usage.provider,
        usage.model,
        Date.now(),
      ]
    )

    logger.info('Cost tracked', {
      userId: context.userId,
      subject: context.subject,
      concept: context.concept,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      totalCost: totalCost.toFixed(6),
      provider: usage.provider,
      model: usage.model,
    })
  } catch (error) {
    // Don't throw - cost tracking failure shouldn't break task generation
    logger.error('Failed to track cost', {
      error: error instanceof Error ? error.message : 'Unknown error',
      context,
      usage,
    })
  }
}
