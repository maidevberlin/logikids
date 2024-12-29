import { AIClient } from '../common/ai/base';
import { 
  taskResponseSchema, 
  TaskRequest, 
  Task
} from './types';
import { AIGenerationError, ValidationError } from '../common/errors';
import { PromptService } from '../common/services/prompt.service';
import { z } from 'zod';

export class TaskService {
  private readonly promptService: PromptService;

  constructor(private readonly aiClient: AIClient) {
    this.promptService = new PromptService(__dirname);
  }

  private createTask(response: string, request: TaskRequest, language: string): Task {
    try {
      const parsedResponse = JSON.parse(response);
      const taskResponse = taskResponseSchema.parse(parsedResponse);
      return {
        ...taskResponse,
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
      throw error;
    }
  }

  async generateTask(request: TaskRequest, language = 'en'): Promise<Task> {
    const prompt = await this.promptService.getPrompt(request.subject);
    
    const filledPrompt = prompt.prompt
      .replace(/\{\{language\}\}/g, language)
      .replace(/\{\{age\}\}/g, request.age.toString())
      .replace(/\{\{difficulty\}\}/g, request.difficulty);

    const response = await this.aiClient.generate(filledPrompt);
    
    if (!response?.response) {
      throw new AIGenerationError('Failed to generate task');
    }

    try {
      return this.createTask(response.response, request, language);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(error.errors);
      }
      throw error;
    }
  }
} 