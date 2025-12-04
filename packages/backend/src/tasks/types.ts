import { z } from 'zod'
import { subjectRegistry } from '../subjects/registry'
import { taskTypeRegistry } from './task-types'
import { Concept } from '../prompts/schemas'

// Difficulty Levels
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

// Request schema and type
export const taskRequestSchema = z.object({
  subject: z.string().refine((val) => subjectRegistry.get(val) !== undefined, 'Invalid subject'),
  concept: z.string().optional(),
  taskType: z
    .string()
    .optional()
    .refine((val) => !val || taskTypeRegistry.get(val) !== undefined, 'Invalid task type'),
  grade: z.number().min(1).max(13),
  difficulty: z.enum(DIFFICULTIES),
  language: z.string().min(2).max(5), // e.g., "en", "de", "en-US"
})

export type TaskRequest = z.infer<typeof taskRequestSchema>

// Parameters for task generation
export interface TaskGenerationParams {
  subject: string
  concept: Concept
  grade: number
  difficulty: Difficulty
  language: string
  taskType?: string
}

// Re-export task response types for convenience
export type {
  TaskResponse,
  BaseTaskResponse,
  MultiSelectResponse,
  YesNoResponse,
} from './task-types/'
