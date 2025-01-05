import type { Difficulty } from '@logikids/backend/tasks/types'
import type { SubjectId as Subject } from '@logikids/backend/tasks/subjects/types'
import type { MultipleChoiceOption } from './MultipleChoiceAnswer/types'

export type Age = number
export type { Difficulty, Subject }

// Base Task type
export interface Task {
  title: string
  task: string // HTML content
  hints: string[]
  options: MultipleChoiceOption[]
}

// Default values
export const TASK_DEFAULTS = {
  difficulty: 'medium' as Difficulty,
  subject: 'math' as Subject,
  age: 10 as Age,
} as const
