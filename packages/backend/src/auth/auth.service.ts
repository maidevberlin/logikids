import jwt from 'jsonwebtoken'
import { pool } from '../sync/db'
import crypto from 'crypto'

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'logikids-dev-secret-change-in-production'
const ACCESS_TOKEN_EXPIRES_IN = '1h' // Short-lived access token
const REFRESH_TOKEN_EXPIRES_IN = '365d' // Long-lived refresh token (1 year)

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

export interface RefreshToken {
  id: number
  token: string
  user_id: string
  expires_at: number
  created_at: number
  revoked: boolean
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export class AuthService {
  /**
   * Register a new user account with invite code
   * Returns access token and refresh token on success
   */
  async register(userId: string, inviteCode: string): Promise<{ accessToken: string; refreshToken: string; account: UserAccount }> {
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
        throw new Error('User ID already exists')
      }

      // Validate invite code (must exist, not expired, not used)
      const inviteResult = await client.query(
        'SELECT code, expires_at, used_by FROM invite_codes WHERE code = $1',
        [normalizedCode]
      )

      if (inviteResult.rows.length === 0) {
        throw new Error('Invite code not found')
      }

      const invite = {
        ...inviteResult.rows[0],
        expires_at: Number(inviteResult.rows[0].expires_at)
      }

      if (invite.expires_at < Date.now()) {
        throw new Error('Invite code expired')
      }

      if (invite.used_by) {
        throw new Error('Invite code already used')
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

      // Generate access and refresh tokens
      const accessToken = this.generateAccessToken(userId, normalizedCode)
      const refreshToken = await this.createRefreshToken(userId)

      const account: UserAccount = {
        user_id: userId,
        invite_code: normalizedCode,
        created_at: now,
        last_seen: now
      }

      return { accessToken, refreshToken, account }
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
   * Create and store refresh token in database
   */
  async createRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex')
    const expiresAt = Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year from now
    const createdAt = Date.now()

    await pool.query(
      'INSERT INTO refresh_tokens (token, user_id, expires_at, created_at) VALUES ($1, $2, $3, $4)',
      [token, userId, expiresAt, createdAt]
    )

    return token
  }

  /**
   * Legacy method for backwards compatibility
   * @deprecated Use generateAccessToken instead
   */
  generateToken(userId: string, inviteCode: string): string {
    return this.generateAccessToken(userId, inviteCode)
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
        throw new Error('Token expired')
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token')
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
   * Refresh access token using refresh token
   * Returns new access token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    // Validate refresh token exists and is not expired/revoked
    const result = await pool.query<RefreshToken>(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND revoked = FALSE',
      [refreshToken]
    )

    if (result.rows.length === 0) {
      throw new Error('Invalid refresh token')
    }

    const tokenData = {
      ...result.rows[0],
      expires_at: Number(result.rows[0].expires_at),
      created_at: Number(result.rows[0].created_at)
    }

    if (tokenData.expires_at < Date.now()) {
      throw new Error('Refresh token expired')
    }

    // Get user account to generate new access token
    const account = await this.getAccount(tokenData.user_id)
    if (!account) {
      throw new Error('User account not found')
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(account.user_id, account.invite_code)

    // Optionally: rotate refresh token (create new one, revoke old one)
    // For simplicity, we'll reuse the same refresh token
    return {
      accessToken,
      refreshToken // Return the same refresh token
    }
  }

  /**
   * Revoke a refresh token (for logout)
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await pool.query(
      'UPDATE refresh_tokens SET revoked = TRUE WHERE token = $1',
      [refreshToken]
    )
  }

  /**
   * Login with existing userId (for account import/restore)
   * Verifies account exists and is not revoked, then issues tokens
   */
  async login(userId: string): Promise<{ accessToken: string; refreshToken: string; account: UserAccount }> {
    // Check if user account exists
    const result = await pool.query<UserAccount & { revoked: boolean }>(
      'SELECT user_id, invite_code, created_at, last_seen, revoked FROM user_accounts WHERE user_id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      throw new Error('Account not found')
    }

    const accountRow = result.rows[0]

    // Check if account is revoked
    if (accountRow.revoked) {
      throw new Error('Account has been revoked')
    }

    const account: UserAccount = {
      user_id: accountRow.user_id,
      invite_code: accountRow.invite_code,
      created_at: Number(accountRow.created_at),
      last_seen: Number(accountRow.last_seen)
    }

    // Generate access and refresh tokens
    const accessToken = this.generateAccessToken(account.user_id, account.invite_code)
    const refreshToken = await this.createRefreshToken(account.user_id)

    // Update last_seen
    await this.updateLastSeen(account.user_id)

    return { accessToken, refreshToken, account }
  }
}
