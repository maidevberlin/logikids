/**
 * Error class hierarchy for the Logikids backend
 *
 * This module provides typed error classes for all domain errors,
 * replacing string-based error handling with proper error instances
 * that include HTTP status codes and error codes.
 *
 * @example Basic usage
 * ```typescript
 * import { UserExistsError, InviteNotFoundError } from '../common/errors';
 *
 * // Throw typed errors
 * if (existingUser) {
 *   throw new UserExistsError(userId);
 * }
 *
 * // Catch and handle with proper status codes
 * try {
 *   await registerUser(userId, inviteCode);
 * } catch (error) {
 *   if (error instanceof UserExistsError) {
 *     res.status(error.statusCode).json({ error: error.message });
 *   }
 * }
 * ```
 *
 * @module errors
 */

// Base error class
export { ApplicationError } from './base';

// Authentication and authorization errors
export {
  UserExistsError,
  UserNotFoundError,
  AccountNotFoundError,
  AccountRevokedError,
  InvalidCredentialsError,
  UnauthorizedError,
  ForbiddenError
} from './auth';

// Invite code errors
export {
  InviteNotFoundError,
  InvalidInviteError,
  InviteExpiredError,
  InviteAlreadyUsedError
} from './invite';

// Task generation and management errors
export {
  TaskGenerationError,
  NoTasksFoundError,
  InvalidTaskParametersError,
  SubjectNotFoundError,
  ConceptNotFoundError,
  NoConceptsFoundError,
  TaskTypeNotFoundError,
  NoTaskTypesError,
  TaskNotFoundError,
  AllHintsUsedError
} from './task';

// Sync errors
export { InvalidChecksumError } from './sync';

// Configuration errors
export { ConfigurationError, UnsupportedProviderError } from './config';

// AI provider errors
export {
  EmptyAIResponseError,
  AIProviderError,
  AIGenerationError,
  NoToolUseError
} from './ai';

// Database errors
export { DatabaseConnectionError } from './database';

// Prompt template errors
export { PromptTemplateError, HintPromptNotLoadedError } from './prompt';

// Validation errors
export {
  ValidationError,
  MissingFieldError,
  InvalidFormatError,
  InvalidSolutionError
} from './validation';

// Registry errors
export { RegistryInitializationError, NoJsonSchemaError } from './registry';
