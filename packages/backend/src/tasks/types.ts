import { z } from 'zod';
import { subjectRegistry } from '../subjects/registry';
import { taskTypeRegistry } from './task-types';
import { Concept } from '../prompts/schemas';

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
  concept: z.string().optional(),
  taskType: z.string().optional().refine(
    val => !val || taskTypeRegistry.get(val) !== undefined,
    'Invalid task type'
  ),
  grade: z.number().min(1).max(13),
  age: z.number().min(6).max(20),
  difficulty: z.enum(DIFFICULTIES),
  language: z.string().min(2).max(5), // e.g., "en", "de", "en-US"
  gender: z.enum(GENDERS).optional()
}).refine(
  // Age and grade must be roughly aligned (age should be grade + 5 to grade + 8)
  data => data.age >= data.grade + 5 && data.age <= data.grade + 8,
  { message: 'Age and grade are not aligned. Expected age to be roughly grade + 6 (±2 years).' }
);

export type TaskRequest = z.infer<typeof taskRequestSchema>;

// Parameters for task generation
export interface TaskGenerationParams {
  subject: string;
  concept: Concept;
  grade: number;
  age: number;
  difficulty: Difficulty;
  language: string;
  taskType?: string;
  gender?: Gender;
}

// Re-export task response types for convenience
export type { TaskResponse, BaseTaskResponse, MultiSelectResponse, YesNoResponse } from './task-types/';

