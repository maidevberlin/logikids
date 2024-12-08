import { z } from 'zod';

export type Difficulty = 'easy' | 'medium' | 'hard';

export const taskMetadataSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']),
  age: z.object({
    min: z.number(),
    max: z.number(),
  }),
  estimatedTimeMinutes: z.number(),
});

export type TaskMetadata = z.infer<typeof taskMetadataSchema>;

export const taskResponseSchema = z.object({
  task: z.string(),
  solution: z.number(),
  metadata: taskMetadataSchema,
});

export type TaskResponse = z.infer<typeof taskResponseSchema>;

export type ArithmeticOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type GeometryOperation = 'area' | 'perimeter' | 'circle'; 

