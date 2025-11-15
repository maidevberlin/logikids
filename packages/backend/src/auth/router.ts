import { Router } from 'express'
import { register, verify, getAccount, refresh, login } from './auth.controller'
import { requireAuth } from './auth.middleware'
import { validateBody } from '../common/middleware/validation'
import { registerSchema, loginSchema, refreshSchema } from './auth.schema'

const router = Router()

// Public routes
router.post('/register', validateBody(registerSchema), register) // Register new account with invite code
router.post('/login', validateBody(loginSchema), login) // Login with existing userId (account import/restore)
router.post('/refresh', validateBody(refreshSchema), refresh) // Refresh access token using userId

// Protected routes - require valid JWT
router.get('/verify', requireAuth, verify)
router.get('/account', requireAuth, getAccount)

export default router
