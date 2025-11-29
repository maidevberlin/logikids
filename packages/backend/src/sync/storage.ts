import 'reflect-metadata';
import { injectable } from 'tsyringe';
import { pool } from '../../database/db'
import { SyncRecord, SyncPayload } from './schema.ts'
import { createLogger } from '../common/logger'

const logger = createLogger('StorageService')

/**
 * PostgreSQL-based storage for encrypted user data
 * Each user gets a row: user_sync_data table
 *
 * SECURITY NOTE: Database contains encrypted data only.
 * Server cannot decrypt without user's encryption key.
 */
@injectable()
export class StorageService {
  /**
   * Initialize storage (no-op for PostgreSQL, kept for interface compatibility)
   */
  async init(): Promise<void> {
    logger.info('Using PostgreSQL storage')
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

    const blobSize = Buffer.from(payload.encryptedBlob, 'base64').length

    // Upsert query (INSERT or UPDATE if exists)
    const query = `
      INSERT INTO user_sync_data (
        user_id, encrypted_blob, iv, timestamp, checksum,
        created_at, last_accessed, blob_size
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id) DO UPDATE SET
        encrypted_blob = EXCLUDED.encrypted_blob,
        iv = EXCLUDED.iv,
        timestamp = EXCLUDED.timestamp,
        checksum = EXCLUDED.checksum,
        last_accessed = EXCLUDED.last_accessed,
        blob_size = EXCLUDED.blob_size
    `

    const values = [
      userId,
      payload.encryptedBlob,
      payload.iv,
      payload.timestamp,
      payload.checksum,
      createdAt,
      now,
      blobSize,
    ]

    await pool.query(query, values)
  }

  /**
   * Retrieve encrypted user data
   */
  async get(userId: string): Promise<SyncRecord | null> {
    // Fetch record
    const selectQuery = 'SELECT * FROM user_sync_data WHERE user_id = $1'
    const result = await pool.query(selectQuery, [userId])

    if (result.rows.length === 0) {
      return null // User not found
    }

    const row = result.rows[0]

    // Update last accessed timestamp
    const updateQuery = 'UPDATE user_sync_data SET last_accessed = NOW() WHERE user_id = $1'
    await pool.query(updateQuery, [userId])

    // Map database row to SyncRecord
    return {
      userId: row.user_id,
      encryptedBlob: row.encrypted_blob,
      iv: row.iv,
      timestamp: row.timestamp,
      checksum: row.checksum,
      createdAt: row.created_at,
      lastAccessed: row.last_accessed,
      blobSize: row.blob_size,
    }
  }

  /**
   * Delete user data (GDPR right to erasure)
   */
  async delete(userId: string): Promise<void> {
    const query = 'DELETE FROM user_sync_data WHERE user_id = $1'
    await pool.query(query, [userId])
  }

  /**
   * Check if user exists
   */
  async exists(userId: string): Promise<boolean> {
    const query = 'SELECT 1 FROM user_sync_data WHERE user_id = $1 LIMIT 1'
    const result = await pool.query(query, [userId])
    return result.rows.length > 0
  }

  /**
   * Get all user IDs (for cleanup tasks)
   */
  async getAllUserIds(): Promise<string[]> {
    const query = 'SELECT user_id FROM user_sync_data'
    const result = await pool.query(query)
    return result.rows.map(row => row.user_id)
  }

  /**
   * Delete inactive accounts (GDPR compliance)
   * Deletes accounts not accessed in specified days
   */
  async deleteInactive(inactiveDays: number): Promise<number> {
    const query = `
      DELETE FROM user_sync_data
      WHERE last_accessed < NOW() - INTERVAL '1 day' * $1
    `
    const result = await pool.query(query, [inactiveDays])
    return result.rowCount || 0
  }
}
