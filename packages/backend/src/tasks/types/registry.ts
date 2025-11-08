import * as fs from 'fs/promises';
import * as path from 'path';
import { PromptLoader, TaskType } from '../../prompts/loader';
import { singleChoiceSchema } from './singleChoice';
import { yesNoSchema } from './yesNo';
import { fillInBlankSchema } from './fillInBlank';
import { multiSelectSchema } from './multiSelect';
import { numberInputSchema } from './numberInput';
import { orderingSchema } from './ordering';
import { JSONSchema } from '../../common/ai/base';

/**
 * Extended TaskType with JSON schema for validation
 */
export interface TaskTypeWithSchema extends TaskType {
  jsonSchema: JSONSchema;
}

/**
 * Registry for managing all available task types
 */
export class TaskTypeRegistry {
  private taskTypes = new Map<string, TaskTypeWithSchema>();
  private loader: PromptLoader;
  private initialized = false;

  // Map of task type IDs to their JSON schemas
  private readonly schemas: Record<string, JSONSchema> = {
    singleChoice: singleChoiceSchema,
    yesNo: yesNoSchema,
    fillInBlank: fillInBlankSchema,
    multiSelect: multiSelectSchema,
    numberInput: numberInputSchema,
    ordering: orderingSchema,
  };

  constructor(loader?: PromptLoader) {
    this.loader = loader || new PromptLoader();
  }

  /**
   * Initialize registry by loading all task types from packages/backend/prompts/task-types/
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('[TaskTypeRegistry] Already initialized');
      return;
    }

    const promptsDir = path.join(process.cwd(), 'prompts');
    const taskTypesDir = path.join(promptsDir, 'task-types');

    try {
      // Get all task type markdown files
      const taskTypeFiles = await fs.readdir(taskTypesDir);
      const taskTypeIds = taskTypeFiles
        .filter((file) => file.endsWith('.md'))
        .map((file) => file.replace('.md', ''));

      console.log(`[TaskTypeRegistry] Loading ${taskTypeIds.length} task types...`);

      // Load each task type
      for (const taskTypeId of taskTypeIds) {
        try {
          const taskType = await this.loader.loadTaskType(taskTypeId);

          // Get the JSON schema for this task type
          const jsonSchema = this.schemas[taskTypeId];
          if (!jsonSchema) {
            throw new Error(`No JSON schema found for task type: ${taskTypeId}`);
          }

          const taskTypeWithSchema: TaskTypeWithSchema = {
            ...taskType,
            jsonSchema,
          };

          this.taskTypes.set(taskType.id, taskTypeWithSchema);
          console.log(`[TaskTypeRegistry] Loaded task type: ${taskType.id}`);
        } catch (error: any) {
          console.error(`[TaskTypeRegistry] Failed to load task type ${taskTypeId}:`, error.message);
          throw error; // Fail fast on invalid prompts
        }
      }

      this.initialized = true;
      console.log(`[TaskTypeRegistry] Initialization complete: ${this.taskTypes.size} task types loaded`);

      // Enable hot-reload in development
      if (process.env.NODE_ENV !== 'production') {
        this.loader.enableHotReload();
      }
    } catch (error: any) {
      throw new Error(`Failed to initialize TaskTypeRegistry: ${error.message}`);
    }
  }

  /**
   * Get a task type by its ID
   */
  get(id: string): TaskTypeWithSchema | undefined {
    return this.taskTypes.get(id);
  }

  /**
   * Get all registered task types
   */
  getAll(): TaskTypeWithSchema[] {
    return Array.from(this.taskTypes.values());
  }
}

// Export singleton instance
export const taskTypeRegistry = new TaskTypeRegistry(); 