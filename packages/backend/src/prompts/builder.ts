import { TaskGenerationParams, BaseTaskResponse } from '../tasks/types'
import { Subject, HintPrompt } from './loader'
import { TaskTypeWithSchema } from '../tasks/task-types'
import { validateNoPlaceholders } from './helpers'
import { VariationLoader } from './variations/loader'
import { composeAndReplace, replaceVariables, compileHandlebars } from './template-replacer'
import { createLogger } from '../common/logger'
import { HintPromptNotLoadedError } from '../common/errors'

const logger = createLogger('PromptBuilder')

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  de: 'German',
}

/**
 * Randomly select one item from an array
 */
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

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
    return LANGUAGE_NAMES[code] || code
  }

  /**
   * Get language style based on grade
   */
  private getLanguageStyle(grade: number): string {
    if (grade <= 4) {
      return 'Use very simple, playful language with short sentences. Keep it fun and encouraging.'
    } else if (grade <= 8) {
      return 'Use casual but structured language. Explain concepts clearly without being condescending.'
    } else {
      return 'Use sophisticated, respectful tone. Assume good comprehension and critical thinking skills.'
    }
  }

  /**
   * Build the final prompt by combining templates with flat variable replacement
   */
  buildPrompt(params: TaskGenerationParams): string {
    // === STEP 0: Prepare variables for Handlebars (needed for concept template) ===
    // Select one learning objective and problem type randomly
    const selectedObjective = randomChoice(params.concept.learning_objectives)
    const selectedProblemType = randomChoice(params.concept.problem_types)

    // Resolve guidelines for this student
    const difficultyGuidelines = params.concept.difficulty_guidelines[params.difficulty]

    // Variables needed for Handlebars conditionals in concept templates
    const handlebarsVariables = {
      grade: params.grade,
      difficulty: params.difficulty,
      concept_name: params.concept.name,
      concept_focus: params.concept.focus,
    }

    // === STEP 0.5: Compile concept template with Handlebars ===
    // This evaluates conditionals like {{#if (lt grade 4)}}...{{/if}}
    const compiledConceptTemplate = compileHandlebars(params.concept.prompt, handlebarsVariables)

    // === STEP 1: Compose Template Hierarchy ===
    // Insert raw sub-templates into base template structure

    const compositionVariables = {
      variations_template: this.variationsTemplate,
      subject_base_template: this.subject.basePromptTemplate,
      concept_template: compiledConceptTemplate, // Use compiled version
      task_type_template: this.taskType.promptTemplate,
    }

    // === STEP 2: Build Flat Variable Object ===
    // Create single object with ALL variables (duplicates OK - same values)

    const enrichments = this.variationLoader.getRandomEnrichments(params.grade)
    const enrichment = enrichments.length > 0 ? enrichments[0] : null

    // Format multiple enrichments as bullet points
    const enrichmentLabels: Record<string, string> = {
      framing: 'Creative Framing',
      character: 'Character Perspective',
      temporal: 'Time Context',
      metacognitive: 'Thinking Challenge',
      mystery: 'Mystery Element',
      realWorld: 'Real-World Connection',
      emotional: 'Emotional Angle',
      structure: 'Structure Variation',
    }

    const enrichmentsFormatted = enrichments
      .map((e) => `\n- **${enrichmentLabels[e.type]}**: ${e.value}`)
      .join('')

    const allVariables: Record<string, string | number> = {
      // Variation variables (all grade-filtered now!)
      scenario: this.variationLoader.getScenario(params.grade),
      language_style: params.grade ? this.getLanguageStyle(params.grade) : '',
      student_context: '',
      enrichment_instruction: enrichment?.value || '',

      // Formatted versions for clean bullet list integration
      enrichment_formatted: enrichmentsFormatted,
      student_context_formatted: '',

      // Subject/Concept/TaskType variables (duplicates OK - same values)
      grade: params.grade,
      difficulty: params.difficulty,
      language: this.formatLanguage(params.language),
      concept_name: params.concept.name,
      concept_focus: params.concept.focus,
      concept_difficulty: params.concept.difficulty,
      subject_name: this.subject.name,
      task_type_name: this.taskType.name,
      selected_objective: selectedObjective,
      selected_problem_type: selectedProblemType,
      difficulty_guidelines: difficultyGuidelines.map((g) => `- ${g}`).join('\n'),
      prerequisites: params.concept.prerequisites?.join(', ') || '',
      real_world_context: Array.isArray(params.concept.real_world_context)
        ? params.concept.real_world_context.map((c) => `- ${c}`).join('\n')
        : params.concept.real_world_context || '',
      anti_patterns: params.concept.anti_patterns?.length
        ? params.concept.anti_patterns.map((p) => `- ${p}`).join('\n')
        : '',
    }

    // === STEP 3: Compose templates and replace variables ===
    // Step 1: Insert sub-templates using <% %> delimiters
    // Step 2: Replace actual variables using [[ ]] delimiters
    // {{ }} placeholders (like {{a1}}, {{x1}}) are preserved for LLM

    const finalPrompt = composeAndReplace(this.basePrompt, compositionVariables, allVariables)

    // === STEP 4: Validate no placeholders remain ===

    validateNoPlaceholders(finalPrompt, 'PromptBuilder.buildPrompt')

    // === STEP 5: Debug logging ===

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Prompt generation debug', {
        subject: this.subject.id,
        concept: params.concept.id,
        taskType: this.taskType.id,
        variables: allVariables,
        prompt: finalPrompt,
      })
    }

    return finalPrompt
  }

  /**
   * Build a prompt for generating a single hint
   */
  buildHintPrompt(
    context: {
      subject: string
      concept: string
      taskType: string
      grade: number
      difficulty: string
      language: string
      taskResponse: BaseTaskResponse
      hintsGenerated: string[]
    },
    hintNumber: number
  ): string {
    // If no hint prompt is provided, use fallback template
    if (!this.hintPrompt) {
      throw new HintPromptNotLoadedError()
    }

    const languageName = this.formatLanguage(context.language)
    const concept = this.subject.concepts.get(context.concept)

    // Build previous hints section if any exist
    const previousHints =
      context.hintsGenerated.length > 0
        ? `\n## Previously Given Hints\n${context.hintsGenerated.map((hint, idx) => `**Hint ${idx + 1}:** ${hint}`).join('\n\n')}\n`
        : ''

    // Build progression guidance
    const progressionGuidance =
      context.hintsGenerated.length > 0
        ? "IMPORTANT: Build on the previous hints above. Don't repeat information already given. Provide the NEXT level of detail."
        : 'Provide a gentle starting point without giving away the answer.'

    // Prepare variables for template
    const variables = {
      task: context.taskResponse.task,
      solution: JSON.stringify(context.taskResponse, null, 2),
      previousHints,
      hintNumber: hintNumber.toString(),
      grade: context.grade.toString(),
      conceptName: concept?.name || context.concept,
      language: languageName,
      difficulty: context.difficulty,
      progressionGuidance,
    }

    // Replace variables in hint template using [[ ]] delimiters
    return replaceVariables(this.hintPrompt.promptTemplate, variables, ['[[', ']]'])
  }
}
