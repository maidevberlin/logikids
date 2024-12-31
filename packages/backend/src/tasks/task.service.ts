import { TaskRequest, Task } from './types';
import { AIClient } from '../common/ai/base';
import { subjects, promptBuilders } from './subjects';

export class TaskService {
  constructor(private readonly aiClient: AIClient) {}

  public async generateTask(request: TaskRequest, language: string): Promise<Task> {
    const { subject } = request;
    
    if (!subjects[subject]) {
      throw new Error(`Subject ${subject} not found`);
    }

    const PromptBuilder = promptBuilders[subject];
    const promptBuilder = new PromptBuilder();
    const prompt = promptBuilder.buildPrompt({ 
      age: request.age,
      difficulty: request.difficulty,
      concept: request.concept,
      language 
    });

    const response = await this.aiClient.generate(prompt);
    if (!response?.response) {
      throw new Error('Failed to generate task: No response from AI');
    }

    const parsedResponse = AIClient.extractJSON(response.response);
    if (!parsedResponse) {
      throw new Error('Failed to parse AI response as JSON');
    }

    return parsedResponse as Task;
  }
} 