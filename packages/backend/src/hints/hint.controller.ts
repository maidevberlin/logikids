import { Request, Response } from 'express';
import { HintService } from './hint.service';

export class HintController {
  constructor(private readonly hintService: HintService) {}

  async getHint(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;

      if (!taskId) {
        res.status(400).json({ error: 'taskId is required' });
        return;
      }

      const result = await this.hintService.generateHint(taskId);

      res.json(result);
    } catch (error) {
      console.error('[HintController] Error generating hint:', error);

      if (error instanceof Error) {
        if (error.message.includes('not found') || error.message.includes('expired')) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes('All hints')) {
          res.status(429).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({ error: 'Failed to generate hint' });
    }
  }
}
