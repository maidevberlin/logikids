import { z } from 'zod';

export const baseTaskResponseSchema = z.object({
  task: z.string(),
  solution: z.number(),
  metadata: z.object({
    difficulty: z.enum(['easy', 'medium', 'hard']),
    age: z.number(),
    estimatedTimeMinutes: z.number(),
    provider: z.enum(['ollama', 'openai']),
    model: z.string()
  }),
});

export type BaseTaskResponse = z.infer<typeof baseTaskResponseSchema>; 