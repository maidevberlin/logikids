import { z } from 'zod';

export const TASK_TYPES = ['arithmetic', 'geometry'] as const;
export type TaskType = typeof TASK_TYPES[number];

export { baseTaskResponseSchema, type BaseTaskResponse } from './baseTask';
export { taskResponseSchema, type TaskResponse } from './taskResponses';
