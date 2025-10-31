import { AIClient } from './ai/base';

export abstract class BaseController {
  protected aiClient: AIClient;

  public constructor(aiClient: AIClient) {
    this.aiClient = aiClient;
  }
} 