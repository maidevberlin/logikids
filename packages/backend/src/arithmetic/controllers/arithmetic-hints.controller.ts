import { Request, Response } from 'express';
import { ArithmeticHintsService } from '../services/arithmetic-hints.service';
import { TaskResponse } from '../../types/task';

export class ArithmeticHintsController {
  private static hintsService = new ArithmeticHintsService();

  static async generateHint(req: Request, res: Response) {
    try {
      const task = req.body as TaskResponse;
      
      // Validate required fields
      if (!task.task || !task.solution || !task.metadata?.difficulty || !task.metadata?.age) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const hint = await ArithmeticHintsController.hintsService.generateHint(
        task.task,
        task.solution.toString(),
        task.metadata.difficulty,
        `${task.metadata.age.min}-${task.metadata.age.max}`
      );
      res.json(hint);
    } catch (error) {
      console.error('Error generating arithmetic hint:', error);
      res.status(500).json({ error: 'Failed to generate arithmetic hint' });
    }
  }
} 