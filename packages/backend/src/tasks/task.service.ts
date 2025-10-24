import { TaskRequest, TaskGenerationParams } from './types';
import { TaskResponse, BaseTaskType } from './types/base';
import { AIClient } from '../common/ai/base';
import { PromptBuilder } from './utils/promptBuilder';
import { registry as subjectRegistry } from './subjects/registry';
import { registry as taskTypeRegistry } from './types/registry';
import { BaseSubject } from './subjects/base';
import { v4 as uuidv4 } from 'uuid';
import { taskCache, TaskContext } from './taskCache';

export class TaskService {
  constructor(private readonly aiClient: AIClient) {}

  public async generateTask(request: TaskRequest, language: string): Promise<TaskResponse> {
    console.log('[TaskService] Starting task generation');
    console.log('[TaskService] Request:', request);

    const { subject: subjectId, concept: requestedConcept, taskType } = request;

    // Get the subject
    const subject = subjectRegistry.get(subjectId);
    if (!subject) {
      throw new Error(`Subject ${subjectId} not found`);
    }
    console.log('[TaskService] Subject loaded:', subjectId);

    // Handle random concept selection
    const concept = requestedConcept === 'random'
      ? subject.getRandomConcept()
      : subject.getConcept(requestedConcept);

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

    // Create prompt builder with subject and task type
    const promptBuilder = new PromptBuilder(
      subject as BaseSubject,
      selectedTaskType as BaseTaskType
    );

    // Build the prompt with all parameters
    const params: TaskGenerationParams = {
      subject: subjectId,
      concept: concept.id,
      age: request.age,
      difficulty: request.difficulty,
      language,
      taskType: selectedTaskType.id
    };

    console.log('[TaskService] Building prompt with params:', params);
    const finalPrompt = promptBuilder.buildPrompt(params) + '\n\n## CRITICAL: DO NOT GENERATE HINTS\nDo not include the "hints" field in your response. Omit it entirely from the JSON.';
    console.log('[TaskService] Prompt built (no hints), length:', finalPrompt.length, 'chars');

    // Generate the task using AI
    console.log('[TaskService] Calling AI client...');
    const aiStartTime = Date.now();
    const response = await this.aiClient.generate(finalPrompt);
    const aiDuration = Date.now() - aiStartTime;
    console.log(`[TaskService] AI response received in ${aiDuration}ms`);

    if (!response?.response) {
      throw new Error('Failed to generate task: No response from AI');
    }
    console.log('[TaskService] Response length:', response.response.length, 'chars');

    // Parse and validate the response
    console.log('[TaskService] Parsing JSON response...');
    const parsedResponse = AIClient.extractJSON(response.response);
    if (!parsedResponse) {
      console.error('[TaskService] Failed to parse response:', response.response.substring(0, 200));
      throw new Error('Failed to parse AI response as JSON');
    }
    console.log('[TaskService] JSON parsed successfully');

    // Generate taskId and add to response
    const taskId = uuidv4();
    const responseWithType = {
      ...parsedResponse,
      type: selectedTaskType.id,
      taskId
    };

    // Validate the response using the task type's validator
    console.log('[TaskService] Validating response...');
    const isValid = selectedTaskType.validateResponse(responseWithType);
    if (!isValid) {
      console.error('[TaskService] Validation failed for response:', responseWithType);
      throw new Error('Generated task does not match the expected format');
    }
    console.log('[TaskService] Validation passed');

    // Store context in cache for hint generation
    const taskContext: TaskContext = {
      taskId,
      subject: subjectId,
      concept: concept.id,
      taskType: selectedTaskType.id,
      age: request.age,
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

    // Build hint prompt
    const promptBuilder = new PromptBuilder(
      subject as BaseSubject,
      taskType as BaseTaskType
    );

    const hintPrompt = promptBuilder.buildHintPrompt(
      {
        subject: context.subject,
        concept: context.concept,
        taskType: context.taskType,
        age: context.age,
        difficulty: context.difficulty,
        language: context.language,
        task: context.generatedTask,
        solution: context.solution
      },
      hintNumber
    );

    console.log('[TaskService] Hint prompt built, length:', hintPrompt.length);

    // Generate hint
    const aiStartTime = Date.now();
    const response = await this.aiClient.generate(hintPrompt);
    const aiDuration = Date.now() - aiStartTime;
    console.log(`[TaskService] Hint generated in ${aiDuration}ms`);

    if (!response?.response) {
      throw new Error('Failed to generate hint: No response from AI');
    }

    // Parse hint from response
    const parsedResponse = AIClient.extractJSON(response.response);
    const hint = parsedResponse?.hint || response.response;

    // Store hint in cache
    context.hintsGenerated.push(hint);
    taskCache.set(taskId, context);
    console.log('[TaskService] Hint stored in cache, total hints:', context.hintsGenerated.length);

    return {
      hint,
      hintNumber,
      totalHintsAvailable: 4
    };
  }
} 