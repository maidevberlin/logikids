import { BasePromptBuilder } from '../../core/prompt-builder';
import { mathSubject } from './base';

export class MathPromptBuilder extends BasePromptBuilder {
  constructor() {
    super(mathSubject);
  }
  
  // Add any math-specific prompt building logic here if needed
} 