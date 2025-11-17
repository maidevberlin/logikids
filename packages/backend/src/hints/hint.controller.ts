import { Request, Response } from 'express';
import { HintService } from './hint.service';

export class HintController {
  constructor(private readonly hintService: HintService) {}

  async getHint(req: Request, res: Response): Promise<void> {
    const { taskId } = req.params;

    if (!taskId) {
      res.status(400).json({ error: 'taskId is required' });
      return;
    }

    const result = await this.hintService.generateHint(taskId);

    res.json(result);
  }
}
