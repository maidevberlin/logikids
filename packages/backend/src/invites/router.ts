import { Router } from 'express'
import { checkInviteCode } from './invite.controller'
import { validateBody } from '../common/middleware/validation'
import { asyncHandler } from '../common/middleware/asyncHandler'
import { validateInviteSchema } from './invite.schema'

const router = Router()

router.post('/check', validateBody(validateInviteSchema), asyncHandler(checkInviteCode))

export default router
