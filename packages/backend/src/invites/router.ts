import { Router } from 'express'
import { validateInviteCode, checkInviteCode } from './invite.controller'
import { validateBody } from '../common/middleware/validation'
import { validateInviteSchema } from './invite.schema'

const router = Router()

router.post('/validate', validateBody(validateInviteSchema), validateInviteCode)
router.post('/check', validateBody(validateInviteSchema), checkInviteCode)

export default router
