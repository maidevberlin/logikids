import { ApplicationError } from './base'

/**
 * Thrown when AI task generation fails
 *
 * @example
 * ```typescript
 * try {
 *   const task = await aiClient.generate(prompt);
 * } catch (err) {
 *   throw new TaskGenerationError('AI provider timeout', err);
 * }
 * ```
 */
export class TaskGenerationError extends ApplicationError {
  constructor(message: string, cause?: unknown) {
    super(message, 500, 'TASK_GENERATION_FAILED', cause)
  }
}

/**
 * Thrown when no tasks are found matching the given criteria
 *
 * @example
 * ```typescript
 * const tasks = await findTasks({ subject, difficulty });
 * if (tasks.length === 0) {
 *   throw new NoTasksFoundError();
 * }
 * ```
 */
export class NoTasksFoundError extends ApplicationError {
  constructor(message: string = 'No tasks found') {
    super(message, 404, 'NO_TASKS_FOUND')
  }
}

/**
 * Thrown when task request parameters are invalid
 *
 * @example
 * ```typescript
 * if (!isValidDifficulty(difficulty)) {
 *   throw new InvalidTaskParametersError('Invalid difficulty level');
 * }
 * ```
 */
export class InvalidTaskParametersError extends ApplicationError {
  constructor(message: string) {
    super(message, 400, 'INVALID_PARAMETERS')
  }
}

/**
 * Thrown when a requested subject is not found
 *
 * @example
 * ```typescript
 * const subject = subjectRegistry.get(subjectId);
 * if (!subject) {
 *   throw new SubjectNotFoundError(subjectId);
 * }
 * ```
 */
export class SubjectNotFoundError extends ApplicationError {
  constructor(subjectId: string) {
    super(`Subject ${subjectId} not found`, 404, 'SUBJECT_NOT_FOUND')
  }
}

/**
 * Thrown when a requested concept is not found within a subject
 *
 * @example
 * ```typescript
 * const concept = subjectRegistry.getConcept(subjectId, conceptId);
 * if (!concept) {
 *   throw new ConceptNotFoundError(conceptId, subjectId);
 * }
 * ```
 */
export class ConceptNotFoundError extends ApplicationError {
  constructor(conceptId: string, subjectId?: string) {
    const message = subjectId
      ? `Concept ${conceptId} not found in subject ${subjectId}`
      : `Concept ${conceptId} not found`
    super(message, 404, 'CONCEPT_NOT_FOUND')
  }
}

/**
 * Thrown when no concepts match the given criteria
 *
 * @example
 * ```typescript
 * const concept = getRandomConcept(subjectId, { grade, difficulty });
 * if (!concept) {
 *   throw new NoConceptsFoundError({ subject: subjectId, grade, difficulty });
 * }
 * ```
 */
export class NoConceptsFoundError extends ApplicationError {
  constructor(criteria: { subject: string; grade?: number; difficulty?: string }) {
    const parts: string[] = [`subject ${criteria.subject}`]
    if (criteria.grade !== undefined) parts.push(`grade ${criteria.grade}`)
    if (criteria.difficulty) parts.push(`difficulty ${criteria.difficulty}`)

    super(`No concepts found for ${parts.join(', ')}`, 404, 'NO_CONCEPTS_FOUND')
  }
}

/**
 * Thrown when a requested task type is not found
 *
 * @example
 * ```typescript
 * const taskType = taskTypeRegistry.get(taskTypeId);
 * if (!taskType) {
 *   throw new TaskTypeNotFoundError(taskTypeId);
 * }
 * ```
 */
export class TaskTypeNotFoundError extends ApplicationError {
  constructor(taskTypeId: string) {
    super(`Task type ${taskTypeId} not found`, 404, 'TASK_TYPE_NOT_FOUND')
  }
}

/**
 * Thrown when no task types are available
 *
 * @example
 * ```typescript
 * const types = taskTypeRegistry.getAll();
 * if (types.length === 0) {
 *   throw new NoTaskTypesError();
 * }
 * ```
 */
export class NoTaskTypesError extends ApplicationError {
  constructor(message: string = 'No task types available') {
    super(message, 500, 'NO_TASK_TYPES')
  }
}

/**
 * Thrown when a task is not found in the cache (usually expired)
 *
 * @example
 * ```typescript
 * const context = taskCache.get(taskId);
 * if (!context) {
 *   throw new TaskNotFoundError(taskId);
 * }
 * ```
 */
export class TaskNotFoundError extends ApplicationError {
  constructor(taskId?: string, message: string = 'Task not found or expired') {
    super(message, 404, 'TASK_NOT_FOUND')
  }
}

/**
 * Thrown when all hints for a task have been exhausted
 *
 * @example
 * ```typescript
 * if (context.hintsGenerated.length >= MAX_HINTS) {
 *   throw new AllHintsUsedError();
 * }
 * ```
 */
export class AllHintsUsedError extends ApplicationError {
  constructor(message: string = 'All hints have been used') {
    super(message, 400, 'ALL_HINTS_USED')
  }
}
