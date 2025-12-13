import { z } from 'zod'
import { SUPPORTED_LANGUAGES, type Language } from '/content/languages'

// Task Request (for API calls)
export const taskRequestSchema = z.object({
  subject: z.string(),
  concept: z.string().optional(),
  taskType: z.enum(['single_choice', 'yes_no']).optional(),
  grade: z.number().min(1).max(13),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.enum(SUPPORTED_LANGUAGES),
})

// Re-export Language type for convenience
export type { Language }

export type TaskRequest = z.infer<typeof taskRequestSchema>

// Task types
export const TASK_TYPES = {
  single_choice: 'single_choice',
  yes_no: 'yes_no',
  ordering: 'ordering',
  fill_in_blank: 'fill_in_blank',
  number_input: 'number_input',
  multi_select: 'multi_select',
} as const
export type TaskType = (typeof TASK_TYPES)[keyof typeof TASK_TYPES]

// Difficulty Levels
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export interface TaskUsageInfo {
  inputTokens: number
  outputTokens: number
  totalTokens?: number
  cost?: number // Cost in USD
}

export interface BaseTask {
  taskId: string
  title: string
  task: string
  hints?: string[]
  type: TaskType
  usage?: TaskUsageInfo
}

export interface SingleChoiceTask extends BaseTask {
  type: 'single_choice'
  options: Array<{
    text: string
    isCorrect: boolean
  }>
  explanation: string
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
  fillableText: string
  blanks: Array<{
    id: number
    acceptedAnswers: string[]
    caseSensitive: boolean
  }>
  explanation: string
}

export interface NumberInputTask extends BaseTask {
  type: 'number_input'
  answer: number // The correct numeric value (required)
  unit?: string // Correct unit (when unitOptions present) OR display unit
  unitOptions?: string[] // Optional: if present, student must choose
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

export type Task =
  | SingleChoiceTask
  | YesNoTask
  | OrderingTask
  | FillInBlankTask
  | NumberInputTask
  | MultiSelectTask

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
