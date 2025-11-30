import { Request, Response, NextFunction } from 'express';
import { ApplicationError, ValidationError } from '../errors';
import { ZodError, ZodIssue } from 'zod';
import { createLogger } from '../logger';

const logger = createLogger('ErrorHandler');

interface ErrorResponse {
  error: string;
  code?: string;
  details?: string | ZodIssue[];
  status: number;
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Error:', error);

  let response: ErrorResponse = {
    error: 'Internal Server Error',
    status: 500
  };

  if (error instanceof ApplicationError) {
    response = {
      error: error.message,
      code: error.code,
      status: error.statusCode
    };

    // Special handling for ValidationError which has details
    if (error instanceof ValidationError) {
      response.details = error.details;
    }
  } else if (error instanceof ZodError) {
    response = {
      error: 'Validation Error',
      code: 'VALIDATION_ERROR',
      details: error.errors,
      status: 400
    };
  }

  res.status(response.status).json({
    error: response.error,
    ...(response.code ? { code: response.code } : {}),
    ...((response.details ? { details: response.details } : {}) as object)
  });
} 