/**
 * Minimal error class for the Logikids backend
 *
 * Replaces the complex error hierarchy with a single lightweight class
 * that includes just a message and HTTP status code.
 *
 * @example Basic usage
 * ```typescript
 * import { AppError, notFound, badRequest } from '../common/errors';
 *
 * // Throw with status code
 * throw new AppError('User not found', 404);
 *
 * // Use factory functions
 * throw notFound('Task not found or expired');
 * throw badRequest('Invalid parameters');
 * ```
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    cause?: unknown
  ) {
    super(message, cause !== undefined ? { cause } : undefined)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Factory functions for common HTTP error codes
 */

export function badRequest(message: string, cause?: unknown): AppError {
  return new AppError(message, 400, cause)
}

export function unauthorized(message: string = 'Not authenticated', cause?: unknown): AppError {
  return new AppError(message, 401, cause)
}

export function forbidden(message: string = 'Access forbidden', cause?: unknown): AppError {
  return new AppError(message, 403, cause)
}

export function notFound(message: string, cause?: unknown): AppError {
  return new AppError(message, 404, cause)
}

export function internalError(message: string, cause?: unknown): AppError {
  return new AppError(message, 500, cause)
}
