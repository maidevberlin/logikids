import { TYPE_ID as MULTIPLE_CHOICE } from './multipleChoice/types';
import { TYPE_ID as YES_NO } from './yesNo/types';

// Task Types Registry
export const TASK_TYPES = {
  multiple_choice: MULTIPLE_CHOICE,
  yes_no: YES_NO
} as const;
export type TaskTypeId = typeof TASK_TYPES[keyof typeof TASK_TYPES];

// Base response interface that all task types must implement
export interface TaskResponse {
  type: TaskTypeId;
  title: string;
  task: string;
  hints: string[];
}

// Base task type interface
export interface TaskType<T extends TaskResponse = TaskResponse> {
  id: TaskTypeId;
  name: string;
  description: string;
  promptTemplate: string;
  validateResponse: (response: unknown) => response is T;
}