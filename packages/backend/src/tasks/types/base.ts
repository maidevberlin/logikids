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

// JSON Schema definition (for LLM structured outputs)
export type JSONSchema = Record<string, unknown>;

export abstract class BaseTaskType<T extends TaskResponse = TaskResponse> {
  abstract readonly id: TaskTypeId;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly promptTemplate: string;
  abstract readonly jsonSchema: JSONSchema;
}