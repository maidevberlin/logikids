/**
 * Custom error class for Logikids API errors
 */
export class LogikidsApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LogikidsApiError'
  }
}
