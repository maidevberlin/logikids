import { Request, Response } from 'express';
import { GeometryService } from '../services/geometry.service';

export class GeometryController {
  private static geometryService = new GeometryService();

  static async getTask(req: Request, res: Response) {
    try {
      const task = await GeometryController.geometryService.generateTask();
      res.json(task);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid operation')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error generating geometry task:', error);
      res.status(500).json({ error: 'Failed to generate geometry task' });
    }
  }
} 