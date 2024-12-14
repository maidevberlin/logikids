import { Request } from 'express';
import { AIClient } from './ai/base';

export abstract class BaseController {
  protected aiClient: AIClient;

  public constructor(aiClient: AIClient) {
    this.aiClient = aiClient;
  }

  protected getPreferredLanguage(req: Request): string {
    // Get Accept-Language header and parse the first language
    const acceptLanguage = req.headers['accept-language'];
    if (!acceptLanguage) return 'en'; // Default to English

    // Parse the Accept-Language header and get the first language code
    const firstLanguage = acceptLanguage.split(',')[0].trim().split(';')[0];
    return firstLanguage || 'en';
  }
} 