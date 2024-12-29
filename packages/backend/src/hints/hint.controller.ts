import { Request, Response } from 'express';
import { BaseController } from '../common/baseController';
import { hintParamsSchema } from './types';
import { HintService } from './hint.service';
import { AIClient } from '../common/ai/base';

export class HintController extends BaseController {
  private readonly hintService: HintService;

  constructor(aiClient: AIClient) {
    super(aiClient);
    this.hintService = new HintService(aiClient);
  }

  public async generateHint(req: Request, res: Response): Promise<void> {
    const hintParams = hintParamsSchema.parse(req.body);
    const language = this.getPreferredLanguage(req);
    const hint = await this.hintService.generateHint(hintParams, language);
    res.json(hint);
  }
} 