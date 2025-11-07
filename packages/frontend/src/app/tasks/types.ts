
// Task types
export const TASK_TYPES = {
  multiple_choice: 'multiple_choice',
  yes_no: 'yes_no'
} as const;
export type TaskType = typeof TASK_TYPES[keyof typeof TASK_TYPES]

// Difficulty Levels
export const DIFFICULTIES = [
  'easy',
  'medium',
  'hard'
] as const;
export type Difficulty = typeof DIFFICULTIES[number];

export interface BaseTask {
  taskId: string
  title: string
  task: string
  hints?: string[]
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

// Task Answer Types
export type TaskAnswerType<T extends Task> = T extends MultipleChoiceTask
  ? number
  : T extends YesNoTask
  ? boolean
  : never

export interface TaskAnswerProps<T extends Task = Task> {
  task: T
  selectedAnswer: TaskAnswerType<T> | null
  isLoading: boolean
  isCorrect: boolean | null
  onAnswerSelect: (answer: TaskAnswerType<T> | null) => void
  onAnswerSubmit: () => void
  onNextTask: () => void
  hints: string[]
  requestHint: () => void
  hintLoading: boolean
  hintError: string | null
  canRequestHint: boolean
}

// Default values
export const TASK_DEFAULTS = {
  difficulty: 'medium' as Difficulty,
  subject: 'math',
  age: 10,
} as const
