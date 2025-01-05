import { TaskGenerationParams } from '../types';
import { Subject, ConceptId } from '../subjects/types';
import { TaskType } from '../taskTypes/types';
import { TemplateProcessor } from './template';

/**
 * Builds prompts by combining subject, concept, and task type templates
 */
export class PromptBuilder<C extends ConceptId = ConceptId> {
  constructor(
    private subject: Subject<C>,
    private taskType: TaskType
  ) {}

  /**
   * Build the final prompt by combining templates and replacing variables
   */
  buildPrompt(params: TaskGenerationParams): string {
    const concept = this.subject.concepts[params.concept as C];
    if (!concept) {
      throw new Error(`Concept ${params.concept} not found in subject ${this.subject.id}`);
    }

    // Prepare variables for template replacement
    const variables = {
      age: params.age,
      difficulty: params.difficulty,
      language: params.language,
      concept_name: concept.name,
      subject_name: this.subject.name,
      concept_template: concept.promptTemplate,
      task_type_template: this.taskType.promptTemplate
    };

    // Use the subject's base template as the main template
    // It already contains placeholders for concept_template and task_type_template
    return TemplateProcessor.replace(this.subject.basePromptTemplate, variables);
  }
} 