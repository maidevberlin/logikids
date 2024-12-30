import type { Task as BackendTask, TaskRequest, Age, Subject, Difficulty, MathTaskType, LogicTaskType, TaskType } from '@logikids/backend/tasks/types';

export type Task = BackendTask;

export type { Subject, Difficulty, MathTaskType, LogicTaskType, TaskType, Age, TaskRequest };

export const taskDefaults: TaskRequest = {
  difficulty: 'medium',
  subject: 'math',
  age: 10,
  taskType: 'random'
};