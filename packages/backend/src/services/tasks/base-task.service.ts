import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { AIClient } from '../ai/base';
import { TaskResponse } from '../../types/task';

interface BasePrompt {
  prompt: string;
}

export abstract class BaseTaskService {
  protected prompts: BasePrompt | null = null;
  protected abstract promptPath: string;
  protected abstract taskType: string;

  constructor(protected aiClient: AIClient) {}

  protected async loadPrompts() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (!this.prompts || isDevelopment) {
      const content = await fs.readFile(this.promptPath, 'utf-8');
      const prompt = yaml.load(content) as BasePrompt;
      this.prompts = prompt;
    }
    return this.prompts;
  }

  protected abstract validateAndTransformResponse(jsonResponse: unknown): Promise<TaskResponse>;

  async generateTask(language: string = 'en'): Promise<TaskResponse> {
    const prompts = await this.loadPrompts();
    if (!prompts) {
      throw new Error('Failed to load prompts');
    }
    
    const filledPrompt = prompts.prompt.replaceAll('{{language}}', language);
    const response = await this.aiClient.generate(filledPrompt);
    if (!response) {
      throw new Error('Failed to generate response from AI');
    }

    try {
      const jsonResponse = JSON.parse(response.response);
      
      if (jsonResponse.metadata) {
        jsonResponse.metadata.provider = this.aiClient.provider;
        jsonResponse.metadata.model = this.aiClient.model;
      }
      return await this.validateAndTransformResponse(jsonResponse);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse AI response: ${error.message}`);
      }
      throw error;
    }
  }
} 