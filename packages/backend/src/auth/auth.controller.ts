import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { RegisterRequestTyped, LoginRequestTyped, RefreshRequestTyped } from './auth.schema'

const authService = new AuthService()

/**
 * POST /api/auth/register
 * Register a new user with invite code
 *
 * Body: { userId: string, inviteCode: string }
 * Returns: { token: string, account: UserAccount }
 */
export async function register(req: RegisterRequestTyped, res: Response): Promise<void> {
  try {
    const { userId, inviteCode } = req.body // Already validated by middleware

    // Register user
    const result = await authService.register(userId, inviteCode)

    res.status(201).json({
      accessToken: result.accessToken,
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
 * Refresh access token using userId
 *
 * Body: { userId: string }
 * Returns: { accessToken: string }
 */
export async function refresh(req: RefreshRequestTyped, res: Response): Promise<void> {
  try {
    const { userId } = req.body // Already validated by middleware

    // Renew access token
    const result = await authService.renewAccessToken(userId)
    res.json(result)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Account not found') {
        res.status(404).json({ error: error.message })
        return
      }
      if (error.message === 'Account has been revoked') {
        res.status(403).json({ error: error.message })
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
 * POST /api/auth/login
 * Login with existing userId (for account import/restore)
 *
 * Body: { userId: string }
 * Returns: { accessToken: string, account: UserAccount }
 */
export async function login(req: LoginRequestTyped, res: Response): Promise<void> {
  try {
    const { userId } = req.body // Already validated by middleware

    // Login user
    const result = await authService.login(userId)

    res.json({
      accessToken: result.accessToken,
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
