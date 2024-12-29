import { z } from 'zod';

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Age = number
export type Subject = 'math' | 'logic';
export interface TaskRequest {
  age: Age,
  difficulty: Difficulty,
  subject: Subject,
  concept?: string;
} 

export const taskRequestSchema = z.object({
  age: z.coerce.number().min(6).max(21),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  subject: z.enum(['math', 'logic']),
  concept: z.string().optional()
});

export interface Task {
  type: 'math' | 'logic';
  title: string;
  task: string;
  options: string[];
  solution: {
    index: number;
    explanation: string;
  };
  hints: string[];
  metadata: TaskMetadata;
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

export const taskResponseSchema = z.object({
  title: z.string(),
  task: z.string(),
  options: z.array(z.string()).length(4),
  solution: z.object({
    index: z.number().min(0).max(3),
    explanation: z.string()
  }),
  hints: z.array(z.string()).min(1)
});

export const taskSchema = taskResponseSchema.extend({
  metadata: taskMetadataSchema
});