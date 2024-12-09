import { z } from 'zod';

export const TASK_TYPES = ['arithmetic', 'geometry'] as const;
export type TaskType = typeof TASK_TYPES[number];

export const taskResponseSchema = z.object({
  task: z.string(),
  solution: z.number(),
  metadata: z.object({
    difficulty: z.enum(['easy', 'medium', 'hard']),
    age: z.object({
      min: z.number(),
      max: z.number(),
    }),
    estimatedTimeMinutes: z.number(),
  }),
});

export type TaskResponse = z.infer<typeof taskResponseSchema>;
