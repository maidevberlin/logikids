import { z } from 'zod'

// Base stats schema for a specific combination
export const TaskStatsSchema = z.object({
  correct: z.number().min(0).default(0),
  wrong: z.number().min(0).default(0),
  hintsUsed: z.number().min(0).default(0),
})

export type TaskStats = z.infer<typeof TaskStatsSchema>

export interface GaugeMeterProps {
  /** Value between 0 and 100 */
  value: number
}

export interface HintUsageBarProps {
  /** Average number of hints used */
  value: number
}

export interface PerformanceStatsProps {
  /** Success rate percentage (0-100) */
  successRate: number
  /** Average number of hints used per task */
  averageHints: number
} 