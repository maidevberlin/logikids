import {TaskRequest, TaskGenerationParams} from './types';
import {TaskResponse, BaseTaskResponse} from './types';
import {AIClient} from '../common/ai/base';
import {PromptBuilder} from './prompt.builder';
import {PromptLoader} from './loader';
import {taskTypeRegistry} from './types/registry';
import {v4 as uuidv4} from 'uuid';
import {taskCache, TaskContext} from './taskCache';
import {hintSchema} from './schemas.ts';
import {subjectRegistry} from "./subject.registry.ts";
import {VariationLoader} from './variation.loader';

export class TaskService {
    private readonly promptLoader: PromptLoader;
    private readonly variationLoader: VariationLoader;

    constructor(private readonly aiClient: AIClient) {
        this.promptLoader = new PromptLoader();
        this.variationLoader = new VariationLoader();
    }

    /**
     * Initialize the task service (load variations)
     */
    async initialize(): Promise<void> {
        console.log('[TaskService] Initializing...');
        await this.variationLoader.loadAll();
        console.log('[TaskService] Initialization complete');
    }

    public async generateTask(request: TaskRequest, language: string): Promise<TaskResponse> {
        console.log('[TaskService] Starting task generation');
        console.log('[TaskService] Request:', request);

        const {subject: subjectId, concept: requestedConcept, taskType} = request;

        // Get the subject
        const subject = subjectRegistry.get(subjectId);
        if (!subject) {
            throw new Error(`Subject ${subjectId} not found`);
        }
        console.log('[TaskService] Subject loaded:', subjectId);

        // Handle random concept selection using registry methods
        // Try enriched concept first (curriculum + custom), fallback to legacy
        let enrichedConcept = requestedConcept === 'random'
            ? null // Handle random separately below
            : subjectRegistry.getEnrichedConcept(subjectId, requestedConcept);

        // Fallback to legacy concept if enriched not found
        const concept = enrichedConcept
            ? { id: enrichedConcept.id, name: enrichedConcept.name }
            : (requestedConcept === 'random'
                ? subjectRegistry.getRandomConcept(subjectId)
                : subjectRegistry.getConcept(subjectId, requestedConcept));

        if (!concept) {
            throw new Error(`Concept ${requestedConcept} not found in subject ${subjectId}`);
        }
        console.log('[TaskService] Concept loaded:', concept.id);

        // Get the task type (either specified or random)
        const selectedTaskType = taskType
            ? taskTypeRegistry.get(taskType)
            : taskTypeRegistry.getAll()[Math.floor(Math.random() * taskTypeRegistry.getAll().length)];

        if (!selectedTaskType) {
            throw new Error(`Task type ${taskType} not found`);
        }
        console.log('[TaskService] Task type loaded:', selectedTaskType.id);

        // Load base prompt
        const basePrompt = await this.promptLoader.loadBasePrompt();
        console.log('[TaskService] Base prompt loaded');

        // Load variations template
        const variationsTemplate = await this.promptLoader.loadVariationsTemplate();
        console.log('[TaskService] Variations template loaded');

        // Load hint prompt
        const hintPrompt = await this.promptLoader.loadHintPrompt();
        console.log('[TaskService] Hint prompt loaded:', hintPrompt.id);

        // Get enriched concept with full metadata (if not already loaded above)
        if (!enrichedConcept) {
            enrichedConcept = subjectRegistry.getEnrichedConcept(subjectId, concept.id);
            if (!enrichedConcept) {
                throw new Error(`Enriched concept ${concept.id} not found in subject ${subjectId}`);
            }
        }
        console.log('[TaskService] Enriched concept loaded:', enrichedConcept.id);

        // Create prompt builder with subject, task type, variation loader, base prompt, and variations template
        const promptBuilder = new PromptBuilder(
            subject,
            selectedTaskType,
            this.variationLoader,
            basePrompt,
            variationsTemplate,
            hintPrompt
        );

        // Build the prompt with all parameters
        const params: TaskGenerationParams = {
            subject: subjectId,
            concept: concept.id,
            grade: request.grade,
            difficulty: request.difficulty,
            language,
            taskType: selectedTaskType.id,
            gender: request.gender
        };

        console.log('[TaskService] Building prompt with params:', params);
        const finalPrompt = promptBuilder.buildPrompt(params, enrichedConcept);
        console.log('[TaskService] Prompt built, length:', finalPrompt.length, 'chars');

        // Generate the task using AI with structured output
        console.log('[TaskService] Calling AI client with structured generation...');
        const aiStartTime = Date.now();
        const validatedResponse = await this.aiClient.generateStructured<BaseTaskResponse>(
            finalPrompt,
            selectedTaskType.jsonSchema
        );
        const aiDuration = Date.now() - aiStartTime;
        console.log(`[TaskService] Structured response received in ${aiDuration}ms`);

        // Generate taskId and add to response
        // Note: type is already correctly set in validatedResponse by the schema
        const taskId = uuidv4();
        const responseWithType = {
            ...validatedResponse,
            taskId
        } as TaskResponse;
        console.log('[TaskService] Task ID generated:', taskId);

        // Store context in cache for hint generation
        const taskContext: TaskContext = {
            taskId,
            subject: subjectId,
            concept: concept.id,
            taskType: selectedTaskType.id,
            grade: request.grade,
            difficulty: request.difficulty,
            language,
            generatedTask: responseWithType.task,
            solution: (responseWithType as any).solution || (responseWithType as any).options,
            hintsGenerated: [],
            createdAt: Date.now()
        };
        taskCache.set(taskId, taskContext);
        console.log('[TaskService] Task context stored in cache');

        return responseWithType;
    }

    public async generateHint(taskId: string): Promise<{
        hint: string;
        hintNumber: number;
        totalHintsAvailable: number;
    }> {
        console.log('[TaskService] Generating hint for task:', taskId);

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

        console.log('[TaskService] Hint prompt built, length:', hintPrompt.length);

        // Generate hint using structured output
        const aiStartTime = Date.now();
        const response = await this.aiClient.generateStructured<{ hint: string }>(hintPrompt, hintSchema);
        const aiDuration = Date.now() - aiStartTime;
        console.log(`[TaskService] Hint generated in ${aiDuration}ms`);

        // Store hint in cache
        context.hintsGenerated.push(response.hint);
        taskCache.set(taskId, context);
        console.log('[TaskService] Hint stored in cache, total hints:', context.hintsGenerated.length);

        return {
            hint: response.hint,
            hintNumber,
            totalHintsAvailable: 4
        };
    }
} 
