import { ApplicationError } from './base'

/**
 * Thrown when input validation fails
 *
 * @example
 * ```typescript
 * if (hasUnreplacedPlaceholders(template)) {
 *   throw new ValidationError('Template contains unreplaced placeholders');
 * }
 * ```
 */
export class ValidationError extends ApplicationError {
  constructor(public readonly details: string) {
    super('Validation Error', 400, 'VALIDATION_ERROR')
  }
}

/**
 * Thrown when a required field is missing
 *
 * @example
 * ```typescript
 * if (!req.body.taskId) {
 *   throw new MissingFieldError('taskId');
 * }
 * ```
 */
export class MissingFieldError extends ApplicationError {
  constructor(fieldName: string) {
    super(`${fieldName} is required`, 400, 'MISSING_FIELD')
  }
}

/**
 * Thrown when file or data format is invalid
 *
 * @example
 * ```typescript
 * if (!hasRequiredKeys(data)) {
 *   throw new InvalidFormatError('variations.yaml', 'missing required arrays');
 * }
 * ```
 */
export class InvalidFormatError extends ApplicationError {
  constructor(fileName: string, reason: string) {
    super(`Invalid ${fileName} format: ${reason}`, 400, 'INVALID_FORMAT')
  }
}

/**
 * Thrown when solution validation fails (e.g., invalid unit options)
 *
 * @example
 * ```typescript
 * if (unitOptions && !unit) {
 *   throw new InvalidSolutionError('unitOptions provided without unit');
 * }
 * ```
 */
export class InvalidSolutionError extends ApplicationError {
  constructor(reason: string) {
    super(`Invalid solution: ${reason}`, 400, 'INVALID_SOLUTION')
  }
}
