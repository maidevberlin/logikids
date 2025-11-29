import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { InviteService } from './invite.service';

@injectable()
export class InvitesController {
  constructor(@inject(InviteService) private inviteService: InviteService) {}

  async check(code: string): Promise<{ valid: boolean; reason?: string }> {
    return this.inviteService.check(code);
  }
}
