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

// Pricing per 1M tokens (as of November 2025)
// Source: https://claude.com/pricing
const PRICING = {
  anthropic: {
    // Claude Sonnet 4.5 (latest)
    'claude-sonnet-4-5-20250929': {
      input: 3.0, // $3 per 1M input tokens (≤200K context)
      output: 15.0, // $15 per 1M output tokens (≤200K context)
    },
    // Claude 3.5 Sonnet (legacy)
    'claude-3-5-sonnet-20241022': {
      input: 3.0, // $3 per 1M input tokens
      output: 15.0, // $15 per 1M output tokens
    },
    // Claude Haiku 4.5
    'claude-haiku-4-5-20250929': {
      input: 1.0, // $1 per 1M input tokens
      output: 5.0, // $5 per 1M output tokens
    },
    // Claude 3.5 Haiku (legacy)
    'claude-3-5-haiku-20241022': {
      input: 1.0, // $1 per 1M input tokens
      output: 5.0, // $5 per 1M output tokens
    },
    // Claude Opus 4.1
    'claude-opus-4-1-20250929': {
      input: 15.0, // $15 per 1M input tokens
      output: 75.0, // $75 per 1M output tokens
    },
  },
  openai: {
    'gpt-4o': {
      input: 2.5, // $2.50 per 1M input tokens
      output: 10.0, // $10 per 1M output tokens
    },
    'gpt-4o-mini': {
      input: 0.15, // $0.15 per 1M input tokens
      output: 0.6, // $0.60 per 1M output tokens
    },
    'gpt-4-turbo': {
      input: 10.0, // $10 per 1M input tokens
      output: 30.0, // $30 per 1M output tokens
    },
  },
} as const

/**
 * Calculate cost based on token usage and model pricing
 * @returns Cost in USD
 */
export function calculateCost(usage: UsageInfo): number {
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
