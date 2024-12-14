import { BaseTaskController, TaskQuery } from '../../common/tasks/base-task.controller';
import { TaskResponse } from '../../types/task';
import { ArithmeticTaskService } from './task.service';

// Extend TaskQuery with arithmetic-specific options if needed in the future
// For example: operation type (addition, subtraction, etc.)
export type ArithmeticTaskQuery = TaskQuery;

export class ArithmeticTaskController extends BaseTaskController {
  protected async generateTaskInternal(query: ArithmeticTaskQuery, language?: string): Promise<TaskResponse> {
    const arithmeticService = new ArithmeticTaskService(this.aiClient);
    return arithmeticService.generateTask(query, language);
  }
} 