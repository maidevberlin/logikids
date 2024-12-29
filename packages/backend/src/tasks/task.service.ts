import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { AIClient } from '../common/ai/base';
import { taskResponseSchema, TaskRequest, TaskMetadata, Task, Subject } from './types';

interface BasePrompt {
  prompt: string;
}

export class TaskService {
  protected prompts: BasePrompt | null = null;
  protected promptPath = path.join(__dirname, '/prompts');

  constructor(protected aiClient: AIClient) {}

  protected async loadPrompts( subject: Subject) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (!this.prompts || isDevelopment) {
      const content = await fs.readFile(this.promptPath + `/${subject}.yaml`, 'utf-8');
      const prompt = yaml.load(content) as BasePrompt;
      this.prompts = prompt;
    }
    return this.prompts;
  }

  async generateTask(query: TaskRequest, language: string = 'en'): Promise<Task> {
    const subject = query.subject;
    const prompts = await this.loadPrompts(subject);
    if (!prompts) {
      throw new Error('Failed to load prompts');
    }
    
    const age = query.age;
    const difficulty = query.difficulty;

    let filledPrompt = prompts.prompt
      .replaceAll('{{language}}', language)
      .replaceAll('{{age}}', age.toString())
      .replaceAll('{{difficulty}}', difficulty);

    const response = await this.aiClient.generate(filledPrompt);
    if (!response) {
      throw new Error('Failed to generate response from AI');
    }

    const metadata = { 
      difficulty,
      age,
      provider: this.aiClient.provider,
      model: this.aiClient.model,
      language,
      subject
    } as TaskMetadata

    try {
      const task = JSON.parse(response.response);
      const taskResponse = taskResponseSchema.parse(task);
      return {
        ...taskResponse,
        metadata
      } as Task;

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse AI response: ${error.message}`);
      }
      throw error;
    }
  }
} 