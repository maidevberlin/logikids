import { TaskResponse } from '../../types/task';
import { HintResponse } from '../../types/hint';
import { BaseHintsController } from '../../services/hints/base-hints.controller';
import { ArithmeticHintService } from './hint.service';
import { createAIClient } from '../../services/config';

export class ArithmeticHintController extends BaseHintsController {
  private static hintsService: ArithmeticHintService;

  static async initializeService() {
    if (!ArithmeticHintController.hintsService) {
      const aiClient = await createAIClient();
      super.initialize(aiClient);
      ArithmeticHintController.hintsService = new ArithmeticHintService(aiClient);
    }
  }

  protected async generateHintInternal(task: TaskResponse, language?: string): Promise<HintResponse> {
    if (!ArithmeticHintController.hintsService) {
      await ArithmeticHintController.initializeService();
    }
    return ArithmeticHintController.hintsService.generateHint(task, language);
  }
} 