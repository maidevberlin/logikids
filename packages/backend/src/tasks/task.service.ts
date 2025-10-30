import {TaskRequest, TaskGenerationParams} from './types';
import {TaskResponse, BaseTaskResponse} from './types';
import {AIClient} from '../common/ai/base';
import {taskTypeRegistry} from './types/registry';
import {v4 as uuidv4} from 'uuid';
import {taskCache, TaskContext} from '../cache/taskCache';
import {subjectRegistry} from '../subjects/registry';
import {PromptService} from '../prompts/prompt.service';

export class TaskService {
    constructor(
        private readonly aiClient: AIClient,
        private readonly promptService: PromptService
    ) {}

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

        // Load concept (or random)
        const concept = requestedConcept === 'random'
            ? subjectRegistry.getRandomEnrichedConcept(subjectId)
            : subjectRegistry.getEnrichedConcept(subjectId, requestedConcept);

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

        // Calculate age from grade (grade + 6: grade 2 = ~8yo, grade 13 = ~19yo)
        const age = request.grade + 6;

        // Build prompt using PromptService
        const finalPrompt = await this.promptService.buildPrompt({
            subject,
            taskType: selectedTaskType,
            concept,
            age,
            grade: request.grade,
            difficulty: request.difficulty,
            language,
            gender: request.gender
        });

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
} 
