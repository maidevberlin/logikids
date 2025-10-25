import { TaskGenerationParams } from '../types';
import { Subject } from '../loader';
import { TaskTypeWithSchema } from '../types/registry';
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
    private taskType: TaskTypeWithSchema
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
    const languageName = this.formatLanguage(context.language);
    const concept = this.subject.concepts.get(context.concept);

    // Build previous hints section if any exist
    const previousHintsSection = context.hintsGenerated.length > 0
      ? `\n## Previously Given Hints\n${context.hintsGenerated.map((hint, idx) => `**Hint ${idx + 1}:** ${hint}`).join('\n\n')}\n`
      : '';

    return `## Context
You previously generated this task:

**Task:** ${context.task}

**Solution:** ${JSON.stringify(context.solution, null, 2)}
${previousHintsSection}
## Your Role
Generate hint #${hintNumber} of 4 for a student aged ${context.age} working on this ${concept?.name || context.concept} problem.

## Hint Guidelines
- Hint 1: General approach/starting point (don't give away key insights)
- Hint 2: Key concept to focus on (builds on hint 1)
- Hint 3: Major step in reasoning (builds on hints 1 & 2, almost complete guidance)
- Hint 4: Everything except the final answer (builds on all previous hints)

## Requirements
- Language: ${languageName}
- Difficulty: ${context.difficulty}
- ${context.hintsGenerated.length > 0 ? `IMPORTANT: Build on the previous hints above. Don't repeat information already given. Provide the NEXT level of detail.` : 'Provide a gentle starting point without giving away the answer.'}
- Don't reveal the answer directly
- Return a single helpful hint as plain text`;
  }
} 
