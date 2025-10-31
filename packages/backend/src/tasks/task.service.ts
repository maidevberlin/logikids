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

    public async generateTask(request: TaskRequest): Promise<TaskResponse> {
        console.log('[TaskService] Starting task generation');
        console.log('[TaskService] Request:', request);

        const {subject: subjectId, concept: requestedConcept, taskType, grade, age, difficulty, language} = request;

        // Get the subject
        const subject = subjectRegistry.get(subjectId);
        if (!subject) {
            throw new Error(`Subject ${subjectId} not found`);
        }
        console.log('[TaskService] Subject loaded:', subjectId);

        // Load concept (random if not specified)
        let concept: any;
        if (!requestedConcept) {
            // Random selection with grade/age filtering
            concept = subjectRegistry.getRandomConcept(subjectId, { grade, age, difficulty });
            if (!concept) {
                throw new Error(`No concepts found for subject ${subjectId} with grade ${grade}, age ${age}, difficulty ${difficulty}`);
            }
            console.log('[TaskService] Random concept selected:', concept.id);
        } else {
            // Get specific concept
            concept = subjectRegistry.getConcept(subjectId, requestedConcept);
            if (!concept) {
                throw new Error(`Concept ${requestedConcept} not found in subject ${subjectId}`);
            }
            console.log('[TaskService] Concept loaded:', concept.id);
        }

        // Get the task type (random if not specified)
        let selectedTaskType;
        if (!taskType) {
            const allTypes = taskTypeRegistry.getAll();
            if (allTypes.length === 0) {
                throw new Error('No task types available');
            }
            selectedTaskType = allTypes[Math.floor(Math.random() * allTypes.length)];
            console.log('[TaskService] Random task type selected:', selectedTaskType.id);
        } else {
            selectedTaskType = taskTypeRegistry.get(taskType);
            if (!selectedTaskType) {
                throw new Error(`Task type ${taskType} not found`);
            }
            console.log('[TaskService] Task type loaded:', selectedTaskType.id);
        }

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
