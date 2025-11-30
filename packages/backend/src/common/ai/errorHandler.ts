/**
 * Generic error handling utility for AI provider operations.
 *
 * Wraps AI provider calls with consistent error handling and timing metrics.
 * Logs errors with execution duration and context information.
 *
 * @example
 * ```typescript
 * return withErrorHandling(
 *   () => this.client.chat.completions.create(params),
 *   'OpenAI chat completion',
 *   this.logger
 * );
 * ```
 */

import type { Logger } from '../logger'

/**
 * Executes an async operation with standardized error handling and timing.
 *
 * @template T - The return type of the operation
 * @param operation - The async operation to execute
 * @param context - Description of the operation (e.g., "OpenAI chat completion")
 * @param logger - Logger instance for error reporting
 * @returns The result of the operation
 * @throws Re-throws any error after logging with timing information
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  logger: Logger
): Promise<T> {
  const startTime = Date.now()
  try {
    return await operation()
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error(
      `${context} failed after ${duration}ms`,
      error instanceof Error ? error : new Error('Unknown error'),
      { context, duration }
    )
    throw error
  }
}
