import { Request, Response, NextFunction } from 'express';
import { ApplicationError, ValidationError, AIGenerationError } from '../errors';
import { ZodError } from 'zod';

interface ErrorResponse {
  error: string;
  details?: unknown;
  status: number;
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', error);

  let response: ErrorResponse = {
    error: 'Internal Server Error',
    status: 500
  };

  if (error instanceof ApplicationError) {
    response = {
      error: error.message,
      details: error.details,
      status: error.statusCode
    };
  } else if (error instanceof ZodError) {
    response = {
      error: 'Validation Error',
      details: error.errors,
      status: 400
    };
  }

  // Specific error handling for known error types
  if (error instanceof ValidationError) {
    response = {
      error: 'Validation Error',
      details: error.details,
      status: 400
    };
  } else if (error instanceof AIGenerationError) {
    response = {
      error: error.message,
      status: 500
    };
  }

  res.status(response.status).json({
    error: response.error,
    ...((response.details ? { details: response.details } : {}) as object)
  });
} 