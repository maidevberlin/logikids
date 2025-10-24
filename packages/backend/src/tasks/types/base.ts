import { z } from 'zod';

export interface TaskResponse {
  type: string;
  title: string;
  task: string;
  hints?: string[];
  taskId?: string;
}

export const TASK_TYPES = {
  multiple_choice: 'multiple_choice',
  yes_no: 'yes_no'
} as const;

export type TaskTypeId = typeof TASK_TYPES[keyof typeof TASK_TYPES];

export abstract class BaseTaskType<T extends TaskResponse = TaskResponse> {
  abstract readonly id: TaskTypeId;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly promptTemplate: string;
  abstract readonly responseSchema: z.ZodType<T>;

  validateResponse(response: unknown): response is T {
    const result = this.responseSchema.safeParse(response);
    return result.success;
  }
}