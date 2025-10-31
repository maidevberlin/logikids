import { Router } from 'express'
import { validateInviteCode, checkInviteCode } from './invite.controller'

const router = Router()

router.post('/validate', validateInviteCode)
router.post('/check', checkInviteCode)

export default router
