import { Task, MultipleChoiceTask, YesNoTask } from '../types'

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
  onHintUsed: () => void
  hints: string[]
  requestHint: () => void
  hintLoading: boolean
  hintError: string | null
  canRequestHint: boolean
} 