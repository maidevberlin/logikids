import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { AIClient } from '../common/ai/base';
import { taskResponseSchema, TaskRequest, TaskMetadata, Task } from './types';

interface BasePrompt {
  prompt: string;
}

const DEFAULT_AGE = 8;
const DEFAULT_DIFFICULTY = 'medium' as const;

export class TaskService {
  protected prompts: BasePrompt | null = null;
  protected promptPath = path.join(__dirname, '/prompts/arithmetic.yaml');

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

  async generateTask(query: TaskRequest, language: string = 'en'): Promise<Task> {
    const prompts = await this.loadPrompts();
    if (!prompts) {
      throw new Error('Failed to load prompts');
    }
    
    const age = query.age ?? DEFAULT_AGE;
    const difficulty = query.difficulty ?? DEFAULT_DIFFICULTY;
    
    let filledPrompt = prompts.prompt
      .replaceAll('{{language}}', language)
      .replaceAll('{{age}}', age.toString())
      .replaceAll('{{difficulty}}', difficulty);

    const response = await this.aiClient.generate(filledPrompt);
    if (!response) {
      throw new Error('Failed to generate response from AI');
    }

    try {
      const jsonResponse = JSON.parse(response.response);
      if (!jsonResponse.metadata) {
        jsonResponse.metadata = { 
          ...jsonResponse.metadata,
          provider: this.aiClient.provider,
          model: this.aiClient.model,
          age,
          difficulty
        } as TaskMetadata;
      }

      return taskResponseSchema.parse(jsonResponse);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse AI response: ${error.message}`);
      }
      throw error;
    }
  }
} 