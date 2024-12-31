import { z } from 'zod';

export const taskRequestSchema = z.object({
  subject: z.enum(['math', 'logic']),
  concept: z.string(),
  age: z.number().min(5).max(18),
  difficulty: z.enum(['easy', 'medium', 'hard'])
});

// Export the enum types explicitly
export type Subject = z.infer<typeof taskRequestSchema>['subject'];
export type Difficulty = z.infer<typeof taskRequestSchema>['difficulty'];
export type Age = z.infer<typeof taskRequestSchema>['age'];

export type TaskRequest = z.infer<typeof taskRequestSchema>;

export interface Task {
  title: string;
  task: string;
  options: string[];
  solution: {
    index: number;
    explanation: string;
  };
  hints: string[];
}