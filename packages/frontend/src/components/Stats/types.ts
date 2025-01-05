import { z } from 'zod'
import { Subject, Difficulty } from '../Task/types'

// Task stats structure
export interface TaskStats {
  correct: number
  wrong: number
  hintsUsed: number
}

// Stats for each difficulty level
export interface DifficultyStats {
  easy: TaskStats
  medium: TaskStats
  hard: TaskStats
}

// Stats for all subjects
export const ProgressStatsSchema = z.record(
  z.enum(['math', 'logic'] as const),
  z.object({
    easy: z.object({
      correct: z.number(),
      wrong: z.number(),
      hintsUsed: z.number()
    }),
    medium: z.object({
      correct: z.number(),
      wrong: z.number(),
      hintsUsed: z.number()
    }),
    hard: z.object({
      correct: z.number(),
      wrong: z.number(),
      hintsUsed: z.number()
    })
  })
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