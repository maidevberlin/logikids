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
    const query = taskRequestSchema.parse(req.query);
    const language = this.getPreferredLanguage(req);
    const task = await this.taskService.generateTask(query, language);
    res.json(task);
  }
} 