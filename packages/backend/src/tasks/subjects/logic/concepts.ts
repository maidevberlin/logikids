import { prompt as patternsPrompt } from '../../prompts/logic/concepts/patterns';
import { prompt as conditionalPrompt } from '../../prompts/logic/concepts/conditional';
import { prompt as sortingPrompt } from '../../prompts/logic/concepts/sorting';
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
  }
}; 