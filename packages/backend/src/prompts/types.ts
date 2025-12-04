import { Subject } from './loader'
import { TaskTypeWithSchema } from '../tasks/task-types'
import { Concept } from './schemas'
import { Difficulty } from '../tasks/types'

/**
 * Parameters required to build a complete prompt
 */
export interface PromptBuildingParams {
  subject: Subject // From subjectRegistry
  taskType: TaskTypeWithSchema // From taskTypeRegistry
  concept: Concept // From subjectRegistry
  grade: number // Grade level (used in templates and filtering)
  difficulty: Difficulty // Task difficulty
  language: string // Response language (e.g., "en", "de")
}
