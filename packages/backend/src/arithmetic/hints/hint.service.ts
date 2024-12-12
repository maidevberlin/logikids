import path from 'path';
import { BaseHintsService } from '../../services/hints/base-hints.service';

export class ArithmeticHintService extends BaseHintsService {
  protected promptPath = path.join(process.cwd(), 'src', 'arithmetic', 'hints', 'prompt.yaml');
} 