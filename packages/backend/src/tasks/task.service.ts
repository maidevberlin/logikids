import { TaskRequest, Task } from './types';
import { AIClient } from '../common/ai/base';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getAvailableTaskTypes, getSpecificTaskType } from './config/taskTypes';

export class TaskService {
  constructor(private readonly aiClient: AIClient) {}

  private async readPromptFile(path: string): Promise<{ prompt: string }> {
    const content = await readFile(join(__dirname, '..', path), 'utf-8');
    return { prompt: content };
  }

  public async generateTask(request: TaskRequest, language: string): Promise<Task> {
    const { subject, taskType } = request;
    const promptFile = await this.readPromptFile(`tasks/prompts/${subject}.yaml`);
    
    // Set concept rule based on task type
    const conceptRule = taskType === 'random' 
      ? getAvailableTaskTypes(subject)
      : getSpecificTaskType(subject, taskType);

    const prompt = promptFile.prompt
      .replace('{{age}}', request.age.toString())
      .replace('{{difficulty}}', request.difficulty)
      .replace('{{language}}', language)
      .replace('{{concept_rule}}', conceptRule);

    const response = await this.aiClient.generate(prompt);
    if (!response?.response) {
      throw new Error('Failed to generate task');
    }

    return JSON.parse(response.response);
  }
} 