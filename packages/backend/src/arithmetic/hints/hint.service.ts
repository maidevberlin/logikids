import path from 'path';
import { BaseHintsService } from '../../common/hints/base-hints.service';

export class ArithmeticHintService extends BaseHintsService {
  protected promptPath = path.join(__dirname, 'prompt.yaml');
} 