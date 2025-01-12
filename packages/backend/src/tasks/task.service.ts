import { TaskRequest, TaskGenerationParams } from './types';
import { TaskResponse, BaseTaskType } from './types/base';
import { AIClient } from '../common/ai/base';
import { PromptBuilder } from './utils/promptBuilder';
import { registry as subjectRegistry } from './subjects/registry';
import { registry as taskTypeRegistry } from './types/registry';
import { BaseSubject } from './subjects/base';

export class TaskService {
  constructor(private readonly aiClient: AIClient) {}

  public async generateTask(request: TaskRequest, language: string): Promise<TaskResponse> {
    const { subject: subjectId, concept: requestedConcept, taskType } = request;
    
    // Get the subject
    const subject = subjectRegistry.get(subjectId);
    if (!subject) {
      throw new Error(`Subject ${subjectId} not found`);
    }

    // Handle random concept selection
    const concept = requestedConcept === 'random' 
      ? subject.getRandomConcept()
      : subject.getConcept(requestedConcept);

    if (!concept) {
      throw new Error(`Concept ${requestedConcept} not found in subject ${subjectId}`);
    }

    // Get the task type (either specified or random)
    const selectedTaskType = taskType 
      ? taskTypeRegistry.get(taskType) 
      : taskTypeRegistry.getAll()[Math.floor(Math.random() * taskTypeRegistry.getAll().length)];

    if (!selectedTaskType) {
      throw new Error(`Task type ${taskType} not found`);
    }

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

    const finalPrompt = promptBuilder.buildPrompt(params);

    // Generate the task using AI
    const response = await this.aiClient.generate(finalPrompt);
    if (!response?.response) {
      throw new Error('Failed to generate task: No response from AI');
    }

    // Parse and validate the response
    const parsedResponse = AIClient.extractJSON(response.response);
    if (!parsedResponse) {
      throw new Error('Failed to parse AI response as JSON');
    }

    // Add the type field before validation
    const responseWithType = {
      ...parsedResponse,
      type: selectedTaskType.id
    };

    // Validate the response using the task type's validator
    const isValid = selectedTaskType.validateResponse(responseWithType);
    if (!isValid) {
      throw new Error('Generated task does not match the expected format');
    }

    return responseWithType;
  }
} 