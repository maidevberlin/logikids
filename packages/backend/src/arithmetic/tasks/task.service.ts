import path from 'path';
import { arithmeticTaskResponseSchema, ArithmeticTaskResponse } from './task';
import { baseTaskResponseSchema } from '../../types/task';
import { BaseTaskService } from '../../common/tasks/base-task.service';

export class ArithmeticTaskService extends BaseTaskService {
  protected promptPath = path.join(__dirname, 'prompt.yaml');
  protected taskType = 'arithmetic';

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