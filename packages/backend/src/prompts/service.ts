import { PromptLoader } from './loader'
import { VariationLoader } from './variations/loader'
import { PromptBuilder } from './builder'
import { PromptBuildingParams } from './types'
import { createLogger } from '../common/logger'

const logger = createLogger('PromptService')

/**
 * Service responsible for building prompts for task generation
 * Encapsulates all prompt loading and building logic
 */
export class PromptService {
  constructor(
    private readonly promptLoader: PromptLoader,
    private readonly variationLoader: VariationLoader
  ) {}

  /**
   * Initialize the service by loading all variations
   */
  async initialize(): Promise<void> {
    logger.info('Initializing...')
    await this.variationLoader.loadAll()
    logger.info('Initialization complete')
  }

  /**
   * Build a complete prompt for task generation
   * @param params Parameters for prompt building
   * @returns Complete prompt string ready for AI client
   */
  async buildPrompt(params: PromptBuildingParams): Promise<string> {
    logger.debug('Building prompt', {
      subjectId: params.subject.id,
      conceptId: params.concept.id,
      taskTypeId: params.taskType.id,
    })

    // Load base prompt
    const basePrompt = await this.promptLoader.loadBasePrompt()
    logger.debug('Base prompt loaded')

    // Load variations template
    const variationsTemplate = await this.promptLoader.loadVariationsTemplate()
    logger.debug('Variations template loaded')

    // Load hint prompt
    const hintPrompt = await this.promptLoader.loadHintPrompt()
    logger.debug('Hint prompt loaded', { hintPromptId: hintPrompt.id })

    // Create prompt builder
    const promptBuilder = new PromptBuilder(
      params.subject,
      params.taskType,
      this.variationLoader,
      basePrompt,
      variationsTemplate,
      hintPrompt
    )

    // Build the final prompt
    const finalPrompt = promptBuilder.buildPrompt({
      subject: params.subject.id,
      concept: params.concept,
      age: params.age,
      grade: params.grade,
      difficulty: params.difficulty,
      language: params.language,
      taskType: params.taskType.id,
      gender: params.gender,
    })

    logger.debug('Prompt built', { promptLength: finalPrompt.length })

    return finalPrompt
  }
}
