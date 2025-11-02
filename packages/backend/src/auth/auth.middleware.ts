import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'

const authService = new AuthService()

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string
      inviteCode?: string
    }
  }
}

/**
 * Middleware to require JWT authentication
 * Validates token and adds userId to request
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader) {
      res.status(401).json({ error: 'No authorization token provided' })
      return
    }

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid authorization format. Use: Bearer <token>' })
      return
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const payload = authService.verifyToken(token)

    // Validate user still exists
    const userExists = await authService.validateUser(payload.userId)
    if (!userExists) {
      res.status(401).json({ error: 'User account not found' })
      return
    }

    // Add userId and inviteCode to request for downstream handlers
    req.userId = payload.userId
    req.inviteCode = payload.inviteCode

    // Update last_seen (async, don't wait)
    authService.updateLastSeen(payload.userId).catch(err => {
      console.error('Failed to update last_seen:', err)
    })

    next()
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Token expired') {
        res.status(401).json({ error: 'Token expired. Please login again.' })
        return
      }
      if (error.message === 'Invalid token') {
        res.status(401).json({ error: 'Invalid authentication token' })
        return
      }
    }

    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
}

/**
 * Middleware to verify userId in route params matches authenticated user
 * Must be used AFTER requireAuth middleware
 */
export function requireOwnUserId(req: Request, res: Response, next: NextFunction): void {
  const routeUserId = req.params.userId
  const authenticatedUserId = req.userId

  if (!authenticatedUserId) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  if (routeUserId !== authenticatedUserId) {
    res.status(403).json({ error: 'Cannot access another user\'s data' })
    return
  }

  next()
}
