import { z } from 'zod'
import { Subject, Difficulty } from '../Task/types'

// Stats for all subjects
export const ProgressStatsSchema = z.record(
  z.enum(['math', 'logic'] as const)
)

// Complete user progress
export const UserProgressSchema = z.object({
  version: z.literal(1), // For future migrations
  stats: ProgressStatsSchema,
  lastUpdated: z.number(), // timestamp
})

export type ProgressStats = z.infer<typeof ProgressStatsSchema>
export type UserProgress = z.infer<typeof UserProgressSchema>

// Helper type for updating stats
export type StatUpdate = {
  subject: Subject
  difficulty: Difficulty
  correct?: boolean
  hintsUsed?: number
} 