import { Request, Response } from 'express';
import { ArithmeticOperation } from '../../types/task';
import { ArithmeticService } from '../../services/tasks/arithmetic.service';

export class ArithmeticController {
  private static arithmeticService = new ArithmeticService();

  static async getTask(req: Request, res: Response) {
    try {
      const requestedOperation = req.params.operation as ArithmeticOperation | undefined;
      const task = await ArithmeticController.arithmeticService.generateTask(requestedOperation);
      res.json(task);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid operation')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error generating arithmetic task:', error);
      res.status(500).json({ error: 'Failed to generate arithmetic task' });
    }
  }
} 