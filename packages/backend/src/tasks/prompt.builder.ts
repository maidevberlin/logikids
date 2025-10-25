import { TaskGenerationParams } from './types.ts';
import { Subject, HintPrompt } from './loader.ts';
import { TaskTypeWithSchema } from './types/registry.ts';
import { TemplateProcessor } from './template.ts';

const LANGUAGE_NAMES: Record<string, string> = {
  'en': 'English',
  'de': 'German'
};

/**
 * Builds prompts by combining subject, concept, and task type templates
 */
export class PromptBuilder {
  constructor(
    private subject: Subject,
    private taskType: TaskTypeWithSchema,
    private hintPrompt?: HintPrompt
  ) {}

  /**
   * Format language code to full name (e.g. "de" -> "German")
   */
  private formatLanguage(code: string): string {
    return LANGUAGE_NAMES[code] || code;
  }

  /**
   * Build the final prompt by combining templates and replacing variables
   */
  buildPrompt(params: TaskGenerationParams): string {
    const concept = this.subject.concepts.get(params.concept);
    if (!concept) {
      throw new Error(`Concept ${params.concept} not found in subject ${this.subject.id}`);
    }

    // Prepare base variables
    const baseVariables = {
      age: params.age,
      difficulty: params.difficulty,
      language: this.formatLanguage(params.language),
      concept_name: concept.name,
      subject_name: this.subject.name,
    };

    // Process sub-templates first
    const processedVariables = {
      ...baseVariables,
      concept_template: TemplateProcessor.replace(concept.promptTemplate, baseVariables),
      task_type_template: TemplateProcessor.replace(this.taskType.promptTemplate, baseVariables)
    };

    // Use the subject's base template as the main template
    const finalPrompt = TemplateProcessor.replace(this.subject.basePromptTemplate, processedVariables);

    if(process.env.NODE_ENV === 'development') {
      // Debug logging
      console.log('\n=== PROMPT GENERATION DEBUG ===');
      console.log('Subject:', this.subject.id);
      console.log('Concept:', params.concept);
      console.log('Task Type:', this.taskType.id);
      console.log('\nVariables:', JSON.stringify(processedVariables, null, 2));
      console.log('\nFinal Prompt:\n', finalPrompt);
      console.log('==============================\n');
    }

    return finalPrompt;
  }

  /**
   * Build a prompt for generating a single hint
   */
  buildHintPrompt(
    context: {
      subject: string;
      concept: string;
      taskType: string;
      age: number;
      difficulty: string;
      language: string;
      task: string;
      solution: any;
      hintsGenerated: string[];
    },
    hintNumber: number
  ): string {
    // If no hint prompt is provided, use fallback template
    if (!this.hintPrompt) {
      throw new Error('Hint prompt template not loaded. Please initialize PromptBuilder with a hint prompt.');
    }

    const languageName = this.formatLanguage(context.language);
    const concept = this.subject.concepts.get(context.concept);

    // Build previous hints section if any exist
    const previousHints = context.hintsGenerated.length > 0
      ? `\n## Previously Given Hints\n${context.hintsGenerated.map((hint, idx) => `**Hint ${idx + 1}:** ${hint}`).join('\n\n')}\n`
      : '';

    // Build progression guidance
    const progressionGuidance = context.hintsGenerated.length > 0
      ? 'IMPORTANT: Build on the previous hints above. Don\'t repeat information already given. Provide the NEXT level of detail.'
      : 'Provide a gentle starting point without giving away the answer.';

    // Prepare variables for template
    const variables = {
      task: context.task,
      solution: JSON.stringify(context.solution, null, 2),
      previousHints,
      hintNumber: hintNumber.toString(),
      age: context.age.toString(),
      conceptName: concept?.name || context.concept,
      language: languageName,
      difficulty: context.difficulty,
      progressionGuidance,
    };

    // Use template processor to replace variables
    return TemplateProcessor.replace(this.hintPrompt.promptTemplate, variables);
  }
} 
