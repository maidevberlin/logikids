import { TaskResponse } from '../../types/task';
import { HintResponse } from '../../types/hints';
import { BaseHintsController } from '../../services/hints/base-hints.controller';
import { GeometryHintService } from '../services/hint.service';
import { createAIClient } from '../../services/config';

export class GeometryHintController extends BaseHintsController {
  private static hintsService: GeometryHintService;

  static async initializeService() {
    if (!GeometryHintController.hintsService) {
      const aiClient = await createAIClient();
      super.initialize(aiClient);
      GeometryHintController.hintsService = new GeometryHintService(aiClient);
    }
  }

  protected async generateHintInternal(task: TaskResponse): Promise<HintResponse> {
    if (!GeometryHintController.hintsService) {
      await GeometryHintController.initializeService();
    }
    return GeometryHintController.hintsService.generateHint(task);
  }
} 