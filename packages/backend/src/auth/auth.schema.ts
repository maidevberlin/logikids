import { z } from 'zod';
import { Request } from 'express';

/**
 * Schema for user registration
 * Requires valid UUID and properly formatted invite code
 */
export const registerSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
  inviteCode: z.string().regex(
    /^[A-Z0-9]{4}-[A-Z0-9]{4}$/i,
    'Invalid invite code format. Expected format: XXXX-YYYY'
  )
});

/**
 * Schema for user login
 * Requires valid UUID
 */
export const loginSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID')
});

/**
 * Schema for token refresh
 * Requires valid UUID for userId
 */
export const refreshSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID')
});

/**
 * URL parameter schema for userId
 * Used in routes like /sync/:userId
 */
export const userIdParamSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID')
});

// Inferred types
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RefreshRequest = z.infer<typeof refreshSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;

// Request types with validated schemas using Express generic parameters
// Request<Params, ResponseBody, RequestBody, QueryParams>
export type RegisterRequestTyped = Request<{}, any, RegisterRequest>;
export type LoginRequestTyped = Request<{}, any, LoginRequest>;
export type RefreshRequestTyped = Request<{}, any, RefreshRequest>;
