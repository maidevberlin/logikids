import { Router } from 'express'
import { AuthController } from './auth.controller'
import { requireAuth, getAuthService } from './auth.middleware'
import { validateBody } from '../common/middleware/validation'
import { asyncHandler } from '../common/middleware/asyncHandler'
import { registerSchema, loginSchema, refreshSchema } from './auth.schema'

const router = Router()

// Create controller with shared AuthService instance
const authController = new AuthController(getAuthService())

// Public routes
router.post('/register', validateBody(registerSchema), asyncHandler(authController.register)) // Register new account with invite code
router.post('/login', validateBody(loginSchema), asyncHandler(authController.login)) // Login with existing userId (account import/restore)
router.post('/refresh', validateBody(refreshSchema), asyncHandler(authController.refresh)) // Refresh access token using userId

// Protected routes - require valid JWT
router.get('/verify', requireAuth, asyncHandler(authController.verify))
router.get('/account', requireAuth, asyncHandler(authController.getAccount))

export default router
