import { Request, Response } from 'express';
import { GeometryHintsService } from '../services/geometry-hints.service';

export class GeometryHintsController {
  private static hintsService = new GeometryHintsService();

  static async generateHint(req: Request, res: Response) {
    try {
      const { task, solution, difficulty, age } = req.body;
      
      // Validate required fields
      if (!task || !solution || !difficulty || !age) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const hint = await GeometryHintsController.hintsService.generateHint(task, solution, difficulty, age);
      res.json(hint);
    } catch (error) {
      console.error('Error generating geometry hint:', error);
      res.status(500).json({ error: 'Failed to generate geometry hint' });
    }
  }
} 