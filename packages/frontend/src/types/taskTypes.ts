import type { Task as BackendTask, Difficulty, Subject } from '@logikids/backend/tasks/types'

export type Age = number

export type { Difficulty, Subject }

export interface Task extends BackendTask {
  title: string
  task: string // HTML content
  hints: string[]
  options: string[]
  solution: {
    index: number
    explanation: string
  }
}

export interface TaskProps {
  isLoading: boolean
  hasError: boolean
  task: Task | null
  selectedAnswer: number | null
  isCorrect: boolean | null
  difficulty: Difficulty
  subject: Subject
  onAnswerSelect: (index: number) => void
  onAnswerSubmit: () => void
  onNextTask: () => void
  onDifficultyChange: (difficulty: Difficulty) => void
  onSubjectChange: (subject: Subject) => void
}

export interface TaskOptionProps {
  isSelected: boolean
  isDisabled: boolean
  isCorrect: boolean | null
  text: string
  onSelect: () => void
}

export interface HintProps {
  hints: string[]
  shouldShake: boolean
  isFirstHint: boolean
  hasMoreHints: boolean
  onSkip: () => void
  onRequestHint: () => void
}

export const TASK_DEFAULTS = {
  difficulty: 'medium' as Difficulty,
  subject: 'math' as Subject,
  age: 10 as Age,
} as const 