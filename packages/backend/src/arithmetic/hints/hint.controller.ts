import { TaskResponse } from '../../types/task';
import { HintResponse } from '../../types/hint';
import { ArithmeticHintService } from './hint.service';
import { BaseHintsController } from '../../common/hints/base-hints.controller';

export class ArithmeticHintController extends BaseHintsController {
  protected async generateHintInternal(task: TaskResponse, language?: string): Promise<HintResponse> {
    const arithmeticService = new ArithmeticHintService(this.aiClient);
    return arithmeticService.generateHint(task, language);
  }
} 