export type Difficulty = 'easy' | 'medium' | 'hard'
export type Age = number
export type Subject = 'math' | 'logic'

export interface TaskMetadata {
  difficulty: Difficulty
  age: Age
  subject: Subject
  provider: string
  model: string
  language: string
}

export interface Task {
  task: string
  solution: number
  metadata: TaskMetadata
}

export interface TaskParams {
  age: Age
  difficulty: Difficulty
  subject: Subject
}

export const taskDefaults = {
  age: 12,
  difficulty: 'medium' as const,
  subject: 'math' as const,
} as const