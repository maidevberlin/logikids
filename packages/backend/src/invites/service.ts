import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { pool } from '../../database/db'

export interface InviteCode {
  code: string
  created_at: number
  expires_at: number
  note: string | null
  used_by: string | null
  used_at: number | null
}

@injectable()
export class InviteService {
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
      used_at: result.rows[0].used_at ? Number(result.rows[0].used_at) : null,
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
