import { BaseTaskController } from '../../common/tasks/base-task.controller';
import { TaskResponse } from '../../types/task';
import { ArithmeticTaskService } from './task.service';

export class ArithmeticTaskController extends BaseTaskController {
  protected async generateTaskInternal(language?: string): Promise<TaskResponse> {
    const arithmeticService = new ArithmeticTaskService(this.aiClient);
    return arithmeticService.generateTask(language);
  }
} 