import { z } from 'zod';
import { DIFFICULTIES, TASK_TYPES } from '@/app/tasks/types';

// Re-export for backward compatibility
export { LogikidsApiError } from './errors';

// Gender options
export const GENDERS = ['male', 'female', 'non-binary', 'prefer-not-to-say'] as const;

// Request schema and type
export const taskRequestSchema = z.object({
  subject: z.string(),
  concept: z.string().optional(),
  taskType: z.enum([TASK_TYPES.single_choice, TASK_TYPES.yes_no]).optional(),
  age: z.number().min(6).max(18),
  grade: z.number().min(1).max(13),
  difficulty: z.enum(DIFFICULTIES),
  language: z.string().min(2).max(5), // e.g., "en", "de"
  gender: z.enum(GENDERS).optional()
});

export type TaskRequest = z.infer<typeof taskRequestSchema>;

// Subjects endpoint params
export interface SubjectsParams {
  grade?: number;
  age?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Subject/concept response types
export interface ConceptInfo {
  id: string;
  name: string;
  description: string;
  grade: number;
  difficulty: string;
  source: 'curriculum' | 'custom';
  focus: string;
  learning_objectives: string[];
}

export interface SubjectInfo {
  id: string;
  name: string;
  description: string;
  conceptCount: number;
  minGrade?: number;
  maxGrade?: number;
  concepts?: ConceptInfo[]; // Only present when grade filtering is active
}
