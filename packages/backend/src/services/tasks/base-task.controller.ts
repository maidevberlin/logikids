import { Request, Response } from 'express';
import { TaskResponse } from '../../types/task';
import { AIClient } from '../ai/base';

export abstract class BaseTaskController {
  protected static aiClient: AIClient;

  protected static initialize(aiClient: AIClient) {
    this.aiClient = aiClient;
  }

  protected abstract generateTaskInternal(language?: string): Promise<TaskResponse>;

  protected getPreferredLanguage(req: Request): string {
    // Get Accept-Language header and parse the first language
    const acceptLanguage = req.headers['accept-language'];
    if (!acceptLanguage) return 'en'; // Default to English

    // Parse the Accept-Language header and get the first language code
    const firstLanguage = acceptLanguage.split(',')[0].trim().split(';')[0];
    return firstLanguage || 'en';
  }

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