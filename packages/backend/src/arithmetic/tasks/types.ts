export type Difficulty = 'easy' | 'medium' | 'hard'
export type Age = number

export interface TaskRequestQuery {
  age?: Age,
  difficulty?: Difficulty
} 