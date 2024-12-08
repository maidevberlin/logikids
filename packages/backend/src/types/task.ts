import { z } from 'zod';

export const DIFFICULTY_VALUES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = typeof DIFFICULTY_VALUES[number];

export const ARITHMETIC_OPERATIONS = ['addition', 'subtraction', 'multiplication', 'division'] as const;
export type ArithmeticOperation = typeof ARITHMETIC_OPERATIONS[number];

export const GEOMETRY_OPERATIONS = ['area', 'perimeter', 'circle'] as const;
export type GeometryOperation = typeof GEOMETRY_OPERATIONS[number];


export const taskMetadataSchema = z.object({
  difficulty: z.enum(DIFFICULTY_VALUES),
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


