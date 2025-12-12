import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { PromptLoader } from './loader'
import { VariationLoader } from './variations/loader'
import { PromptBuilder } from './builder'
import { PromptBuildingParams } from './types'

/**
 * Service responsible for building prompts for task generation
 * Encapsulates all prompt loading and building logic
 */
@injectable()
export class PromptService {
  constructor(
    @inject(PromptLoader) private readonly promptLoader: PromptLoader,
    @inject(VariationLoader) private readonly variationLoader: VariationLoader
  ) {}

  /**
   * Initialize the service by loading all variations
   */
  async initialize(): Promise<void> {
    await this.variationLoader.loadAll()
  }

  /**
   * Build a complete prompt for task generation
   * @param params Parameters for prompt building
   * @returns Complete prompt string ready for AI client
   */
  async buildPrompt(params: PromptBuildingParams): Promise<string> {
    // Load base prompt
    const basePrompt = await this.promptLoader.loadBasePrompt()

    // Load variations template
    const variationsTemplate = await this.promptLoader.loadVariationsTemplate()

    // Load hint prompt
    const hintPrompt = await this.promptLoader.loadHintPrompt()

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
      grade: params.grade,
      difficulty: params.difficulty,
      language: params.language,
      taskType: params.taskType.id,
    })

    return finalPrompt
  }
}
