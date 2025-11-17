/**
 * Centralized logging infrastructure for the backend.
 *
 * Provides structured logging with context and metadata support.
 * Debug logs are automatically suppressed in production environments.
 *
 * @example
 * ```typescript
 * const logger = createLogger('TaskService');
 * logger.info('Task generated successfully', { taskId: 123 });
 * logger.error('Failed to generate task', error, { userId: 456 });
 * ```
 */

/**
 * Logger class providing structured logging with context.
 */
export class Logger {
  /**
   * Creates a new Logger instance.
   * @param context - The context identifier (e.g., service name, module name)
   */
  constructor(private context: string) {}

  /**
   * Logs a debug message. Only outputs in development mode (NODE_ENV !== 'production').
   * Use for detailed diagnostic information useful during development.
   *
   * @param message - The log message
   * @param meta - Optional metadata object to include
   */
  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${this.context}] ${message}`, meta || '')
    }
  }

  /**
   * Logs an informational message.
   * Use for general application flow information.
   *
   * @param message - The log message
   * @param meta - Optional metadata object to include
   */
  info(message: string, meta?: Record<string, unknown>): void {
    console.info(`[${this.context}] ${message}`, meta || '')
  }

  /**
   * Logs a warning message.
   * Use for potentially harmful situations that don't prevent normal operation.
   *
   * @param message - The log message
   * @param data - Optional error or metadata to include
   */
  warn(message: string, data?: unknown): void {
    console.warn(`[${this.context}] ${message}`, data ?? '')
  }

  /**
   * Logs an error message with optional error object.
   * Use for error events that might still allow the application to continue running.
   *
   * @param message - The log message
   * @param error - Optional error (any type from catch blocks)
   * @param meta - Optional metadata object to include
   */
  error(message: string, error?: unknown, meta?: Record<string, unknown>): void {
    console.error(`[${this.context}] ${message}`, { error, ...meta })
  }
}

/**
 * Factory function to create a logger instance with the specified context.
 *
 * @param context - The context identifier (e.g., service name, module name)
 * @returns A new Logger instance
 *
 * @example
 * ```typescript
 * const logger = createLogger('UserService');
 * logger.info('User logged in', { userId: 123 });
 * ```
 */
export function createLogger(context: string): Logger {
  return new Logger(context)
}
