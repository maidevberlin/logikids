import path from 'path';
import { AIClient } from '../../services/ai/base';
import { geometryTaskResponseSchema, GeometryTaskResponse } from '../types/task';
import { BaseTaskService } from '../../services/tasks/base-task.service';
import { baseTaskResponseSchema } from '../../shared/types/task';

export class GeometryTaskService extends BaseTaskService {
  protected promptPath = path.join(process.cwd(), 'src', 'geometry', 'prompts', 'task.yaml');
  protected taskType = 'geometry';

  constructor(aiClient: AIClient) {
    super(aiClient);
  }

  protected async validateAndTransformResponse(jsonResponse: unknown): Promise<GeometryTaskResponse> {
    try {
      // First validate the base structure without type
      const baseResponse = baseTaskResponseSchema.parse(jsonResponse);
      // Then add type and validate the complete structure
      return geometryTaskResponseSchema.parse({
        ...baseResponse,
        type: this.taskType
      });
    } catch (error) {
      throw new Error(`Invalid geometry task response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 