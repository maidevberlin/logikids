
// Task types
export const TASK_TYPES = {
  single_choice: 'single_choice',
  yes_no: 'yes_no',
  ordering: 'ordering',
  fill_in_blank: 'fill_in_blank',
  number_input: 'number_input',
  multi_select: 'multi_select',
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

export interface SingleChoiceTask extends BaseTask {
  type: 'single_choice'
  options: Array<{
    text: string
    isCorrect: boolean
    explanation?: string
  }>
}

export interface YesNoTask extends BaseTask {
  type: 'yes_no'
  answer: boolean
  explanation: string
}

export interface OrderingTask extends BaseTask {
  type: 'ordering'
  items: Array<{
    id: string
    content: string
  }>
  correctOrder: string[]
  explanation: string
}

export interface FillInBlankTask extends BaseTask {
  type: 'fill_in_blank'
  blanks: Array<{
    id: number
    acceptedAnswers: string[]
    caseSensitive: boolean
  }>
  explanation: string
}

export interface NumberInputTask extends BaseTask {
  type: 'number_input'
  answer: number           // The correct numeric value (required)
  unit?: string            // Correct unit (when unitOptions present) OR display unit
  unitOptions?: string[]   // Optional: if present, student must choose
  explanation: string
}

export interface MultiSelectTask extends BaseTask {
  type: 'multi_select'
  options: Array<{
    id: number
    text: string
    isCorrect: boolean
  }>
  expectedCount: number
  explanation: string
}

export type Task = SingleChoiceTask | YesNoTask | OrderingTask | FillInBlankTask | NumberInputTask | MultiSelectTask

// Task Answer Types
export type TaskAnswerType<T extends Task> = T extends SingleChoiceTask
  ? number
  : T extends YesNoTask
  ? boolean
  : T extends OrderingTask
  ? string[]
  : T extends FillInBlankTask
  ? string[]
  : T extends NumberInputTask
  ? { value: number | null; unit?: string }
  : T extends MultiSelectTask
  ? number[]
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
