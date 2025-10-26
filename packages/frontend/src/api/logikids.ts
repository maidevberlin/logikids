import { z } from 'zod';
import { api, ApiResponse } from './api';
import { DIFFICULTIES, Task, TASK_TYPES } from '../features/Task/types';
import { getCurrentLanguage } from '../i18n/config';

export class LogikidsApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LogikidsApiError';
  }
}

// Gender options
export const GENDERS = ['male', 'female', 'non-binary', 'prefer-not-to-say'] as const;
export type Gender = typeof GENDERS[number];

// Request schema and type
export const taskRequestSchema = z.object({
  subject: z.string(),
  concept: z.string(),
  taskType: z.enum([TASK_TYPES.multiple_choice, TASK_TYPES.yes_no]).optional(),
  age: z.number().min(6).max(18),
  grade: z.number().min(1).max(13),
  difficulty: z.enum(DIFFICULTIES),
  gender: z.enum(GENDERS).optional()
});

export type TaskRequest = z.infer<typeof taskRequestSchema>;

// Subjects endpoint params
export interface SubjectsParams {
  grade: number;
  age: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Subject/concept response types
export interface ConceptInfo {
  id: string;
  name: string;
  grade: number;
  difficulty: string;
  source: 'curriculum' | 'custom';
}

export interface SubjectInfo {
  id: string;
  name: string;
  concepts: ConceptInfo[];
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
  getSubjects: (params: SubjectsParams, signal?: AbortSignal): ApiResponse<SubjectsResponse> => {
    return api.get<SubjectsParams, SubjectsResponse>('/task/subjects', {
      params,
      signal,
      headers: {
        'Accept-Language': getCurrentLanguage()
      }
    })
    .then(response => {
      if (!response) {
        throw new LogikidsApiError('No response received from server');
      }
      return response;
    })
    .catch((error) => {
      throw new LogikidsApiError(error.message || 'Failed to fetch subjects');
    });
  },

  getTask: (params: TaskRequest, signal?: AbortSignal): ApiResponse<Task> => {
    return api.get<TaskRequest, Task>('/task', {
      params, 
      signal,
      headers: {
        'Accept-Language': getCurrentLanguage()
      }
    })
    .then(response => {
      if (!response) {
        throw new LogikidsApiError('No response received from server');
      }
      return response;
    })
    .catch((error) => {
      if (error.response?.status === 404) {
        throw new LogikidsApiError('No tasks found for the selected criteria');
      }
      if (error instanceof LogikidsApiError) {
        throw error;
      }
      throw new LogikidsApiError(error.message || 'Failed to fetch task');
    });
  },

  getHint: (taskId: string, signal?: AbortSignal): ApiResponse<HintResponse> => {
    return api.post<void, HintResponse>(`/task/${taskId}/hint`, undefined, {
      signal,
      headers: {
        'Accept-Language': getCurrentLanguage()
      }
    })
    .then(response => {
      if (!response) {
        throw new LogikidsApiError('No response received from server');
      }
      return response;
    })
    .catch((error) => {
      if (error.response?.status === 404) {
        throw new LogikidsApiError('Task not found or expired');
      }
      if (error.response?.status === 429) {
        throw new LogikidsApiError('All hints have been used');
      }
      if (error instanceof LogikidsApiError) {
        throw error;
      }
      throw new LogikidsApiError(error.message || 'Failed to fetch hint');
    });
  }
}; 