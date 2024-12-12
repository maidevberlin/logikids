import { TaskResponse } from '../../types/task';
import { BaseVisualizationController, VisualizationResponse } from '../../services/vis/base-vis.controller';
import { ArithmeticVisualizationService } from './vis.service';
import { createAIClient } from '../../services/ai/factory';

export class ArithmeticVisualizationController extends BaseVisualizationController {
  private static visService: ArithmeticVisualizationService;

  static async initializeService() {
    if (!ArithmeticVisualizationController.visService) {
      const aiClient = await createAIClient('image');
      BaseVisualizationController.initialize(aiClient);
      ArithmeticVisualizationController.visService = new ArithmeticVisualizationService(aiClient);
    }
  }

  protected async generateVisualizationInternal(task: TaskResponse): Promise<VisualizationResponse> {
    if (!ArithmeticVisualizationController.visService) {
      await ArithmeticVisualizationController.initializeService();
    }
    return ArithmeticVisualizationController.visService.generateVisualization(task);
  }
} 