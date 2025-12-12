import 'reflect-metadata'
import { injectable } from 'tsyringe'
import jwt from 'jsonwebtoken'
import { pool } from '../../database/db'
import { notFound, badRequest, forbidden } from '../common/errors'
import { env } from '../config/env'
import type { JWTPayload, UserAccountRow } from './types'

const JWT_SECRET = env.JWT_SECRET
const ACCESS_TOKEN_EXPIRES_IN = '1h' // Short-lived access token

@injectable()
export class AuthService {
  /**
   * Register a new user account with invite code
   * Returns access token on success
   */
  async register(
    userId: string,
    inviteCode: string
  ): Promise<{ accessToken: string; account: UserAccountRow }> {
    const normalizedCode = inviteCode.toUpperCase().trim()
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Check if userId already exists
      const existingUser = await client.query(
        'SELECT user_id FROM user_accounts WHERE user_id = $1',
        [userId]
      )

      if (existingUser.rows.length > 0) {
        throw badRequest(`User ${userId} already exists`)
      }

      // Validate invite code (must exist, not expired, not used)
      const inviteResult = await client.query(
        'SELECT code, expires_at, used_by FROM invite_codes WHERE code = $1',
        [normalizedCode]
      )

      if (inviteResult.rows.length === 0) {
        throw notFound('Invite code not found')
      }

      const invite = {
        ...inviteResult.rows[0],
        expires_at: Number(inviteResult.rows[0].expires_at),
      }

      if (invite.expires_at < Date.now()) {
        throw badRequest('Invite code has expired')
      }

      if (invite.used_by) {
        throw badRequest('Invite code has already been used')
      }

      // Mark invite as used
      await client.query('UPDATE invite_codes SET used_by = $1, used_at = $2 WHERE code = $3', [
        userId,
        Date.now(),
        normalizedCode,
      ])

      // Create user account
      const now = Date.now()
      await client.query(
        'INSERT INTO user_accounts (user_id, invite_code, created_at, last_seen) VALUES ($1, $2, $3, $4)',
        [userId, normalizedCode, now, now]
      )

      await client.query('COMMIT')

      // Generate access token
      const accessToken = this.generateAccessToken(userId, normalizedCode)

      const account: UserAccountRow = {
        user_id: userId,
        invite_code: normalizedCode,
        created_at: now,
        last_seen: now,
      }

      return { accessToken, account }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * Generate short-lived access token
   */
  generateAccessToken(userId: string, inviteCode: string): string {
    const payload: JWTPayload = {
      userId,
      inviteCode,
    }

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    })
  }

  /**
   * Update last_seen timestamp for user
   */
  async updateLastSeen(userId: string): Promise<void> {
    await pool.query('UPDATE user_accounts SET last_seen = $1 WHERE user_id = $2', [
      Date.now(),
      userId,
    ])
  }

  /**
   * Get user account info
   */
  async getAccount(userId: string): Promise<UserAccountRow | null> {
    const result = await pool.query<UserAccountRow>(
      'SELECT user_id, invite_code, created_at, last_seen FROM user_accounts WHERE user_id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      return null
    }

    // Convert BIGINT to number
    return {
      ...result.rows[0],
      created_at: Number(result.rows[0].created_at),
      last_seen: Number(result.rows[0].last_seen),
    }
  }

  /**
   * Renew access token for existing userId
   * Verifies account exists and is not revoked, then issues new access token
   */
  async renewAccessToken(userId: string): Promise<{ accessToken: string }> {
    // Check if user account exists
    const result = await pool.query<UserAccountRow & { revoked: boolean }>(
      'SELECT user_id, invite_code, created_at, last_seen, revoked FROM user_accounts WHERE user_id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      throw notFound('Account not found')
    }

    const accountRow = result.rows[0]

    // Check if account is revoked
    if (accountRow.revoked) {
      throw forbidden('Account has been revoked')
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(accountRow.user_id, accountRow.invite_code)

    // Update last_seen
    await this.updateLastSeen(accountRow.user_id)

    return { accessToken }
  }

  /**
   * Login with existing userId (for account import/restore)
   * Verifies account exists and is not revoked, then issues tokens
   */
  async login(userId: string): Promise<{ accessToken: string; account: UserAccountRow }> {
    // Check if user account exists
    const result = await pool.query<UserAccountRow & { revoked: boolean }>(
      'SELECT user_id, invite_code, created_at, last_seen, revoked FROM user_accounts WHERE user_id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      throw notFound('Account not found')
    }

    const accountRow = result.rows[0]

    // Check if account is revoked
    if (accountRow.revoked) {
      throw forbidden('Account has been revoked')
    }

    const account: UserAccountRow = {
      user_id: accountRow.user_id,
      invite_code: accountRow.invite_code,
      created_at: Number(accountRow.created_at),
      last_seen: Number(accountRow.last_seen),
    }

    // Generate access token
    const accessToken = this.generateAccessToken(account.user_id, account.invite_code)

    // Update last_seen
    await this.updateLastSeen(account.user_id)

    return { accessToken, account }
  }
}
