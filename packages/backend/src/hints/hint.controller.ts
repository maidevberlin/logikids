import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../common/baseController';
import { HintResponse as Hint } from './types';
import { Task, taskResponseSchema } from '../tasks/types';
import { HintsService } from './hint.service';

export class HintsController extends BaseController {

  public async generateHint(req: Request, res: Response): Promise<void> {
    try {
      const task = taskResponseSchema.parse(req.body);
      const language = this.getPreferredLanguage(req);
      const hintService = new HintsService(this.aiClient);
      const hint = await hintService.generateHint(task, language);
      res.json(hint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid task format', details: error.errors });
        return;
      }
      console.error('Error generating hint:', error);
      res.status(500).json({ error: 'Failed to generate hint' });
    }
  }
} 