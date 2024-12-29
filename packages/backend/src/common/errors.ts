export class ApplicationError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends ApplicationError {
  constructor(details: unknown) {
    super('Validation Error', 400, details);
  }
}

export class AIGenerationError extends ApplicationError {
  constructor(message: string) {
    super(message, 500);
  }
} 