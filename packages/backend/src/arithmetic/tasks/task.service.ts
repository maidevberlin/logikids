import path from 'path';
import { AIClient } from '../../services/ai/base';
import { arithmeticTaskResponseSchema, ArithmeticTaskResponse } from './task';
import { BaseTaskService } from '../../services/tasks/base-task.service';
import { baseTaskResponseSchema } from '../../types/task';

export class ArithmeticTaskService extends BaseTaskService {
  protected promptPath = path.join(process.cwd(), 'src', 'arithmetic', 'tasks', 'prompt.yaml');
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