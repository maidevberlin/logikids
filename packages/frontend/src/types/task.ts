export type Difficulty = 'easy' | 'medium' | 'hard'
export type Age = number

export interface TaskMetadata {
  difficulty: Difficulty
  age: Age
  provider: string
  model: string
}

export interface Task {
  task: string
  solution: number
  metadata: TaskMetadata
}
