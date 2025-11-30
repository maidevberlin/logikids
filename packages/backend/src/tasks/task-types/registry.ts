import * as fs from 'fs/promises'
import * as path from 'path'
import { PromptLoader, TaskType } from '../../prompts/loader'
import { singleChoiceSchema } from './singleChoice'
import { yesNoSchema } from './yesNo'
import { fillInBlankSchema } from './fillInBlank'
import { multiSelectSchema } from './multiSelect'
import { numberInputSchema } from './numberInput'
import { orderingSchema } from './ordering'
import { JSONSchema } from '../../common/ai/base'
import { createLogger, Logger } from '../../common/logger'
import { NoJsonSchemaError } from '../../common/errors'
import { BaseRegistry } from '../../common/registry'

const logger = createLogger('TaskTypeRegistry')

/**
 * Extended TaskType with JSON schema for validation
 */
export interface TaskTypeWithSchema extends TaskType {
  jsonSchema: JSONSchema
}

/**
 * Registry for managing all available task types
 */
export class TaskTypeRegistry extends BaseRegistry<TaskTypeWithSchema> {
  private loader: PromptLoader

  // Map of task type IDs to their JSON schemas
  private readonly schemas: Record<string, JSONSchema> = {
    singleChoice: singleChoiceSchema,
    yesNo: yesNoSchema,
    fillInBlank: fillInBlankSchema,
    multiSelect: multiSelectSchema,
    numberInput: numberInputSchema,
    ordering: orderingSchema,
  }

  constructor(loader?: PromptLoader) {
    super()
    this.loader = loader || new PromptLoader()
  }

  /**
   * Get all task type IDs to load
   */
  protected async getItemIds(): Promise<string[]> {
    const promptsDir = path.join(process.cwd(), 'prompts')
    const taskTypesDir = path.join(promptsDir, 'task-types')

    const taskTypeFiles = await fs.readdir(taskTypesDir)
    return taskTypeFiles
      .filter((file) => file.endsWith('.md'))
      .map((file) => file.replace('.md', ''))
  }

  /**
   * Load a single task type
   */
  protected async loadItem(taskTypeId: string): Promise<TaskTypeWithSchema> {
    const taskType = await this.loader.loadTaskType(taskTypeId)

    // Get the JSON schema for this task type
    const jsonSchema = this.schemas[taskTypeId]
    if (!jsonSchema) {
      throw new NoJsonSchemaError(taskTypeId)
    }

    return {
      ...taskType,
      jsonSchema,
    }
  }

  /**
   * Get the key to use for storing a task type
   */
  protected getItemKey(taskType: TaskTypeWithSchema): string {
    return taskType.id
  }

  /**
   * Get the logger instance
   */
  protected getLogger(): Logger {
    return logger
  }

  /**
   * Get the registry name for logging
   */
  protected getRegistryName(): string {
    return 'TaskTypeRegistry'
  }

  /**
   * Hook called after successful initialization
   * Enables hot-reload in development mode
   */
  protected async afterInitialize(): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      this.loader.enableHotReload()
    }
  }
}

// Export singleton instance
export const taskTypeRegistry = new TaskTypeRegistry()
