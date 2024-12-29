import type { Task as BackendTask, TaskRequest, Difficulty, Subject, Age } from '@logikids/backend/tasks/types';

export type { Difficulty, Subject, Age };
export type Task = BackendTask & {
  title: string;
  task: string; // HTML content
  hints: string[];
  options: string[];
  solution: { index: number };
};
export type TaskParams = TaskRequest;

export const taskDefaults = {
  difficulty: 'medium' as Difficulty,
  subject: 'math' as Subject,
  age: 10 as Age,
};