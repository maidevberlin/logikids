import { z } from 'zod';
import { api, ApiResponse } from './api';
import { DIFFICULTIES, Task, TASK_TYPES } from '@/app/tasks/types';

// Re-export for backward compatibility
export { LogikidsApiError } from './errors';

// Gender options
export const GENDERS = ['male', 'female', 'non-binary', 'prefer-not-to-say'] as const;
export type Gender = typeof GENDERS[number];

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

export interface SubjectsResponse {
  subjects: SubjectInfo[];
}

// Hint response type
export interface HintResponse {
  hint: string;
  hintNumber: number;
  totalHintsAvailable: number;
}

export const logikids = {
  getSubjects: (params?: SubjectsParams, signal?: AbortSignal): ApiResponse<SubjectsResponse> => {
    return api.get<SubjectsParams | undefined, SubjectsResponse>('/task/subjects', {
      params,
      signal
    });
  },

  getTask: (params: TaskRequest, signal?: AbortSignal): ApiResponse<Task> => {
    return api.get<TaskRequest, Task>('/task', {
      params,
      signal
    });
  },

  getHint: (taskId: string, signal?: AbortSignal): ApiResponse<HintResponse> => {
    return api.post<void, HintResponse>(`/task/${taskId}/hint`, undefined, {
      signal
    });
  }
}; 