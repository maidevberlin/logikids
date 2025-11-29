import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { StorageService } from './storage'
import { SyncPayload, SyncPayloadSchema } from './schema.ts'
import { createLogger } from '../common/logger'
import { InvalidChecksumError } from '../common/errors'

const logger = createLogger('SyncService')

/**
 * Business logic for encrypted data synchronization
 *
 * ZERO-KNOWLEDGE GUARANTEE:
 * This service only handles encrypted blobs. It cannot and does not
 * attempt to decrypt user data. All encryption/decryption happens
 * client-side using keys that never leave the user's devices.
 */
@injectable()
export class SyncService {
  constructor(@inject(StorageService) private readonly storage: StorageService) {}

  /**
   * Upload encrypted user data
   */
  async upload(userId: string, payload: SyncPayload): Promise<void> {
    // Validate payload
    const validated = SyncPayloadSchema.parse(payload)

    // Validate checksum format (basic sanity check)
    if (!/^[a-f0-9]{64}$/i.test(validated.checksum)) {
      throw new InvalidChecksumError()
    }

    // Store encrypted blob
    await this.storage.store(userId, validated)
  }

  /**
   * Download encrypted user data
   */
  async download(userId: string): Promise<SyncPayload | null> {
    const record = await this.storage.get(userId)

    if (!record) {
      return null
    }

    // Return only the sync payload (not internal metadata)
    return {
      encryptedBlob: record.encryptedBlob,
      iv: record.iv,
      timestamp: record.timestamp,
      checksum: record.checksum,
    }
  }

  /**
   * Verify user exists
   */
  async verify(userId: string): Promise<boolean> {
    return await this.storage.exists(userId)
  }

  /**
   * Delete user data (GDPR right to erasure)
   */
  async deleteUser(userId: string): Promise<void> {
    await this.storage.delete(userId)
  }

  /**
   * Cleanup task: Delete accounts inactive for 2+ years
   */
  async cleanupInactiveAccounts(): Promise<number> {
    const inactiveDays = 365 * 2 // 2 years
    const deletedCount = await this.storage.deleteInactive(inactiveDays)

    if (deletedCount > 0) {
      logger.info('Deleted inactive accounts', { deletedCount })
    }

    return deletedCount
  }
}
