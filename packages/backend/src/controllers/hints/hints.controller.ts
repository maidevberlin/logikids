import { Request, Response } from 'express';
import { taskResponseSchema } from '../../types/task';
import { z } from 'zod';
import { HintsService } from '../../services/hints/hints.service';

export class HintsController {
  private static hintsService = new HintsService();

  static async generateHint(req: Request, res: Response) {
    try {      
      // Validate the incoming task
      const task = taskResponseSchema.parse(req.body);

      // Generate hint using the service
      const hint = await HintsController.hintsService.generateHint(task);

      return res.json(hint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid task format', details: error.errors });
      }
      console.error('Error generating hint:', error);
      return res.status(500).json({ error: 'Failed to generate hint' });
    }
  }
} 