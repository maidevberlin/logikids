import { Request, Response } from 'express'
import { InviteService } from './invite.service'

const inviteService = new InviteService()

/**
 * POST /api/invite/validate
 * Validate invite code and mark as used
 */
export async function validateInviteCode(req: Request, res: Response) {
  try {
    const { code } = req.body

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid code format' })
    }

    const result = await inviteService.validateAndUse(code)

    if (!result.valid) {
      return res.status(400).json({
        valid: false,
        error: result.reason
      })
    }

    res.json({ valid: true })
  } catch (error) {
    console.error('Invite validation error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/invite/check
 * Check if code is valid (without marking as used)
 */
export async function checkInviteCode(req: Request, res: Response) {
  try {
    const { code } = req.body

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid code format' })
    }

    const result = await inviteService.check(code)

    res.json(result)
  } catch (error) {
    console.error('Invite check error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
