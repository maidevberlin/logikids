import { Request, Response } from 'express';
import { z } from 'zod';
import { taskResponseSchema, TaskResponse } from '../../types/task';
import { HintResponse } from '../../types/hint';
import { AIClient } from '../ai/base';

export abstract class BaseHintsController {
  protected static aiClient: AIClient;

  protected static initialize(aiClient: AIClient) {
    this.aiClient = aiClient;
  }

  protected abstract generateHintInternal(task: TaskResponse, language?: string): Promise<HintResponse>;

  protected getPreferredLanguage(req: Request): string {
    // Get Accept-Language header and parse the first language
    const acceptLanguage = req.headers['accept-language'];
    if (!acceptLanguage) return 'en'; // Default to English

    // Parse the Accept-Language header and get the first language code
    const firstLanguage = acceptLanguage.split(',')[0].trim().split(';')[0];
    return firstLanguage || 'en';
  }

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