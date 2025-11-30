import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { TaskService } from './service'
import { HintService } from '../hints/service'
import type { TaskRequest, TaskResponse } from './types'

@injectable()
export class TasksController {
  constructor(
    @inject(TaskService) private taskService: TaskService,
    @inject(HintService) private hintService: HintService
  ) {}

  async getTask(input: TaskRequest, userId: string): Promise<TaskResponse> {
    return this.taskService.generateTask(input, userId)
  }

  async getHint(
    taskId: string,
    userId: string
  ): Promise<{
    hint: string
    hintNumber: number
    totalHintsAvailable: number
    usage?: {
      inputTokens: number
      outputTokens: number
      totalTokens: number
      cost?: number
    }
  }> {
    return this.hintService.generateHint(taskId, userId)
  }
}
