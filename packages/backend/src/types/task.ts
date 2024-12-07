export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TaskMetadata {
  difficulty: Difficulty;
  ageGroup: string;
  estimatedTimeMinutes: number;
}

export interface TaskResponse {
  task: string;
  solution: number;
  metadata: TaskMetadata;
}

export type ArithmeticOperation = 'addition' | 'subtraction' | 'multiplication' | 'division'; 