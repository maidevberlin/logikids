export const TASK_TYPES = ['arithmetic', 'geometry'] as const
export type TaskType = typeof TASK_TYPES[number]

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Age = number // age between 6 and 19

export interface TaskMetadata {
  difficulty: Difficulty
  age: Age
  estimatedTimeMinutes: number
}

export interface TaskResponse {
  task: string
  solution: number
  metadata: TaskMetadata
}

export interface Task {
  id: string
  task: string
  correctAnswer: string
  type: TaskType
} 