import { PromptLoader } from './loader';
import { VariationLoader } from '../variations/loader';
import { PromptBuilder } from './builder';
import { PromptBuildingParams } from './types';

/**
 * Service responsible for building prompts for task generation
 * Encapsulates all prompt loading and building logic
 */
export class PromptService {
  private readonly promptLoader: PromptLoader;
  private readonly variationLoader: VariationLoader;

  constructor() {
    this.promptLoader = new PromptLoader();
    this.variationLoader = new VariationLoader();
  }

  /**
   * Initialize the service by loading all variations
   */
  async initialize(): Promise<void> {
    console.log('[PromptService] Initializing...');
    await this.variationLoader.loadAll();
    console.log('[PromptService] Initialization complete');
  }

  /**
   * Build a complete prompt for task generation
   * @param params Parameters for prompt building
   * @returns Complete prompt string ready for AI client
   */
  async buildPrompt(params: PromptBuildingParams): Promise<string> {
    console.log('[PromptService] Building prompt');
    console.log('[PromptService] Subject:', params.subject.id);
    console.log('[PromptService] Concept:', params.concept.id);
    console.log('[PromptService] Task Type:', params.taskType.id);

    // Load base prompt
    const basePrompt = await this.promptLoader.loadBasePrompt();
    console.log('[PromptService] Base prompt loaded');

    // Load variations template
    const variationsTemplate = await this.promptLoader.loadVariationsTemplate();
    console.log('[PromptService] Variations template loaded');

    // Load hint prompt
    const hintPrompt = await this.promptLoader.loadHintPrompt();
    console.log('[PromptService] Hint prompt loaded:', hintPrompt.id);

    // Create prompt builder
    const promptBuilder = new PromptBuilder(
      params.subject,
      params.taskType,
      this.variationLoader,
      basePrompt,
      variationsTemplate,
      hintPrompt
    );

    // Build the final prompt
    const finalPrompt = promptBuilder.buildPrompt({
      subject: params.subject.id,
      concept: params.concept,
      grade: params.grade,
      difficulty: params.difficulty,
      language: params.language,
      taskType: params.taskType.id,
      gender: params.gender
    });

    console.log('[PromptService] Prompt built, length:', finalPrompt.length, 'chars');

    return finalPrompt;
  }
}
