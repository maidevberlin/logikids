import { TaskResponse } from '../../types/task';
import { BaseTaskController } from '../../services/tasks/base-task.controller';
import { ArithmeticTaskService } from './task.service';
import { createAIClient } from '../../services/config';

export class ArithmeticTaskController extends BaseTaskController {
  private static arithmeticService: ArithmeticTaskService;

  static async initializeService() {
    if (!ArithmeticTaskController.arithmeticService) {
      const aiClient = await createAIClient();
      super.initialize(aiClient);
      ArithmeticTaskController.arithmeticService = new ArithmeticTaskService(aiClient);
    }
  }

  protected async generateTaskInternal(language?: string): Promise<TaskResponse> {
    if (!ArithmeticTaskController.arithmeticService) {
      await ArithmeticTaskController.initializeService();
    }
    return ArithmeticTaskController.arithmeticService.generateTask(language);
  }
} 