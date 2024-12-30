import type { Task as BackendTask, TaskRequest, Age, Subject, Difficulty, MathTaskType, LogicTaskType, TaskType } from '@logikids/backend/tasks/types';

export type Task = BackendTask & {
  title: string;
  task: string; // HTML content
  hints: string[];
  options: string[];
  solution: { index: number };
};

export type { Subject, Difficulty, MathTaskType, LogicTaskType, TaskType, Age };

export interface TaskParams {
  difficulty: Difficulty;
  subject: Subject;
  age: number;
  taskType?: TaskType;
}

export const taskDefaults = {
  difficulty: 'medium' as Difficulty,
  subject: 'math' as Subject,
  age: 10 as Age,
  taskType: 'random' as TaskType,
};