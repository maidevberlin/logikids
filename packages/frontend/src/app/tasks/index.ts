export { TaskPage } from './TaskPage'
export { DifficultyBanner } from './DifficultyBanner'
export { TaskCard } from './TaskCard'
export { TaskPageHeader } from './TaskPageHeader'
export { useTask } from './useTask'
export { useTaskAnswer } from './useTaskAnswer'

// Hints
export { HintSection, useHint } from './hints'

// Types
export { taskRequestSchema, TASK_TYPES, DIFFICULTIES } from './types'
export type {
  TaskRequest,
  TaskType,
  Difficulty,
  TaskUsageInfo,
  BaseTask,
  SingleChoiceTask,
  YesNoTask,
  OrderingTask,
  FillInBlankTask,
  NumberInputTask,
  MultiSelectTask,
  Task,
  TaskAnswerType,
} from './types'

// Answer type components
export {
  YesNoAnswer,
  SingleChoiceAnswer,
  FillInBlankAnswer,
  NumberInputAnswer,
  OrderingAnswer,
  MultiSelectAnswer,
  AnswerOptionCard,
  answerTypeComponents,
} from './answer-types'
