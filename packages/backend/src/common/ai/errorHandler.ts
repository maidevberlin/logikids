/**
 * Generic error handling utility for AI provider operations.
 *
 * Wraps AI provider calls with consistent error handling.
 *
 * @example
 * ```typescript
 * return withErrorHandling(
 *   () => this.client.chat.completions.create(params),
 *   'OpenAI chat completion'
 * );
 * ```
 */

/**
 * Executes an async operation with standardized error handling.
 *
 * @template T - The return type of the operation
 * @param operation - The async operation to execute
 * @param context - Description of the operation (e.g., "OpenAI chat completion")
 * @returns The result of the operation
 * @throws Re-throws any error
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    throw error
  }
}
