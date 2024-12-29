import { AIClient } from './ai/base';
import { PromptService } from './services/prompt.service';
import { AIGenerationError } from './errors';

export abstract class BaseService {
  protected readonly promptService: PromptService;

  constructor(
    protected readonly aiClient: AIClient,
    domainPath: string
  ) {
    this.promptService = new PromptService(domainPath);
  }

  protected async generateFromPrompt<T>(
    promptName: string,
    variables: Record<string, string>,
    createResponse: (response: string) => T
  ): Promise<T> {
    const prompt = await this.promptService.getPrompt(promptName);
    
    const filledPrompt = Object.entries(variables).reduce(
      (result, [key, value]) => 
        result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value),
      prompt.prompt
    );

    const response = await this.aiClient.generate(filledPrompt);
    
    if (!response?.response) {
      throw new AIGenerationError('Failed to generate response');
    }

    return createResponse(response.response);
  }
} 