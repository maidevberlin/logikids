import { Request, Response } from 'express';
import { BaseController } from '../common/baseController';
import { TaskService } from './task.service';
import { taskRequestSchema, TaskRequest } from './types';
import { getConceptSchema } from './subjects/types';
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

    try {
      // First validate the basic structure
      const basicValidation = taskRequestSchema.parse(query);
      
      // Then validate the concept based on the subject
      const conceptSchema = getConceptSchema(basicValidation.subject);
      const validatedQuery: TaskRequest = {
        ...basicValidation,
        concept: conceptSchema.parse(basicValidation.concept)
      };

      const language = this.getPreferredLanguage(req);
      const task = await this.taskService.generateTask(validatedQuery, language);
      res.json(task);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
} 