import { z } from 'zod';

export type Subject = 'math' | 'logic';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Age = number;

export type MathTaskType = 
  | 'random'
  | 'arithmetic'
  | 'number_patterns'
  | 'geometry'
  | 'fractions'
  | 'measurement'
  | 'word_problems'
  | 'data_analysis'
  | 'probability'
  | 'algebra'
  | 'mental_math';

export type LogicTaskType = 
  | 'random'
  | 'sequential'
  | 'categorical'
  | 'conditional'
  | 'truth_tables'
  | 'pattern_recognition'
  | 'deductive'
  | 'analogical'
  | 'spatial'
  | 'set_theory'
  | 'probability';

export type TaskType = MathTaskType | LogicTaskType;

export const taskRequestSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']),
  subject: z.enum(['math', 'logic']),
  age: z.number().int().min(6).max(20).describe('Age must be between 6 and 20'),
  taskType: z.enum([
    'random',
    'arithmetic',
    'number_patterns',
    'geometry',
    'fractions',
    'measurement',
    'word_problems',
    'data_analysis',
    'probability',
    'algebra',
    'mental_math',
    'sequential',
    'categorical',
    'conditional',
    'truth_tables',
    'pattern_recognition',
    'deductive',
    'analogical',
    'spatial',
    'set_theory'
  ]).default('random')
});

export type TaskRequest = z.infer<typeof taskRequestSchema>;

export interface Task {
  title: string;
  task: string;
  hints: string[];
  options: string[];
  solution: {
    index: number;
    explanation: string;
  };
}