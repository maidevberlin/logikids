import { prompt as patternsPrompt } from '../../prompts/logic/concepts/patterns';
import { prompt as conditionalPrompt } from '../../prompts/logic/concepts/conditional';
import { prompt as sortingPrompt } from '../../prompts/logic/concepts/sorting';
import { prompt as sequencesPrompt } from '../../prompts/logic/concepts/sequences';
import { prompt as analogicalPrompt } from '../../prompts/logic/concepts/analogical';
import { prompt as deductivePrompt } from '../../prompts/logic/concepts/deductive';
import { Concept, LogicConceptId } from '../types';

export const logicConcepts: Record<LogicConceptId, Concept> = {
  patterns: {
    id: 'patterns',
    name: 'Pattern Recognition',
    description: 'Finding and understanding patterns in logical sequences',
    promptTemplate: patternsPrompt
  },

  conditional: {
    id: 'conditional',
    name: 'Conditional Logic',
    description: 'Understanding cause and effect relationships',
    promptTemplate: conditionalPrompt
  },

  sorting: {
    id: 'sorting',
    name: 'Logical Sorting',
    description: 'Classifying items based on logical rules',
    promptTemplate: sortingPrompt
  },

  sequences: {
    id: 'sequences',
    name: 'Logical Sequences',
    description: 'Learn to identify and complete logical sequences by understanding patterns and rules.',
    promptTemplate: sequencesPrompt
  },

  analogical: {
    id: 'analogical',
    name: 'Analogical Thinking',
    description: 'Understanding relationships between different concepts and applying them to new situations',
    promptTemplate: analogicalPrompt
  },

  deductive: {
    id: 'deductive',
    name: 'Deductive Reasoning',
    description: 'Drawing logical conclusions from given premises using step-by-step reasoning',
    promptTemplate: deductivePrompt
  }
}; 