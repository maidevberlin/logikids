import path from 'path';
import { BaseHintsService } from '../../services/hints/base-hints.service';

export class GeometryHintService extends BaseHintsService {
  protected promptPath = path.join(process.cwd(), 'src', 'geometry', 'hints', 'prompt.yaml');
} 