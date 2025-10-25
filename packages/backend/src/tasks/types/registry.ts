import { BaseTaskType } from './base';
import * as taskTypes from './index';

export class TaskTypeRegistry {
  private static instance: TaskTypeRegistry;
  private taskTypes: Map<string, BaseTaskType> = new Map();

  private constructor() {
    Object.values(taskTypes).forEach(taskType => {
      if (this.isTaskType(taskType)) {
        this.taskTypes.set(taskType.id, taskType);
      }
    });
  }

  private isTaskType(obj: any): obj is BaseTaskType {
    return obj &&
           obj instanceof BaseTaskType &&
           typeof obj.id === 'string' &&
           typeof obj.name === 'string' &&
           typeof obj.description === 'string' &&
           typeof obj.promptTemplate === 'string' &&
           typeof obj.jsonSchema === 'object';
  }

  public static getInstance(): TaskTypeRegistry {
    if (!TaskTypeRegistry.instance) {
      TaskTypeRegistry.instance = new TaskTypeRegistry();
    }
    return TaskTypeRegistry.instance;
  }

  public get(id: string): BaseTaskType | undefined {
    return this.taskTypes.get(id);
  }

  public getAll(): BaseTaskType[] {
    return Array.from(this.taskTypes.values());
  }
}

export const registry = TaskTypeRegistry.getInstance(); 