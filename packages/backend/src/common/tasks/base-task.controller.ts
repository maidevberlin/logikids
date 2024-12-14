import { Request, Response } from 'express';
import { TaskResponse } from '../../types/task';
import { AIClient } from '../ai/base';
import { BaseController } from '../../common/baseController';

export abstract class BaseTaskController extends BaseController {

  protected abstract generateTaskInternal(language?: string): Promise<TaskResponse>;

  public async getTask(req: Request, res: Response) {
    try {
      const language = this.getPreferredLanguage(req);
      const task = await this.generateTaskInternal(language);
      return res.json(task);
    } catch (error) {
      console.error('Error generating task:', error);
      return res.status(500).json({ error: 'Failed to generate task' });
    }
  }
} 