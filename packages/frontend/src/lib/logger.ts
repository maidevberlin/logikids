/**
 * Frontend logger implementation
 * Provides centralized logging with context and environment-aware debug logging
 */

/**
 * Check if running in development mode
 * Can be mocked in tests by reassigning this function
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV
}

export class Logger {
  constructor(private context: string) {}

  /**
   * Debug logging - only active in development mode
   */
  debug(message: string, meta?: Record<string, unknown>): void {
    // Only log in development
    if (isDevelopment()) {
      console.debug(`[${this.context}] ${message}`, meta || '')
    }
  }

  /**
   * Info logging - always active
   */
  info(message: string, meta?: Record<string, unknown>): void {
    console.info(`[${this.context}] ${message}`, meta || '')
  }

  /**
   * Warning logging - always active
   */
  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(`[${this.context}] ${message}`, meta || '')
  }

  /**
   * Error logging - always active
   */
  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    console.error(`[${this.context}] ${message}`, { error, ...meta })
  }
}

/**
 * Factory function for creating logger instances
 * @param context - The context/module name for the logger
 * @returns A new Logger instance
 */
export function createLogger(context: string): Logger {
  return new Logger(context)
}
