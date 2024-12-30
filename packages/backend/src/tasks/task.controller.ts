import { Request, Response } from 'express';
import { BaseController } from '../common/baseController';
import { TaskService } from './task.service';
import { taskRequestSchema } from './types';
import { AIClient } from '../common/ai/base';

export class TaskController extends BaseController {
  private readonly taskService: TaskService;

  constructor(aiClient: AIClient) {
    super(aiClient);
    this.taskService = new TaskService(aiClient);
  }

  public async getTask(req: Request, res: Response): Promise<void> {
    const query = {
      ...req.query,
      age: req.query.age ? parseInt(req.query.age as string, 10) : undefined
    };
    const validatedQuery = taskRequestSchema.parse(query);
    const language = this.getPreferredLanguage(req);
    const task = await this.taskService.generateTask(validatedQuery, language);
    res.json(task);
  }
} 