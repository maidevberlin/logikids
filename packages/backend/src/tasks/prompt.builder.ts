import { TaskGenerationParams } from './types.ts';
import { Subject, HintPrompt, Concept } from './loader.ts';
import { TaskTypeWithSchema } from './types/registry.ts';
import { TemplateProcessor } from './template.ts';
import { VariationLoader } from './variation.loader.ts';
import { Concept } from './schemas.ts';

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
    private variationLoader: VariationLoader,
    private basePrompt: string,
    private variationsTemplate: string,
    private hintPrompt?: HintPrompt
  ) {}

  /**
   * Format language code to full name (e.g. "de" -> "German")
   */
  private formatLanguage(code: string): string {
    return LANGUAGE_NAMES[code] || code;
  }

  /**
   * Get language style based on grade
   */
  private getLanguageStyle(grade: number): string {
    if (grade <= 4) {
      return "Use very simple, playful language with short sentences. Keep it fun and encouraging.";
    } else if (grade <= 8) {
      return "Use casual but structured language. Explain concepts clearly without being condescending.";
    } else {
      return "Use sophisticated, respectful tone. Assume good comprehension and critical thinking skills.";
    }
  }

  /**
   * Build the final prompt by combining templates with scoped variable replacement
   */
  buildPrompt(params: TaskGenerationParams): string {
    // === STEP 1: Prepare all scoped variables ===

    // Variation variables (for variations.md)
    const variationVariables: Record<string, string> = {
      scenario: this.variationLoader.getScenario(params.grade),
      language_style: params.grade ? this.getLanguageStyle(params.grade) : '',
      student_context: params.gender ? `The student identifies as ${params.gender}. Consider this naturally in your task creation.` : '',
      enrichment_instruction: '',
    };

    // Add enrichment (30-50% chance)
    const enrichment = this.variationLoader.getRandomEnrichment();
    if (enrichment) {
      variationVariables.enrichment_instruction = enrichment.value;
    }

    // Subject variables (for subjects/{subject}/base.md)
    const subjectVariables: Record<string, string | number> = {
      age: params.grade * 6,
      grade: params.grade,
      difficulty: params.difficulty,
      language: this.formatLanguage(params.language),
      concept_name: params.concept.name,
      concept_focus: params.concept.focus,
      concept_difficulty: params.concept.difficulty,
      subject_name: this.subject.name,
    };

    // Concept variables (for concept-specific prompts)
    const conceptVariables: Record<string, string | number> = {
      concept_name: params.concept.name,
      concept_focus: params.concept.focus,
      grade: params.grade,
      age: params.grade + 6,
      learning_objectives: params.concept.learning_objectives?.join('\n- ') || '',
      prerequisites: params.concept.prerequisites?.join(', ') || '',
      example_tasks: params.concept.example_tasks?.join('\n- ') || '',
      real_world_context: params.concept.real_world_context || '',
    };

    // Task type variables (for task-types/{type}.md)
    const taskTypeVariables: Record<string, string | number> = {
      difficulty: params.difficulty,
      task_type_name: this.taskType.name,
      age: params.grade * 6,
    };

    // === STEP 2: Load and process sub-templates with scoped variables ===

    // Process variations template (already loaded via constructor)
    const variationsProcessed = TemplateProcessor.replaceScoped(this.variationsTemplate, variationVariables);

    // Subject base already loaded (this.subject.basePromptTemplate)
    const subjectBaseProcessed = TemplateProcessor.replaceScoped(
      this.subject.basePromptTemplate,
      subjectVariables
    );

    // Concept prompt already loaded (params.concept.prompt)
    const conceptProcessed = TemplateProcessor.replaceScoped(
      params.concept.prompt,
      conceptVariables
    );

    // Task type already loaded (this.taskType.promptTemplate)
    const taskTypeProcessed = TemplateProcessor.replaceScoped(
      this.taskType.promptTemplate,
      taskTypeVariables
    );

    // === STEP 3: Compose master template with processed sub-templates ===

    // Prepare composition variables (template includes)
    const compositionVariables: Record<string, string> = {
      variations_template: variationsProcessed,
      subject_base_template: subjectBaseProcessed,
      concept_template: conceptProcessed,
      task_type_template: taskTypeProcessed,
      grade: String(params.grade),
      age: String(params.grade * 6),
      difficulty: params.difficulty,
      language: this.formatLanguage(params.language),
    };

    // Load and process base prompt template
    const finalPrompt = TemplateProcessor.replace(this.basePrompt, compositionVariables);

    // === STEP 5: Validate no placeholders remain ===

    TemplateProcessor.validateNoPlaceholders(finalPrompt, 'PromptBuilder.buildPrompt');

    // === STEP 6: Debug logging ===

    if(process.env.NODE_ENV === 'development') {
      console.log('\n=== PROMPT GENERATION DEBUG ===');
      console.log('Subject:', this.subject.id);
      console.log('Concept:', params.concept.id);
      console.log('Task Type:', this.taskType.id);
      console.log('Variation Variables:', JSON.stringify(variationVariables, null, 2));
      console.log('\n=== COMPOSED PROMPT ===');
      console.log(finalPrompt);
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
      grade: number;
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
      grade: context.grade.toString(),
      conceptName: concept?.name || context.concept,
      language: languageName,
      difficulty: context.difficulty,
      progressionGuidance,
    };

    // Use template processor to replace variables
    return TemplateProcessor.replace(this.hintPrompt.promptTemplate, variables);
  }
} 
