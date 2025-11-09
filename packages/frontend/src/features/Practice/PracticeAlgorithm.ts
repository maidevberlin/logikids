import { ProgressData, Difficulty } from '@/data/progress/types'

export interface PracticeRecommendation {
  subject: string
  conceptId: string
  priority: number // 0-100 (higher = more urgent)
  reason: string
  metrics: {
    successRate: number
    avgTimeSeconds: number
    hintRate: number
    totalAttempts: number
  }
  suggestedDifficulty: Difficulty
}

/**
 * Generate practice recommendations based on user progress
 * Prioritizes concepts that need work based on:
 * - Success rate (40% weight)
 * - Time/fluency (30% weight)
 * - Hint dependency (30% weight)
 */
export function generatePracticeRecommendations(
  progress: ProgressData,
  maxRecommendations = 5
): PracticeRecommendation[] {
  const recommendations: PracticeRecommendation[] = []

  for (const [subject, concepts] of Object.entries(progress)) {
    for (const [conceptId, stats] of Object.entries(concepts)) {
      // Skip concepts with too few attempts (need at least 3 for meaningful data)
      if (stats.aggregate.totalAttempts < 3) {
        continue
      }

      const agg = stats.aggregate

      // Calculate component scores (0-1 scale, higher = needs more work)
      const accuracyScore = 1 - agg.successRate
      const speedScore = Math.min(agg.averageTimeSeconds / 600, 1) // Normalize to 10min
      const hintScore = Math.min((agg.totalHintsUsed / agg.totalAttempts) / 2, 1) // Normalize to 2 hints/task

      // Weighted priority score
      const priority = Math.round(
        (accuracyScore * 0.4 + speedScore * 0.3 + hintScore * 0.3) * 100
      )

      // Only recommend if priority > 30
      if (priority < 30) {
        continue
      }

      // Suggest difficulty based on performance
      const suggestedDifficulty = suggestDifficulty(agg.successRate)

      // Generate human-readable reason
      const reason = generateReason(accuracyScore, speedScore, hintScore)

      recommendations.push({
        subject,
        conceptId,
        priority,
        reason,
        metrics: {
          successRate: agg.successRate,
          avgTimeSeconds: agg.averageTimeSeconds,
          hintRate: agg.totalHintsUsed / agg.totalAttempts,
          totalAttempts: agg.totalAttempts
        },
        suggestedDifficulty
      })
    }
  }

  // Sort by priority and return top N
  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxRecommendations)
}

/**
 * Suggest difficulty based on success rate
 */
function suggestDifficulty(successRate: number): Difficulty {
  if (successRate < 0.4) return 'easy'
  if (successRate < 0.7) return 'medium'
  return 'hard'
}

/**
 * Generate human-readable reason for practice
 */
function generateReason(accuracy: number, speed: number, hints: number): string {
  const issues: string[] = []

  if (accuracy > 0.5) issues.push('low success rate')
  if (speed > 0.6) issues.push('taking too long')
  if (hints > 0.5) issues.push('using many hints')

  if (issues.length === 0) return 'Building mastery'
  if (issues.length === 1) return `Needs work: ${issues[0]}`

  return `Needs work: ${issues.slice(0, -1).join(', ')} and ${issues[issues.length - 1]}`
}
