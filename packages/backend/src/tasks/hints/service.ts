import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { AIClient } from '../../common/ai/base'
import { PromptBuilder } from '../../prompts/builder'
import { PromptLoader } from '../../prompts/loader'
import { TaskTypeRegistry } from '../task-types'
import { TaskCache } from '../../cache/taskCache'
import { hintSchema } from '../../prompts/schemas'
import { SubjectRegistry } from '../../subjects/registry'
import { VariationLoader } from '../../prompts/variations/loader'
import { notFound, badRequest } from '../../common/errors'
import { AIClientToken } from '../../di-tokens'

@injectable()
export class HintService {
  constructor(
    @inject(AIClientToken) private readonly aiClient: AIClient,
    @inject(SubjectRegistry) private readonly subjectRegistry: SubjectRegistry,
    @inject(TaskTypeRegistry) private readonly taskTypeRegistry: TaskTypeRegistry,
    @inject(TaskCache) private readonly taskCache: TaskCache,
    @inject(PromptLoader) private readonly promptLoader: PromptLoader,
    @inject(VariationLoader) private readonly variationLoader: VariationLoader
  ) {}

  /**
   * Initialize the hint service (load variations)
   */
  async initialize(): Promise<void> {
    await this.variationLoader.loadAll()
  }

  public async generateHint(
    taskId: string,
    userId?: string
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
    // Get task context from cache
    const context = this.taskCache.get(taskId)
    if (!context) {
      throw notFound('Task not found or expired')
    }

    // Check if all hints have been used
    const hintNumber = context.hintsGenerated.length + 1
    if (hintNumber > 4) {
      throw badRequest('All hints have been used')
    }

    // Get subject and task type for prompt building
    const subject = this.subjectRegistry.get(context.subject)
    if (!subject) {
      throw notFound(`Subject ${context.subject} not found`)
    }

    const taskType = this.taskTypeRegistry.get(context.taskType)
    if (!taskType) {
      throw notFound(`Task type ${context.taskType} not found`)
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

    // Generate hint using structured output
    const aiStartTime = Date.now()
    const aiResponse = await this.aiClient.generateStructured<{ hint: string }>(
      hintPrompt,
      hintSchema,
      {
        costTracking: {
          userId,
          subject: context.subject,
          concept: context.concept,
        },
      }
    )

    // Store hint in cache
    context.hintsGenerated.push(aiResponse.result.hint)
    this.taskCache.set(taskId, context)

    return {
      hint: aiResponse.result.hint,
      hintNumber,
      totalHintsAvailable: 4,
      ...(aiResponse.usage && {
        usage: {
          inputTokens: aiResponse.usage.inputTokens,
          outputTokens: aiResponse.usage.outputTokens,
          totalTokens: aiResponse.usage.inputTokens + aiResponse.usage.outputTokens,
          ...(aiResponse.usage.cost !== undefined && { cost: aiResponse.usage.cost }),
        },
      }),
    }
  }
}
