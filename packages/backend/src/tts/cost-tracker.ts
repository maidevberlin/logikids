import { pool } from '../../database/db'

export interface TTSCostTrackingContext {
  userId: string
  subject?: string
  concept?: string
}

export interface TTSUsageInfo {
  characterCount: number
  language: string
  voiceType: 'standard' | 'wavenet' | 'neural2'
  cached: boolean
}

// Google Cloud TTS Pricing (as of December 2025)
// https://cloud.google.com/text-to-speech/pricing
const TTS_PRICING = {
  standard: 4.0, // $4.00 per 1M characters
  wavenet: 16.0, // $16.00 per 1M characters
  neural2: 16.0, // $16.00 per 1M characters
} as const

/**
 * Calculate TTS cost based on character count and voice type
 * @returns Cost in USD
 */
export function calculateTTSCost(usage: TTSUsageInfo): number {
  // Cached responses have no cost
  if (usage.cached) {
    return 0
  }

  const pricePerMillion = TTS_PRICING[usage.voiceType]
  return (usage.characterCount / 1_000_000) * pricePerMillion
}

/**
 * Track TTS costs in the database
 */
export async function trackTTSCost(
  context: TTSCostTrackingContext,
  usage: TTSUsageInfo
): Promise<void> {
  try {
    if (!context.userId) {
      return
    }

    const totalCost = calculateTTSCost(usage)

    await pool.query(
      `INSERT INTO tts_costs
        (user_id, subject, concept, character_count, language, voice_type, total_cost, cached, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        context.userId,
        context.subject || 'unknown',
        context.concept || 'unknown',
        usage.characterCount,
        usage.language,
        usage.voiceType,
        totalCost,
        usage.cached,
        Date.now(),
      ]
    )
  } catch (error) {
    // Don't throw - cost tracking failure shouldn't break TTS
  }
}
