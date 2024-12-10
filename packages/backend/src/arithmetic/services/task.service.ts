import path from 'path';
import { AIClient } from '../../services/ai/base';
import { TaskResponse } from '../../types/task';
import { arithmeticTaskResponseSchema, ArithmeticTaskResponse } from '../types/task';
import { BaseTaskService } from '../../services/tasks/base-task.service';
import { baseTaskResponseSchema } from '../../shared/types/task';

export class ArithmeticTaskService extends BaseTaskService {
  protected promptPath = path.join(process.cwd(), 'src', 'arithmetic', 'prompts', 'task.yaml');
  protected taskType = 'arithmetic';

  constructor(aiClient: AIClient) {
    super(aiClient);
  }

  protected async validateAndTransformResponse(jsonResponse: unknown): Promise<ArithmeticTaskResponse> {
    try {
      // First validate the base structure without type
      const baseResponse = baseTaskResponseSchema.parse(jsonResponse);
      // Then add type and validate the complete structure
      return arithmeticTaskResponseSchema.parse({
        ...baseResponse,
        type: this.taskType
      });
    } catch (error) {
      throw new Error(`Invalid arithmetic task response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 