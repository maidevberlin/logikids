import { z } from 'zod';
import { subjectRegistry } from './subject.registry';
import { taskTypeRegistry } from './types/registry';

// Difficulty Levels
export const DIFFICULTIES = [
  'easy',
  'medium',
  'hard'
] as const;
export type Difficulty = typeof DIFFICULTIES[number];

// Gender options
export const GENDERS = [
  'male',
  'female',
  'non-binary',
  'prefer-not-to-say'
] as const;
export type Gender = typeof GENDERS[number];

// Request schema and type
export const taskRequestSchema = z.object({
  subject: z.string().refine(
    val => subjectRegistry.get(val) !== undefined,
    'Invalid subject'
  ),
  concept: z.string(), // We'll refine this with getConceptSchema
  taskType: z.string().optional().refine(
    val => !val || taskTypeRegistry.get(val) !== undefined,
    'Invalid task type'
  ),
  age: z.number().min(5).max(18),
  difficulty: z.enum(DIFFICULTIES),
  gender: z.enum(GENDERS).optional()
});

export type TaskRequest = z.infer<typeof taskRequestSchema>;

// Parameters for task generation
export interface TaskGenerationParams {
  subject: string;
  concept: string;
  age: number;
  difficulty: Difficulty;
  language: string;
  taskType?: string;
  gender?: Gender;
}

// Re-export task response types for convenience
export type { TaskResponse, BaseTaskResponse, MultipleChoiceResponse, YesNoResponse } from './types/';

