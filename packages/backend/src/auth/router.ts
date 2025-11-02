import { Router } from 'express'
import { register, verify, getAccount, refresh, logout, login } from './auth.controller'
import { requireAuth } from './auth.middleware'

const router = Router()

// Public routes
router.post('/register', register) // Register new account with invite code
router.post('/login', login) // Login with existing userId (account import/restore)
router.post('/refresh', refresh) // Refresh access token

// Protected routes - require valid JWT
router.get('/verify', requireAuth, verify)
router.get('/account', requireAuth, getAccount)
router.post('/logout', logout) // Revoke refresh token

export default router
