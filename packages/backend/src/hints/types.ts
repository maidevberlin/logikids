import { z } from 'zod';
import { Task, taskSchema } from '../tasks/types';

export interface Hint {
  hint: string;
}

export const hintSchema = z.object({
  hint: z.string()
});

export interface HintParams {
  task: Task
  previousHints: Hint[]
}

export const hintParamsSchema = z.object({
  task: taskSchema,
  previousHints: z.array(hintSchema)
});