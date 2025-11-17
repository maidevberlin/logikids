import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type RequestProperty = 'body' | 'query' | 'params';

/**
 * Factory function to create validation middleware for different request properties
 * Eliminates code duplication across body/query/params validators
 */
function createValidator(property: RequestProperty) {
  return <T extends ZodSchema>(schema: T) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req[property] = schema.parse(req[property]);
        next();
      } catch (error) {
        next(error); // ZodError → error handler → 400 response
      }
    };
  };
}

/**
 * Validates request body against a Zod schema
 */
export const validateBody = createValidator('body');

/**
 * Validates query parameters against a Zod schema
 * Handles string-to-number coercion automatically
 */
export const validateQuery = createValidator('query');

/**
 * Validates URL parameters against a Zod schema
 */
export const validateParams = createValidator('params');
