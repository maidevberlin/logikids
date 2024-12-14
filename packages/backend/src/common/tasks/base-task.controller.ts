import { Request, Response } from 'express';
import { TaskResponse } from '../../types/task';
import { z } from 'zod';
import { BaseController } from '../../common/baseController';

const taskQuerySchema = z.object({
  age: z.coerce.number().min(6).max(19).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export type TaskQuery = z.infer<typeof taskQuerySchema>;

export abstract class BaseTaskController extends BaseController {

  protected abstract generateTaskInternal(query: TaskQuery, language?: string): Promise<TaskResponse>;

  public async getTask(req: Request, res: Response) {
    try {
      const query = taskQuerySchema.parse(req.query);
      const language = this.getPreferredLanguage(req);
      const task = await this.generateTaskInternal(query, language);
      return res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
      }
      console.error('Error generating task:', error);
      return res.status(500).json({ error: 'Failed to generate task' });
    }
  }
} 