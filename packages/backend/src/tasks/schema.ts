import { z } from 'zod';
import { Request } from 'express';
import { subjectRegistry } from '../subjects/registry';

/**
 * Shared filter schema for task-related endpoints
 * Used for filtering subjects and concepts by grade/age/difficulty
 */
const taskFilterSchema = z.object({
  grade: z.coerce.number().int().min(1).max(13).optional(),
  age: z.coerce.number().int().min(1).max(100).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  language: z.string().min(2).max(5).optional()
});

/**
 * Query parameters for GET /subjects
 */
export const getSubjectsQuerySchema = taskFilterSchema;

/**
 * Query parameters for GET /subjects/:subject/concepts
 */
export const getConceptsQuerySchema = taskFilterSchema.extend({
  source: z.enum(['curriculum', 'custom']).optional()
});

/**
 * URL parameter for subject routes
 */
export const subjectParamSchema = z.object({
  subjectId: z.string().refine(
    val => subjectRegistry.get(val) !== undefined,
    val => ({ message: `Invalid subject: ${val}` })
  )
});

// Inferred types
export type TaskFilterQuery = z.infer<typeof taskFilterSchema>;
export type GetSubjectsQuery = z.infer<typeof getSubjectsQuerySchema>;
export type GetConceptsQuery = z.infer<typeof getConceptsQuerySchema>;
export type SubjectParam = z.infer<typeof subjectParamSchema>;

// Request types with validated schemas using Express generic parameters
// Request<Params, ResponseBody, RequestBody, QueryParams>
export type GetSubjectsRequest = Request<{}, any, any, GetSubjectsQuery>;
export type GetConceptsRequest = Request<SubjectParam, any, any, GetConceptsQuery>;
