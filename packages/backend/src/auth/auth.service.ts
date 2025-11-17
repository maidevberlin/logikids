import jwt from 'jsonwebtoken'
import { pool } from '../../database/db'
import {
  UserExistsError,
  InviteNotFoundError,
  InviteExpiredError,
  InviteAlreadyUsedError,
  TokenExpiredError,
  InvalidTokenError,
  AccountNotFoundError,
  AccountRevokedError
} from '../common/errors'

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'logikids-dev-secret-change-in-production'
const ACCESS_TOKEN_EXPIRES_IN = '1h' // Short-lived access token

export interface JWTPayload {
  userId: string
  inviteCode: string
  iat?: number
  exp?: number
}

export interface UserAccount {
  user_id: string
  invite_code: string
  created_at: number
  last_seen: number
}

export class AuthService {
  /**
   * Register a new user account with invite code
   * Returns access token on success
   */
  async register(userId: string, inviteCode: string): Promise<{ accessToken: string; account: UserAccount }> {
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
        throw new UserExistsError(userId)
      }

      // Validate invite code (must exist, not expired, not used)
      const inviteResult = await client.query(
        'SELECT code, expires_at, used_by FROM invite_codes WHERE code = $1',
        [normalizedCode]
      )

      if (inviteResult.rows.length === 0) {
        throw new InviteNotFoundError()
      }

      const invite = {
        ...inviteResult.rows[0],
        expires_at: Number(inviteResult.rows[0].expires_at)
      }

      if (invite.expires_at < Date.now()) {
        throw new InviteExpiredError()
      }

      if (invite.used_by) {
        throw new InviteAlreadyUsedError()
      }

      // Mark invite as used
      await client.query(
        'UPDATE invite_codes SET used_by = $1, used_at = $2 WHERE code = $3',
        [userId, Date.now(), normalizedCode]
      )

      // Create user account
      const now = Date.now()
      await client.query(
        'INSERT INTO user_accounts (user_id, invite_code, created_at, last_seen) VALUES ($1, $2, $3, $4)',
        [userId, normalizedCode, now, now]
      )

      await client.query('COMMIT')

      // Generate access token
      const accessToken = this.generateAccessToken(userId, normalizedCode)

      const account: UserAccount = {
        user_id: userId,
        invite_code: normalizedCode,
        created_at: now,
        last_seen: now
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
      inviteCode
    }

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    })
  }

  /**
   * Verify JWT token and return payload
   */
  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
      return decoded
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError()
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new InvalidTokenError()
      }
      throw error
    }
  }

  /**
   * Validate that user account exists and is not revoked
   */
  async validateUser(userId: string): Promise<boolean> {
    const result = await pool.query(
      'SELECT user_id, revoked FROM user_accounts WHERE user_id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      return false
    }

    // Check if account is revoked
    return !result.rows[0].revoked
  }

  /**
   * Update last_seen timestamp for user
   */
  async updateLastSeen(userId: string): Promise<void> {
    await pool.query(
      'UPDATE user_accounts SET last_seen = $1 WHERE user_id = $2',
      [Date.now(), userId]
    )
  }

  /**
   * Get user account info
   */
  async getAccount(userId: string): Promise<UserAccount | null> {
    const result = await pool.query<UserAccount>(
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
      last_seen: Number(result.rows[0].last_seen)
    }
  }

  /**
   * Renew access token for existing userId
   * Verifies account exists and is not revoked, then issues new access token
   */
  async renewAccessToken(userId: string): Promise<{ accessToken: string }> {
    // Check if user account exists
    const result = await pool.query<UserAccount & { revoked: boolean }>(
      'SELECT user_id, invite_code, created_at, last_seen, revoked FROM user_accounts WHERE user_id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      throw new AccountNotFoundError()
    }

    const accountRow = result.rows[0]

    // Check if account is revoked
    if (accountRow.revoked) {
      throw new AccountRevokedError()
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
  async login(userId: string): Promise<{ accessToken: string; account: UserAccount }> {
    // Check if user account exists
    const result = await pool.query<UserAccount & { revoked: boolean }>(
      'SELECT user_id, invite_code, created_at, last_seen, revoked FROM user_accounts WHERE user_id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      throw new AccountNotFoundError()
    }

    const accountRow = result.rows[0]

    // Check if account is revoked
    if (accountRow.revoked) {
      throw new AccountRevokedError()
    }

    const account: UserAccount = {
      user_id: accountRow.user_id,
      invite_code: accountRow.invite_code,
      created_at: Number(accountRow.created_at),
      last_seen: Number(accountRow.last_seen)
    }

    // Generate access token
    const accessToken = this.generateAccessToken(account.user_id, account.invite_code)

    // Update last_seen
    await this.updateLastSeen(account.user_id)

    return { accessToken, account }
  }
}
