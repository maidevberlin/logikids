import { BasePromptBuilder } from '../../core/prompt-builder';
import { logicSubject } from './base';

export class LogicPromptBuilder extends BasePromptBuilder {
  constructor() {
    super(logicSubject);
  }
} 