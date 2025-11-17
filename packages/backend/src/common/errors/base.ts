/**
 * Base error class for all application errors
 *
 * All domain-specific errors should extend this class.
 * Includes HTTP status code and optional error code for client handling.
 *
 * @example
 * ```typescript
 * class CustomError extends ApplicationError {
 *   constructor(message: string) {
 *     super(message, 400, 'CUSTOM_ERROR');
 *   }
 * }
 * ```
 */
export abstract class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
