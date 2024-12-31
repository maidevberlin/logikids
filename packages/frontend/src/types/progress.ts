import { z } from 'zod'
import { Difficulty, Subject } from '@logikids/backend/tasks/types'

// Base stats schema for a specific combination
export const TaskStatsSchema = z.object({
  correct: z.number().min(0).default(0),
  wrong: z.number().min(0).default(0),
  hintsUsed: z.number().min(0).default(0),
})

export type TaskStats = z.infer<typeof TaskStatsSchema>

// Stats for each difficulty level within a subject
export const SubjectStatsSchema = z.record(
  z.enum(['easy', 'medium', 'hard'] as const), 
  TaskStatsSchema
)

// Stats for all subjects
export const ProgressStatsSchema = z.record(
  z.enum(['math', 'logic'] as const),
  SubjectStatsSchema
)

// Complete user progress
export const UserProgressSchema = z.object({
  version: z.literal(1), // For future migrations
  stats: ProgressStatsSchema,
  lastUpdated: z.number(), // timestamp
})

export type SubjectStats = z.infer<typeof SubjectStatsSchema>
export type ProgressStats = z.infer<typeof ProgressStatsSchema>
export type UserProgress = z.infer<typeof UserProgressSchema>

// Helper type for updating stats
export type StatUpdate = {
  subject: Subject
  difficulty: Difficulty
  correct?: boolean
  hintsUsed?: number
} 