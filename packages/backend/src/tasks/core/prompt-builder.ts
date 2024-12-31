import { Subject, TaskPromptBuilder, TaskGenerationParams } from './types';

export abstract class BasePromptBuilder implements TaskPromptBuilder {
  constructor(protected subject: Subject) {}

  protected replaceTemplateVariables(template: string, params: TaskGenerationParams): string {
    return template
      .replace('{{age}}', params.age.toString())
      .replace('{{difficulty}}', params.difficulty)
      .replace('{{language}}', params.language);
  }

  public buildPrompt(params: Omit<TaskGenerationParams, 'subject'>): string {
    // Handle random concept case
    if (params.concept === 'random') {
      const availableConcepts = Object.keys(this.subject.concepts);
      const randomConcept = availableConcepts[Math.floor(Math.random() * availableConcepts.length)];
      params = { ...params, concept: randomConcept };
    }

    const concept = this.subject.concepts[params.concept];
    if (!concept) {
      throw new Error(`Concept ${params.concept} not found in subject ${this.subject.id}`);
    }

    // First build the base prompt
    let finalPrompt = this.replaceTemplateVariables(
      this.subject.basePromptTemplate,
      params as TaskGenerationParams
    );

    // Then inject the concept-specific prompt
    finalPrompt = finalPrompt.replace(
      '{{concept_template}}',
      this.replaceTemplateVariables(concept.promptTemplate, params as TaskGenerationParams)
    );

    return finalPrompt;
  }
} 