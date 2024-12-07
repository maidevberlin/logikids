import { z } from 'zod';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TaskMetadata {
  difficulty: Difficulty;
  ageGroup: string;
  estimatedTimeMinutes: number;
}

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

export type ArithmeticOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type GeometryOperation = 'area' | 'perimeter' | 'volume'; 