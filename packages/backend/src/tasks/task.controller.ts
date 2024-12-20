import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../common/baseController';
import { TaskService } from './task.service';
import { TaskRequest, taskRequestSchema, Task } from './types';

export class TaskController extends BaseController {

  protected generateTaskInternal(query: TaskRequest, language?: string): Promise<Task>{
    const taskService = new TaskService(this.aiClient);
    return taskService.generateTask(query, language);
  }

  public async getTask(req: Request, res: Response): Promise<void> {
    try {
      const query = taskRequestSchema.parse(req.query);
      const language = this.getPreferredLanguage(req);
      const task = await this.generateTaskInternal(query, language);
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
        return;
      }
      console.error('Error generating task:', error);
      res.status(500).json({ error: 'Failed to generate task' });
    }
  }
} 