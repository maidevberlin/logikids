import { promises as fs } from 'fs'
import path from 'path'
import { SyncRecord, SyncPayload } from './sync.schema'

/**
 * File-based storage for encrypted user data
 * Each user gets a JSON file: data/sync/{userId}.json
 *
 * SECURITY NOTE: Files contain encrypted data only.
 * Server cannot decrypt without user's encryption key.
 */
export class StorageService {
  private readonly storageDir: string

  constructor(storageDir = path.join(process.cwd(), 'data', 'sync')) {
    this.storageDir = storageDir
  }

  /**
   * Initialize storage directory
   */
  async init(): Promise<void> {
    try {
      await fs.mkdir(this.storageDir, { recursive: true })
      console.log(`[StorageService] Initialized storage at: ${this.storageDir}`)
    } catch (error) {
      console.error('[StorageService] Failed to initialize storage:', error)
      throw new Error('Storage initialization failed')
    }
  }

  /**
   * Store or update encrypted user data
   */
  async store(userId: string, payload: SyncPayload): Promise<void> {
    const now = new Date()

    // Get existing record to preserve createdAt
    let createdAt = now
    try {
      const existing = await this.get(userId)
      if (existing) {
        createdAt = existing.createdAt
      }
    } catch {
      // New record, use now as createdAt
    }

    const record: SyncRecord = {
      userId,
      ...payload,
      createdAt,
      lastAccessed: now,
      blobSize: Buffer.from(payload.encryptedBlob, 'base64').length,
    }

    const filePath = this.getFilePath(userId)
    await fs.writeFile(filePath, JSON.stringify(record, null, 2), 'utf-8')
  }

  /**
   * Retrieve encrypted user data
   */
  async get(userId: string): Promise<SyncRecord | null> {
    try {
      const filePath = this.getFilePath(userId)
      const content = await fs.readFile(filePath, 'utf-8')
      const record = JSON.parse(content) as SyncRecord

      // Update last accessed
      record.lastAccessed = new Date()
      await fs.writeFile(filePath, JSON.stringify(record, null, 2), 'utf-8')

      return record
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null // User not found
      }
      throw error
    }
  }

  /**
   * Delete user data (GDPR right to erasure)
   */
  async delete(userId: string): Promise<void> {
    try {
      const filePath = this.getFilePath(userId)
      await fs.unlink(filePath)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // Already deleted, ignore
        return
      }
      throw error
    }
  }

  /**
   * Check if user exists
   */
  async exists(userId: string): Promise<boolean> {
    const record = await this.get(userId)
    return record !== null
  }

  /**
   * Get all user IDs (for cleanup tasks)
   */
  async getAllUserIds(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.storageDir)
      return files
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''))
    } catch {
      return []
    }
  }

  /**
   * Delete inactive accounts (GDPR compliance)
   * Deletes accounts not accessed in specified days
   */
  async deleteInactive(inactiveDays: number): Promise<number> {
    const userIds = await this.getAllUserIds()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - inactiveDays)

    let deletedCount = 0

    for (const userId of userIds) {
      const record = await this.get(userId)
      if (record && record.lastAccessed < cutoffDate) {
        await this.delete(userId)
        deletedCount++
      }
    }

    return deletedCount
  }

  private getFilePath(userId: string): string {
    return path.join(this.storageDir, `${userId}.json`)
  }
}
