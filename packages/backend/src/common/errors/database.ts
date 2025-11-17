import { ApplicationError } from './base';

/**
 * Thrown when database connection fails
 *
 * @example
 * ```typescript
 * try {
 *   await pool.connect();
 * } catch (err) {
 *   throw new DatabaseConnectionError(err);
 * }
 * ```
 */
export class DatabaseConnectionError extends ApplicationError {
  constructor(public readonly cause?: unknown) {
    super('Failed to connect to PostgreSQL database', 500, 'DATABASE_CONNECTION_ERROR');
  }
}
