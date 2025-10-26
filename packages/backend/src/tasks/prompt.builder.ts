import { TaskGenerationParams } from './types.ts';
import { Subject, HintPrompt, Concept } from './loader.ts';
import { TaskTypeWithSchema } from './types/registry.ts';
import { TemplateProcessor } from './template.ts';
import { VariationLoader } from './variation.loader.ts';
import { EnrichedConcept } from './schemas.ts';

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
   * Build the final prompt by combining templates and replacing variables
   * Now accepts full EnrichedConcept object with all metadata
   */
  buildPrompt(params: TaskGenerationParams, enrichedConcept: EnrichedConcept): string {
    // Enriched concept is already provided with all metadata
    // No need to look it up in legacy concepts map

    // Prepare base variables with concept metadata
    const baseVariables = {
      age: params.grade * 6, // Approximate age from grade (will be replaced with actual age if available)
      grade: params.grade,
      difficulty: params.difficulty,
      language: this.formatLanguage(params.language),
      concept_name: enrichedConcept.name,
      concept_focus: enrichedConcept.focus,
      concept_difficulty: enrichedConcept.difficulty,
      subject_name: this.subject.name,
    };

    // Add variation variables (always set, empty if not applicable)
    const variationVariables: Record<string, any> = {
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

    // Build concept metadata section
    const metadataSections: string[] = [];

    // Learning objectives
    metadataSections.push('## Learning Objectives');
    for (const objective of enrichedConcept.learning_objectives) {
      metadataSections.push(`- ${objective}`);
    }
    metadataSections.push('');

    // Prerequisites (if any)
    if (enrichedConcept.prerequisites && enrichedConcept.prerequisites.length > 0) {
      metadataSections.push('## Prerequisites');
      metadataSections.push(`Students should already understand: ${enrichedConcept.prerequisites.join(', ')}`);
      metadataSections.push('');
    }

    // Example tasks (if any)
    if (enrichedConcept.example_tasks && enrichedConcept.example_tasks.length > 0) {
      metadataSections.push('## Example Tasks for this Concept');
      for (const example of enrichedConcept.example_tasks) {
        metadataSections.push(`- ${example}`);
      }
      metadataSections.push('');
    }

    // Real-world context (if any)
    if (enrichedConcept.real_world_context) {
      metadataSections.push('## Real-World Context');
      metadataSections.push(enrichedConcept.real_world_context);
      metadataSections.push('');
    }

    const conceptMetadata = metadataSections.join('\n');

    // Process sub-templates first
    const processedVariables = {
      ...baseVariables,
      ...variationVariables,
      concept_metadata: conceptMetadata,
      concept_template: TemplateProcessor.replace(enrichedConcept.prompt, baseVariables),
      task_type_template: TemplateProcessor.replace(this.taskType.promptTemplate, baseVariables)
    };

    // Build the final prompt from base prompt + subject template
    const sections: string[] = [];

    // 1. Base role and guidelines
    sections.push('# Role and Guidelines');
    sections.push(TemplateProcessor.replace(this.basePrompt, baseVariables));
    sections.push('');

    // 2. Subject context
    sections.push('# Subject Context');
    sections.push(`**Subject:** ${this.subject.name}`);
    sections.push(TemplateProcessor.replace(this.subject.basePromptTemplate, baseVariables));
    sections.push('');

    // 3. Concept details with full metadata
    sections.push('# Concept Details');
    sections.push(`**Concept:** ${enrichedConcept.name}`);
    sections.push(`**Focus:** ${enrichedConcept.focus}`);
    sections.push(`**Grade Level:** ${enrichedConcept.grade} (Ages: ${enrichedConcept.ages.join(', ')})`);
    sections.push(`**Difficulty:** ${enrichedConcept.difficulty}`);
    sections.push('');
    sections.push(conceptMetadata);

    // 4. Concept-specific instructions
    sections.push('# Concept-Specific Instructions');
    sections.push(TemplateProcessor.replace(enrichedConcept.prompt, baseVariables));
    sections.push('');

    // 5. Task type instructions
    sections.push('# Task Type');
    sections.push(TemplateProcessor.replace(this.taskType.promptTemplate, baseVariables));
    sections.push('');

    // 6. Variations (if any)
    if (variationVariables.scenario || variationVariables.enrichment_instruction) {
      sections.push('# Personalization');
      if (variationVariables.scenario) {
        sections.push(`**Scenario Context:** ${variationVariables.scenario}`);
      }
      if (variationVariables.enrichment_instruction) {
        sections.push(`**Enrichment:** ${variationVariables.enrichment_instruction}`);
      }
      sections.push('');
    }

    // 7. Final instruction
    sections.push('# Your Task');
    sections.push(`Generate a ${params.difficulty} ${this.taskType.name} task for this concept.`);
    sections.push(`The task must be in ${this.formatLanguage(params.language)} and appropriate for grade ${params.grade} students.`);
    sections.push(`Follow the learning objectives and use the provided context to create an engaging, educational task.`);

    const finalPrompt = sections.join('\n');

    if(process.env.NODE_ENV === 'development') {
      // Debug logging
      console.log('\n=== PROMPT GENERATION DEBUG ===');
      console.log('Subject:', this.subject.id);
      console.log('Concept:', params.concept);
      console.log('Task Type:', this.taskType.id);
      console.log('Concept Metadata:', {
        name: enrichedConcept.name,
        grade: enrichedConcept.grade,
        ages: enrichedConcept.ages,
        focus: enrichedConcept.focus,
        difficulty: enrichedConcept.difficulty,
        learning_objectives: enrichedConcept.learning_objectives,
        prerequisites: enrichedConcept.prerequisites,
        example_tasks: enrichedConcept.example_tasks,
        real_world_context: enrichedConcept.real_world_context,
        source: enrichedConcept.source
      });
      console.log('\nVariation Variables:', JSON.stringify(variationVariables, null, 2));
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
