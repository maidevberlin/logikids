import { pool } from '../../database/db'

export interface InviteCode {
  code: string
  created_at: number
  expires_at: number
  note: string | null
  used_by: string | null
  used_at: number | null
}

export class InviteService {
  constructor() {
    // PostgreSQL pool is initialized in sync/db.ts
  }

  /**
   * Validate invite code (no longer deletes - use auth.service.register instead)
   * @deprecated Use /api/auth/register endpoint instead
   */
  async validateAndUse(code: string): Promise<{ valid: boolean; reason?: string }> {
    // This method is deprecated - registration now happens via auth.service
    // which properly marks invites as used instead of deleting them
    console.warn('validateAndUse is deprecated. Use /api/auth/register endpoint instead.')
    return this.check(code)
  }

  /**
   * Check if code is valid (without marking as used)
   */
  async check(code: string): Promise<{ valid: boolean; reason?: string }> {
    const normalizedCode = code.toUpperCase().trim()

    const result = await pool.query<InviteCode>(
      'SELECT code, created_at, expires_at, note, used_by, used_at FROM invite_codes WHERE code = $1',
      [normalizedCode]
    )

    if (result.rows.length === 0) {
      return { valid: false, reason: 'Code not found' }
    }

    // PostgreSQL BIGINT comes back as string, convert to number
    const invite = {
      ...result.rows[0],
      created_at: Number(result.rows[0].created_at),
      expires_at: Number(result.rows[0].expires_at),
      used_at: result.rows[0].used_at ? Number(result.rows[0].used_at) : null
    }
    const now = Date.now()

    if (invite.expires_at < now) {
      return { valid: false, reason: 'Code expired' }
    }

    if (invite.used_by) {
      return { valid: false, reason: 'Code already used' }
    }

    return { valid: true }
  }
}
