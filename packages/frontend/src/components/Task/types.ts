import type { Difficulty } from '@logikids/backend/tasks/types'
import type { SubjectId as Subject } from '@logikids/backend/tasks/subjects/types'

export type Age = number
export type { Difficulty, Subject }

export type TaskType = 'multiple_choice' | 'yes_no'

export interface BaseTask {
  title: string
  task: string
  hints: string[]
  type: TaskType
}

export interface MultipleChoiceTask extends BaseTask {
  type: 'multiple_choice'
  options: Array<{
    text: string
    isCorrect: boolean
    explanation?: string
  }>
}

export interface YesNoTask extends BaseTask {
  type: 'yes_no'
  solution: {
    answer: boolean
    explanation: string
  }
}

export type Task = MultipleChoiceTask | YesNoTask

// Default values
export const TASK_DEFAULTS = {
  difficulty: 'medium' as Difficulty,
  subject: 'math' as Subject,
  age: 10 as Age,
} as const
