import { BasePromptBuilder } from '../../core/prompt-builder';
import { logicSubject } from './config';

export class LogicPromptBuilder extends BasePromptBuilder {
  constructor() {
    super(logicSubject);
  }
} 