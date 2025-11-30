import { ApplicationError } from './base'

/**
 * Thrown when an invite code is not found in the database
 *
 * @example
 * ```typescript
 * const invite = await getInviteByCode(code);
 * if (!invite) {
 *   throw new InviteNotFoundError(code);
 * }
 * ```
 */
export class InviteNotFoundError extends ApplicationError {
  constructor(code?: string) {
    const message = code ? `Invite code not found: ${code}` : 'Invite code not found'
    super(message, 404, 'INVITE_NOT_FOUND')
  }
}

/**
 * Thrown when an invite code is invalid for a specific reason
 *
 * @example
 * ```typescript
 * if (!isValidFormat(code)) {
 *   throw new InvalidInviteError('Invalid code format');
 * }
 * ```
 */
export class InvalidInviteError extends ApplicationError {
  constructor(reason: string) {
    super(`Invalid invite: ${reason}`, 400, 'INVALID_INVITE')
  }
}

/**
 * Thrown when an invite code has passed its expiration date
 *
 * @example
 * ```typescript
 * if (invite.expiresAt < new Date()) {
 *   throw new InviteExpiredError();
 * }
 * ```
 */
export class InviteExpiredError extends ApplicationError {
  constructor(message: string = 'Invite code expired') {
    super(message, 400, 'INVITE_EXPIRED')
  }
}

/**
 * Thrown when an invite code has already been used
 *
 * @example
 * ```typescript
 * if (invite.usedAt) {
 *   throw new InviteAlreadyUsedError();
 * }
 * ```
 */
export class InviteAlreadyUsedError extends ApplicationError {
  constructor(message: string = 'Invite code already used') {
    super(message, 400, 'INVITE_USED')
  }
}
