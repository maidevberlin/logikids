import { AIClient } from '../common/ai/base';
import { PromptBuilder } from '../prompts/builder';
import { PromptLoader } from '../prompts/loader';
import { taskTypeRegistry } from '../tasks/types/registry';
import { taskCache } from '../cache/taskCache';
import { hintSchema } from '../prompts/schemas';
import { subjectRegistry } from '../subjects/registry';
import { VariationLoader } from '../variations/loader';

export class HintService {
  private readonly promptLoader: PromptLoader;
  private readonly variationLoader: VariationLoader;

  constructor(private readonly aiClient: AIClient) {
    this.promptLoader = new PromptLoader();
    this.variationLoader = new VariationLoader();
  }

  /**
   * Initialize the hint service (load variations)
   */
  async initialize(): Promise<void> {
    console.log('[HintService] Initializing...');
    await this.variationLoader.loadAll();
    console.log('[HintService] Initialization complete');
  }

  public async generateHint(taskId: string): Promise<{
    hint: string;
    hintNumber: number;
    totalHintsAvailable: number;
  }> {
    console.log('[HintService] Generating hint for task:', taskId);

    // Get task context from cache
    const context = taskCache.get(taskId);
    if (!context) {
      throw new Error('Task not found or expired');
    }

    // Check if all hints have been used
    const hintNumber = context.hintsGenerated.length + 1;
    if (hintNumber > 4) {
      throw new Error('All hints have been used');
    }

    // Get subject and task type for prompt building
    const subject = subjectRegistry.get(context.subject);
    if (!subject) {
      throw new Error(`Subject ${context.subject} not found`);
    }

    const taskType = taskTypeRegistry.get(context.taskType);
    if (!taskType) {
      throw new Error(`Task type ${context.taskType} not found`);
    }

    // Load base prompt, variations template, and hint prompt template
    const basePrompt = await this.promptLoader.loadBasePrompt();
    const variationsTemplate = await this.promptLoader.loadVariationsTemplate();
    const hintPromptTemplate = await this.promptLoader.loadHintPrompt();

    // Build hint prompt
    const promptBuilder = new PromptBuilder(
      subject,
      taskType,
      this.variationLoader,
      basePrompt,
      variationsTemplate,
      hintPromptTemplate
    );

    const hintPrompt = promptBuilder.buildHintPrompt(
      {
        subject: context.subject,
        concept: context.concept,
        taskType: context.taskType,
        grade: context.grade,
        difficulty: context.difficulty,
        language: context.language,
        task: context.generatedTask,
        solution: context.solution,
        hintsGenerated: context.hintsGenerated
      },
      hintNumber
    );

    console.log('[HintService] Hint prompt built, length:', hintPrompt.length);

    // Generate hint using structured output
    const aiStartTime = Date.now();
    const response = await this.aiClient.generateStructured<{ hint: string }>(hintPrompt, hintSchema);
    const aiDuration = Date.now() - aiStartTime;
    console.log(`[HintService] Hint generated in ${aiDuration}ms`);

    // Store hint in cache
    context.hintsGenerated.push(response.hint);
    taskCache.set(taskId, context);
    console.log('[HintService] Hint stored in cache, total hints:', context.hintsGenerated.length);

    return {
      hint: response.hint,
      hintNumber,
      totalHintsAvailable: 4
    };
  }
}
