import { multipleChoiceType } from '../taskTypes/multipleChoice';
import { TaskType, TaskResponse, TaskTypeId } from '../taskTypes/types';

/**
 * Registry for managing task types in the system.
 * Implements the singleton pattern to ensure a single instance across the application.
 */
export class TaskTypeRegistry {
  private static instance: TaskTypeRegistry;
  private taskTypes: Map<TaskTypeId, TaskType> = new Map();

  private constructor() {}

  /**
   * Gets the singleton instance of the TaskTypeRegistry
   */
  static getInstance(): TaskTypeRegistry {
    if (!TaskTypeRegistry.instance) {
      TaskTypeRegistry.instance = new TaskTypeRegistry();
    }
    return TaskTypeRegistry.instance;
  }

  /**
   * Registers a new task type in the registry
   * @param taskType The task type to register
   * @throws Error if a task type with the same ID already exists
   */
  register<T extends TaskResponse>(taskType: TaskType<T>): void {
    if (this.taskTypes.has(taskType.id)) {
      throw new Error(`Task type ${taskType.id} is already registered`);
    }
    this.taskTypes.set(taskType.id, taskType);
  }

  /**
   * Gets a task type by its ID
   * @param id The ID of the task type to retrieve
   * @returns The task type or undefined if not found
   */
  get(id: TaskTypeId): TaskType | undefined {
    return this.taskTypes.get(id);
  }

  /**
   * Gets a random task type from the registry
   * @throws Error if no task types are registered
   */
  getRandomTaskType(): TaskType {
    return multipleChoiceType;
    // Original implementation:
    const types = Array.from(this.taskTypes.values());
    if (types.length === 0) {
      throw new Error('No task types registered');
    }
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Gets all registered task types
   */
  getAllTaskTypes(): TaskType[] {
    return Array.from(this.taskTypes.values());
  }

  /**
   * Checks if a task type is registered
   * @param id The ID of the task type to check
   */
  hasTaskType(id: TaskTypeId): boolean {
    return this.taskTypes.has(id);
  }

  /**
   * Clears all registered task types
   * Mainly used for testing purposes
   */
  clear(): void {
    this.taskTypes.clear();
  }
} 