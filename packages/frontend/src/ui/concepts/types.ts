export interface Concept {
  id: string
  name: string
  description: string
  grade?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  focus?: string
  learning_objectives?: string[]
  source?: 'curriculum' | 'custom'
}
