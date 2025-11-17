import { Request, Response } from 'express'
import { InviteService } from './invite.service'

const inviteService = new InviteService()

/**
 * POST /api/invite/check
 * Check if code is valid (without marking as used)
 */
export async function checkInviteCode(req: Request, res: Response) {
  const { code } = req.body; // Already validated by middleware

  const result = await inviteService.check(code);

  res.json(result);
}
