import { Request, Response } from 'express'
import { AuthService } from './auth.service'

const authService = new AuthService()

/**
 * POST /api/auth/register
 * Register a new user with invite code
 *
 * Body: { userId: string, inviteCode: string }
 * Returns: { token: string, account: UserAccount }
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { userId, inviteCode } = req.body

    // Validate input
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'Invalid userId format' })
      return
    }

    if (!inviteCode || typeof inviteCode !== 'string') {
      res.status(400).json({ error: 'Invalid inviteCode format' })
      return
    }

    // Validate userId format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      res.status(400).json({ error: 'userId must be a valid UUID' })
      return
    }

    // Register user
    const result = await authService.register(userId, inviteCode)

    res.status(201).json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      account: result.account
    })
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific errors with appropriate status codes
      if (error.message === 'User ID already exists') {
        res.status(409).json({ error: error.message })
        return
      }
      if (error.message === 'Invite code not found') {
        res.status(404).json({ error: error.message })
        return
      }
      if (error.message === 'Invite code expired' || error.message === 'Invite code already used') {
        res.status(400).json({ error: error.message })
        return
      }

      console.error('Registration error:', error)
      res.status(500).json({ error: 'Registration failed' })
      return
    }

    console.error('Unknown registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
}

/**
 * GET /api/auth/verify
 * Verify JWT token is valid (requires auth middleware)
 *
 * Returns: { valid: true, userId: string }
 */
export async function verify(req: Request, res: Response): Promise<void> {
  // If we reach here, auth middleware has validated the token
  res.json({
    valid: true,
    userId: req.userId
  })
}

/**
 * GET /api/auth/account
 * Get account information (requires auth middleware)
 *
 * Returns: UserAccount
 */
export async function getAccount(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const account = await authService.getAccount(req.userId)

    if (!account) {
      res.status(404).json({ error: 'Account not found' })
      return
    }

    res.json(account)
  } catch (error) {
    console.error('Get account error:', error)
    res.status(500).json({ error: 'Failed to retrieve account' })
  }
}

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 *
 * Body: { refreshToken: string }
 * Returns: { accessToken: string, refreshToken: string }
 */
export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body

    if (!refreshToken || typeof refreshToken !== 'string') {
      res.status(400).json({ error: 'Invalid refreshToken format' })
      return
    }

    // Get new access token
    const tokens = await authService.refreshAccessToken(refreshToken)

    res.json(tokens)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid refresh token' || error.message === 'Refresh token expired') {
        res.status(401).json({ error: error.message })
        return
      }
      if (error.message === 'User account not found') {
        res.status(404).json({ error: error.message })
        return
      }

      console.error('Token refresh error:', error)
      res.status(500).json({ error: 'Token refresh failed' })
      return
    }

    console.error('Unknown token refresh error:', error)
    res.status(500).json({ error: 'Token refresh failed' })
  }
}

/**
 * POST /api/auth/logout
 * Revoke refresh token (logout)
 *
 * Body: { refreshToken: string }
 * Returns: { success: true }
 */
export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body

    if (!refreshToken || typeof refreshToken !== 'string') {
      res.status(400).json({ error: 'Invalid refreshToken format' })
      return
    }

    await authService.revokeRefreshToken(refreshToken)

    res.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Logout failed' })
  }
}

/**
 * POST /api/auth/login
 * Login with existing userId (for account import/restore)
 *
 * Body: { userId: string }
 * Returns: { accessToken: string, refreshToken: string, account: UserAccount }
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.body

    // Validate input
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'Invalid userId format' })
      return
    }

    // Validate userId format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      res.status(400).json({ error: 'userId must be a valid UUID' })
      return
    }

    // Login user
    const result = await authService.login(userId)

    res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      account: result.account
    })
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific errors with appropriate status codes
      if (error.message === 'Account not found') {
        res.status(404).json({ error: error.message })
        return
      }
      if (error.message === 'Account has been revoked') {
        res.status(403).json({ error: error.message })
        return
      }

      console.error('Login error:', error)
      res.status(500).json({ error: 'Login failed' })
      return
    }

    console.error('Unknown login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
}
