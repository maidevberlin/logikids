import { Request, Response } from 'express';
import { TaskResponse } from '../../types/task';
import { AIClient } from '../ai/base';

export interface VisualizationResponse {
  imageUrl: string;
  provider: 'ollama' | 'openai';
  model: string;
}

export abstract class BaseVisualizationController {
  protected static aiClient: AIClient;

  static initialize(aiClient: AIClient) {
    BaseVisualizationController.aiClient = aiClient;
  }

  async generateVisualization(req: Request, res: Response): Promise<void> {
    try {
      const task = req.body as TaskResponse;
      const visualization = await this.generateVisualizationInternal(task);
      res.json(visualization);
    } catch (error) {
      console.error('Error generating visualization:', error);
      res.status(500).json({ error: 'Failed to generate visualization' });
    }
  }

  protected abstract generateVisualizationInternal(task: TaskResponse): Promise<VisualizationResponse>;
} 