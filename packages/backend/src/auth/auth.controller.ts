import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { RegisterRequestTyped, LoginRequestTyped, RefreshRequestTyped } from './auth.schema'

/**
 * Controller for authentication endpoints
 * Receives AuthService instance via dependency injection
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/register
   * Register a new user with invite code
   *
   * Body: { userId: string, inviteCode: string }
   * Returns: { token: string, account: UserAccount }
   */
  async register(req: RegisterRequestTyped, res: Response): Promise<void> {
    const { userId, inviteCode } = req.body // Already validated by middleware

    // Register user
    const result = await this.authService.register(userId, inviteCode)

    res.status(201).json({
      accessToken: result.accessToken,
      account: result.account
    })
  }

  /**
   * GET /api/auth/verify
   * Verify JWT token is valid (requires auth middleware)
   *
   * Returns: { valid: true, userId: string }
   */
  async verify(req: Request, res: Response): Promise<void> {
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
  async getAccount(req: Request, res: Response): Promise<void> {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const account = await this.authService.getAccount(req.userId)

    if (!account) {
      res.status(404).json({ error: 'Account not found' })
      return
    }

    res.json(account)
  }

  /**
   * POST /api/auth/refresh
   * Refresh access token using userId
   *
   * Body: { userId: string }
   * Returns: { accessToken: string }
   */
  async refresh(req: RefreshRequestTyped, res: Response): Promise<void> {
    const { userId } = req.body // Already validated by middleware

    // Renew access token
    const result = await this.authService.renewAccessToken(userId)
    res.json(result)
  }

  /**
   * POST /api/auth/login
   * Login with existing userId (for account import/restore)
   *
   * Body: { userId: string }
   * Returns: { accessToken: string, account: UserAccount }
   */
  async login(req: LoginRequestTyped, res: Response): Promise<void> {
    const { userId } = req.body // Already validated by middleware

    // Login user
    const result = await this.authService.login(userId)

    res.json({
      accessToken: result.accessToken,
      account: result.account
    })
  }
}
