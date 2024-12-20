import { z } from 'zod';

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Age = number
export interface TaskRequest {
  age?: Age,
  difficulty?: Difficulty
} 

export const taskRequestSchema = z.object({
  age: z.coerce.number().min(6).max(19).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export interface Task{
  task: string
  solution: number
  metadata: TaskMetadata
}

export interface TaskMetadata {
  difficulty: Difficulty
  age: Age
  provider: string
  model: string
  language: string
}

export const taskResponseSchema = z.object({
  task: z.string(),
  solution: z.number()
});