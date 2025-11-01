import { pool } from '../sync/db'

export interface InviteCode {
  code: string
  created_at: number
  expires_at: number
  note: string | null
}

export class InviteService {
  constructor() {
    // PostgreSQL pool is initialized in sync/db.ts
  }

  /**
   * Validate and delete invite code (one-time use)
   */
  async validateAndUse(code: string): Promise<{ valid: boolean; reason?: string }> {
    const normalizedCode = code.toUpperCase().trim()

    const client = await pool.connect()
    try {
      // Check if code exists and is valid
      const result = await client.query<InviteCode>(
        'SELECT code, created_at, expires_at, note FROM invite_codes WHERE code = $1',
        [normalizedCode]
      )

      if (result.rows.length === 0) {
        return { valid: false, reason: 'Code not found' }
      }

      // PostgreSQL BIGINT comes back as string, convert to number
      const invite = {
        ...result.rows[0],
        created_at: Number(result.rows[0].created_at),
        expires_at: Number(result.rows[0].expires_at)
      }
      const now = Date.now()

      if (invite.expires_at < now) {
        return { valid: false, reason: 'Code expired' }
      }

      // Delete code immediately after successful validation (no data trash)
      await client.query('DELETE FROM invite_codes WHERE code = $1', [normalizedCode])

      return { valid: true }
    } finally {
      client.release()
    }
  }

  /**
   * Check if code is valid (without marking as used)
   */
  async check(code: string): Promise<{ valid: boolean; reason?: string }> {
    const normalizedCode = code.toUpperCase().trim()

    const result = await pool.query<InviteCode>(
      'SELECT code, created_at, expires_at, note FROM invite_codes WHERE code = $1',
      [normalizedCode]
    )

    if (result.rows.length === 0) {
      return { valid: false, reason: 'Code not found' }
    }

    // PostgreSQL BIGINT comes back as string, convert to number
    const invite = {
      ...result.rows[0],
      created_at: Number(result.rows[0].created_at),
      expires_at: Number(result.rows[0].expires_at)
    }
    const now = Date.now()

    if (invite.expires_at < now) {
      return { valid: false, reason: 'Code expired' }
    }

    return { valid: true }
  }
}
