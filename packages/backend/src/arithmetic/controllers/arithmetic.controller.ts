import { Request, Response } from 'express';
import { ArithmeticService } from '../services/arithmetic.service';

export class ArithmeticController {
  private static arithmeticService = new ArithmeticService();

  static async getTask(req: Request, res: Response) {
    try {
      const task = await ArithmeticController.arithmeticService.generateTask();
      res.json(task);
    } catch (error) {
      console.error('Error generating arithmetic task:', error);
      res.status(500).json({ error: 'Failed to generate arithmetic task' });
    }
  }
} 