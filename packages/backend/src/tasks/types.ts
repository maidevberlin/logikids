import { z } from 'zod';
import { registry as subjectRegistry } from './subjects/registry';
import { registry as taskTypeRegistry } from './types/registry';

// Difficulty Levels
export const DIFFICULTIES = [
  'easy',
  'medium',
  'hard'
] as const;
export type Difficulty = typeof DIFFICULTIES[number];

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
  difficulty: z.enum(DIFFICULTIES)
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
}

