import { TaskRequest,TaskGenerationParams} from './types';
import { Subject,  subjects, SUBJECTS } from './subjects';
import { TaskResponse } from './taskTypes/types';
import { AIClient } from '../common/ai/base';
import { TaskTypeRegistry } from './utils/registry';
import { PromptBuilder } from './utils/promptBuilder';

export class TaskService {
  private readonly registry: TaskTypeRegistry;

  constructor(private readonly aiClient: AIClient) {
    this.registry = TaskTypeRegistry.getInstance();
  }

  private getRandomConcept(subject: keyof typeof SUBJECTS): string {
    const concepts = SUBJECTS[subject].concepts;
    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  public async generateTask(request: TaskRequest, language: string): Promise<TaskResponse> {
    const { subject, concept: requestedConcept, taskType } = request;
    
    // Get the subject
    const subjectData = subjects[subject];
    if (!subjectData) {
      throw new Error(`Subject ${subject} not found`);
    }

    // Handle random concept selection
    const concept = requestedConcept === 'random' 
      ? this.getRandomConcept(subject)
      : requestedConcept;

    // Get the task type (either specified or random)
    const selectedTaskType = taskType 
      ? this.registry.get(taskType) 
      : this.registry.getRandomTaskType();

    if (!selectedTaskType) {
      throw new Error(`Task type ${taskType} not found`);
    }

    // Create prompt builder with subject and task type
    const promptBuilder = new PromptBuilder(
      subjectData as Subject,
      selectedTaskType
    );

    // Build the prompt with all parameters
    const params: TaskGenerationParams = {
      subject,
      concept,
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

    // Validate the response using the task type's validator
    if (!selectedTaskType.validateResponse(parsedResponse)) {
      throw new Error('Generated task does not match the expected format');
    }

    // Add the type field to the response
    return {
      ...parsedResponse,
      type: selectedTaskType.id
    };
  }
} 