export const ARITHMETIC_OPERATIONS = ['addition', 'subtraction', 'multiplication', 'division'] as const
export type ArithmeticOperation = typeof ARITHMETIC_OPERATIONS[number]

export const GEOMETRY_OPERATIONS = ['area', 'perimeter', 'circle'] as const
export type GeometryOperation = typeof GEOMETRY_OPERATIONS[number]

export const TASK_TYPES = ['arithmetic', 'geometry'] as const
export type TaskType = typeof TASK_TYPES[number]

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Age = number // age between 6 and 19

export interface TaskMetadata {
  difficulty: Difficulty
  age: {
    min: number
    max: number
  }
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
  options: string[]
  correctAnswer: string
  type: TaskType
} 