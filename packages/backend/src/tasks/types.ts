import { z } from 'zod';

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Age = number
export type Subject = 'math' | 'logic';
export interface TaskRequest {
  age: Age,
  difficulty: Difficulty,
  subject: Subject
} 

export const taskRequestSchema = z.object({
  age: z.coerce.number().min(6).max(21),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  subject: z.enum(['math', 'logic']),
});

export interface Task{
  task: string
  solution: number
  metadata: TaskMetadata
}

export interface TaskMetadata {
  difficulty: Difficulty
  age: Age
  subject: Subject
  provider: string
  model: string
  language: string
}

export const taskMetadataSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']),
  age: z.coerce.number().min(6).max(21),
  subject: z.enum(['math', 'logic']),
  provider: z.string(),
  model: z.string(),
  language: z.string(),
});

export const taskSchema = z.object({
  task: z.string(),
  solution: z.number(),
  metadata: taskMetadataSchema,
});

export const taskResponseSchema = z.object({
  task: z.string(),
  solution: z.number()
});