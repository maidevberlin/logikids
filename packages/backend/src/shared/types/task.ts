import { z } from 'zod';

export const TASK_TYPES = ['arithmetic', 'geometry'] as const;
export type TaskType = typeof TASK_TYPES[number];

// Generic task schema that can be extended by specific domains
export const baseTaskResponseSchema = z.object({
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

export type BaseTaskResponse = z.infer<typeof baseTaskResponseSchema>; 