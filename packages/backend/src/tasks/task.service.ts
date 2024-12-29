import { BaseService } from '../common/baseService';
import { TaskRequest, Task, taskResponseSchema, Subject } from './types';
import { AIClient } from '../common/ai/base';
import { AIGenerationError } from '../common/errors';
import { ValidationError } from '../common/errors';
import { z } from 'zod';

export class TaskService extends BaseService {
  constructor(aiClient: AIClient) {
    super(aiClient, __dirname);
  }

  private createTask(response: string, request: TaskRequest, language: string): Task {
    try {
      const parsedResponse = taskResponseSchema.parse(JSON.parse(response));
      return {
        ...parsedResponse,
        type: request.subject === 'math' ? 'math' : 'logic',
        metadata: {
          difficulty: request.difficulty,
          age: request.age,
          provider: this.aiClient.provider,
          model: this.aiClient.model,
          language,
          subject: request.subject
        }
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AIGenerationError('AI response is not valid JSON');
      }
      if (error instanceof z.ZodError) {
        throw new ValidationError(error.errors);
      }
      throw error;
    }
  }

  private fillPromptVariables(prompt: string, request: TaskRequest, language: string): string {
    const conceptText = request.concept ? ` focusing on ${request.concept}` : '';
    const conceptRule = request.concept ? `- You must focus on the mathematical concept: ${request.concept}` : '';

    return prompt
      .replace(/\{\{language\}\}/g, language)
      .replace(/\{\{age\}\}/g, request.age.toString())
      .replace(/\{\{difficulty\}\}/g, request.difficulty)
      .replace(/\{\{concept\}\}/g, conceptText)
      .replace(/\{\{concept_rule\}\}/g, conceptRule);
  }

  async generateTask(request: TaskRequest, language = 'en'): Promise<Task> {
    const prompt = await this.promptService.getPrompt(request.subject);
    const filledPrompt = this.fillPromptVariables(prompt.prompt, request, language);
    
    const response = await this.aiClient.generate(filledPrompt);
    if (!response?.response) {
      throw new AIGenerationError('Failed to generate task');
    }

    return this.createTask(response.response, request, language);
  }
} 