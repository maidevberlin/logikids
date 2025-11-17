import { ApplicationError } from './base';

/**
 * Thrown when sync data checksum is in invalid format
 *
 * @example
 * ```typescript
 * if (!/^[a-f0-9]{64}$/i.test(checksum)) {
 *   throw new InvalidChecksumError();
 * }
 * ```
 */
export class InvalidChecksumError extends ApplicationError {
  constructor(message: string = 'Invalid checksum format') {
    super(message, 400, 'INVALID_CHECKSUM');
  }
}
