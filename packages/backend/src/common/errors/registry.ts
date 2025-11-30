import { ApplicationError } from './base';

/**
 * Thrown when registry initialization fails
 *
 * @example
 * ```typescript
 * try {
 *   await subjectRegistry.initialize();
 * } catch (err) {
 *   throw new RegistryInitializationError('SubjectRegistry', err);
 * }
 * ```
 */
export class RegistryInitializationError extends ApplicationError {
  constructor(registryName: string, cause?: unknown) {
    super(`Failed to initialize ${registryName}`, 500, 'REGISTRY_INITIALIZATION_ERROR', cause);
  }
}

/**
 * Thrown when JSON schema for a task type is missing
 *
 * @example
 * ```typescript
 * if (!taskType.jsonSchema) {
 *   throw new NoJsonSchemaError(taskTypeId);
 * }
 * ```
 */
export class NoJsonSchemaError extends ApplicationError {
  constructor(taskTypeId: string) {
    super(`No JSON schema found for task type: ${taskTypeId}`, 500, 'NO_JSON_SCHEMA');
  }
}
