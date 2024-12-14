import { Request, Response } from 'express';
import { z } from 'zod';
import { taskResponseSchema, TaskResponse } from '../../types/task';
import { HintResponse } from '../../types/hint';
import { AIClient } from '../ai/base';
import { BaseController } from '../../common/baseController';

export abstract class BaseHintsController extends BaseController {

  protected abstract generateHintInternal(task: TaskResponse, language?: string): Promise<HintResponse>;

  public async generateHint(req: Request, res: Response) {
    try {
      const task = taskResponseSchema.parse(req.body);
      const language = this.getPreferredLanguage(req);
      const hint = await this.generateHintInternal(task, language);
      return res.json(hint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid task format', details: error.errors });
      }
      console.error('Error generating hint:', error);
      return res.status(500).json({ error: 'Failed to generate hint' });
    }
  }
} 