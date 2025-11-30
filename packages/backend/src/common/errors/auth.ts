import { ApplicationError } from './base'

/**
 * Thrown when a user attempts to register with a userId that already exists
 *
 * @example
 * ```typescript
 * const existingUser = await getUserById(userId);
 * if (existingUser) {
 *   throw new UserExistsError(userId);
 * }
 * ```
 */
export class UserExistsError extends ApplicationError {
  constructor(userId?: string) {
    const message = userId ? `User ID already exists: ${userId}` : 'User ID already exists'
    super(message, 409, 'USER_EXISTS')
  }
}

/**
 * Thrown when attempting to access or authenticate a user that doesn't exist
 *
 * @example
 * ```typescript
 * const user = await getUserById(userId);
 * if (!user) {
 *   throw new UserNotFoundError();
 * }
 * ```
 */
export class UserNotFoundError extends ApplicationError {
  constructor(message: string = 'User not found') {
    super(message, 404, 'USER_NOT_FOUND')
  }
}

/**
 * Thrown when account lookup fails (legacy compatibility)
 *
 * @example
 * ```typescript
 * const account = await getAccount(userId);
 * if (!account) {
 *   throw new AccountNotFoundError();
 * }
 * ```
 */
export class AccountNotFoundError extends ApplicationError {
  constructor(message: string = 'Account not found') {
    super(message, 404, 'ACCOUNT_NOT_FOUND')
  }
}

/**
 * Thrown when a user account has been revoked/deactivated
 *
 * @example
 * ```typescript
 * if (account.isRevoked) {
 *   throw new AccountRevokedError();
 * }
 * ```
 */
export class AccountRevokedError extends ApplicationError {
  constructor(message: string = 'Account has been revoked') {
    super(message, 403, 'ACCOUNT_REVOKED')
  }
}

/**
 * Thrown when authentication credentials are invalid
 *
 * @example
 * ```typescript
 * if (!isValidPassword(password)) {
 *   throw new InvalidCredentialsError();
 * }
 * ```
 */
export class InvalidCredentialsError extends ApplicationError {
  constructor(message: string = 'Invalid credentials') {
    super(message, 401, 'INVALID_CREDENTIALS')
  }
}

/**
 * Thrown when authentication is required but not provided
 *
 * @example
 * ```typescript
 * if (!req.headers.authorization) {
 *   throw new UnauthorizedError();
 * }
 * ```
 */
export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

/**
 * Thrown when a user attempts to access another user's data
 *
 * @example
 * ```typescript
 * if (req.userId !== resourceOwnerId) {
 *   throw new ForbiddenError('Cannot access another user\'s data');
 * }
 * ```
 */
export class ForbiddenError extends ApplicationError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN')
  }
}
