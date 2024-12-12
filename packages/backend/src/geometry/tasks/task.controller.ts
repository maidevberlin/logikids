import { TaskResponse } from '../../types/task';
import { BaseTaskController } from '../../services/tasks/base-task.controller';
import { GeometryTaskService } from './task.service';
import { createAIClient } from '../../services/config';

export class GeometryTaskController extends BaseTaskController {
  private static geometryService: GeometryTaskService;

  static async initializeService() {
    if (!GeometryTaskController.geometryService) {
      const aiClient = await createAIClient();
      super.initialize(aiClient);
      GeometryTaskController.geometryService = new GeometryTaskService(aiClient);
    }
  }

  protected async generateTaskInternal(language?: string): Promise<TaskResponse> {
    if (!GeometryTaskController.geometryService) {
      await GeometryTaskController.initializeService();
    }
    return GeometryTaskController.geometryService.generateTask(language);
  }
} 