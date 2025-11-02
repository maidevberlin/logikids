import { z } from 'zod'
import { Difficulty } from '@/app/tasks'

// Task stats structure
export interface TaskStats {
  correct: number
  wrong: number
  hintsUsed: number
}

// Alias for compatibility
export type Stats = TaskStats

// Stats for each difficulty level
export interface DifficultyStats {
  easy: TaskStats
  medium: TaskStats
  hard: TaskStats
}

// Stats for all subjects
export const ProgressStatsSchema = z.record(
  z.string(),
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
  subject: string
  difficulty: Difficulty
  correct?: boolean
  hintsUsed?: number
}

// Level progression thresholds
export const TASK_LEVELS = [
  5, 15, 30, 50,           // Levels 1-4 (blue)
  75, 100, 150, 200,       // Levels 5-8 (indigo)
  300, 400, 550, 700,      // Levels 9-12 (purple)
  900, 1100, 1350, 1600,   // Levels 13-16 (violet)
  2000, 2500, 3000, 4000   // Levels 17-20 (fuchsia)
] 