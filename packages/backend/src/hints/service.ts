import { AIClient } from '../common/ai/base'
import { PromptBuilder } from '../prompts/builder'
import { PromptLoader } from '../prompts/loader'
import { taskTypeRegistry } from '../tasks/task-types'
import { taskCache } from '../cache/taskCache'
import { hintSchema } from '../prompts/schemas'
import { subjectRegistry } from '../subjects/registry'
import { VariationLoader } from '../prompts/variations/loader'
import { createLogger } from '../common/logger'
import {
  TaskNotFoundError,
  AllHintsUsedError,
  SubjectNotFoundError,
  TaskTypeNotFoundError,
} from '../common/errors'

const logger = createLogger('HintService')

export class HintService {
  private readonly promptLoader: PromptLoader
  private readonly variationLoader: VariationLoader

  constructor(private readonly aiClient: AIClient) {
    this.promptLoader = new PromptLoader()
    this.variationLoader = new VariationLoader()
  }

  /**
   * Initialize the hint service (load variations)
   */
  async initialize(): Promise<void> {
    logger.info('Initializing...')
    await this.variationLoader.loadAll()
    logger.info('Initialization complete')
  }

  public async generateHint(taskId: string): Promise<{
    hint: string
    hintNumber: number
    totalHintsAvailable: number
  }> {
    logger.info('Generating hint for task', { taskId })

    // Get task context from cache
    const context = taskCache.get(taskId)
    if (!context) {
      throw new TaskNotFoundError()
    }

    // Check if all hints have been used
    const hintNumber = context.hintsGenerated.length + 1
    if (hintNumber > 4) {
      throw new AllHintsUsedError()
    }

    // Get subject and task type for prompt building
    const subject = subjectRegistry.get(context.subject)
    if (!subject) {
      throw new SubjectNotFoundError(context.subject)
    }

    const taskType = taskTypeRegistry.get(context.taskType)
    if (!taskType) {
      throw new TaskTypeNotFoundError(context.taskType)
    }

    // Load base prompt, variations template, and hint prompt template
    const basePrompt = await this.promptLoader.loadBasePrompt()
    const variationsTemplate = await this.promptLoader.loadVariationsTemplate()
    const hintPromptTemplate = await this.promptLoader.loadHintPrompt()

    // Build hint prompt
    const promptBuilder = new PromptBuilder(
      subject,
      taskType,
      this.variationLoader,
      basePrompt,
      variationsTemplate,
      hintPromptTemplate
    )

    const hintPrompt = promptBuilder.buildHintPrompt(
      {
        subject: context.subject,
        concept: context.concept,
        taskType: context.taskType,
        grade: context.grade,
        difficulty: context.difficulty,
        language: context.language,
        taskResponse: context.taskResponse,
        hintsGenerated: context.hintsGenerated,
      },
      hintNumber
    )

    logger.debug('Hint prompt built', { promptLength: hintPrompt.length })

    // Generate hint using structured output
    const aiStartTime = Date.now()
    const aiResponse = await this.aiClient.generateStructured<{ hint: string }>(
      hintPrompt,
      hintSchema
    )
    const aiDuration = Date.now() - aiStartTime
    logger.info('Hint generated', { duration: aiDuration, usage: aiResponse.usage })

    // Store hint in cache
    context.hintsGenerated.push(aiResponse.result.hint)
    taskCache.set(taskId, context)
    logger.debug('Hint stored in cache', { totalHints: context.hintsGenerated.length })

    return {
      hint: aiResponse.result.hint,
      hintNumber,
      totalHintsAvailable: 4,
    }
  }
}
