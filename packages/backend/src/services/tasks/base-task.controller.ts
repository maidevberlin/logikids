import { Request, Response } from 'express';
import { TaskResponse } from '../../types/task';
import { AIClient } from '../ai/base';

export abstract class BaseTaskController {
  protected static aiClient: AIClient;

  protected static initialize(aiClient: AIClient) {
    this.aiClient = aiClient;
  }

  protected abstract generateTaskInternal(): Promise<TaskResponse>;

  public async getTask(req: Request, res: Response) {
    try {
      const task = await this.generateTaskInternal();
      return res.json(task);
    } catch (error) {
      console.error('Error generating task:', error);
      return res.status(500).json({ error: 'Failed to generate task' });
    }
  }
} 