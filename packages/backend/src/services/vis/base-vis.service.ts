import { TaskResponse } from '../../types/task';
import { VisualizationResponse } from './base-vis.controller';
import { AIClient } from '../ai/base';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

export interface Prompts {
  visualization: {
    base: string;
  };
}

export abstract class BaseVisualizationService {
  protected prompts: Prompts;

  constructor(
    protected aiClient: AIClient,
    promptsPath: string
  ) {
    const promptsFile = readFileSync(promptsPath, 'utf8');
    this.prompts = yaml.load(promptsFile) as Prompts;
  }

  async generateVisualization(task: TaskResponse): Promise<VisualizationResponse> {
    const prompt = this.generatePrompt(task);
    const result = await this.aiClient.generateImage(prompt);
    
    return {
      imageUrl: result.url,
      provider: result.provider,
      model: result.model
    };
  }

  protected abstract generatePrompt(task: TaskResponse): string;
} 