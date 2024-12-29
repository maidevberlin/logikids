import { BaseService } from '../common/baseService';
import { TaskRequest, Task, taskResponseSchema } from './types';
import { AIClient } from '../common/ai/base';
import { AIGenerationError } from '../common/errors';

export class TaskService extends BaseService {
  constructor(aiClient: AIClient) {
    super(aiClient, __dirname);
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
    return this.generateFromPrompt(
      request.subject,
      {
        language,
        age: request.age.toString(),
        difficulty: request.difficulty
      },
      (response) => this.createTask(response, request, language)
    );
  }
} 