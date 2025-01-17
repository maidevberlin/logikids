import { TaskGenerationParams } from '../types';
import { Subject, Concept } from '../subjects/base';
import { BaseTaskType } from '../types/base';
import { TemplateProcessor } from './template';

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
    private taskType: BaseTaskType
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
    const concept = this.subject.concepts[params.concept];
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
} 