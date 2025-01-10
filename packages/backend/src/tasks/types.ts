import { z } from 'zod';
import { SUBJECTS, SubjectId } from './subjects/types';
import { TASK_TYPES } from './taskTypes/types';

// Difficulty Levels
export const DIFFICULTIES = [
  'easy',
  'medium',
  'hard'
] as const;
export type Difficulty = typeof DIFFICULTIES[number];

// Request schema and type
export const taskRequestSchema = z.object({
  subject: z.enum(['math', 'logic', 'music', 'physics'] as const),
  concept: z.string(), // We'll refine this with getConceptSchema
  taskType: z.enum([TASK_TYPES.multiple_choice, TASK_TYPES.yes_no]).optional(),
  age: z.number().min(5).max(18),
  difficulty: z.enum(DIFFICULTIES)
});

export type TaskRequest = z.infer<typeof taskRequestSchema>;

// Parameters for task generation
export interface TaskGenerationParams {
  subject: SubjectId;
  concept: string;
  age: number;
  difficulty: Difficulty;
  language: string;
  taskType?: string;
}

