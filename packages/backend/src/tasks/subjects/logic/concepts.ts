import { Concept } from '../../core/types';

export const logicConcepts: Record<string, Concept> = {
  patterns: {
    displayName: 'Pattern Recognition',
    description: 'Finding and understanding patterns in logical sequences',
    promptTemplate: `
Your task is to create a pattern recognition problem that focuses on:
- Visual or numerical pattern identification
- Pattern continuation or completion
- Clear sequence of observations
    `
  },
  conditional: {
    displayName: 'If-Then Logic',
    description: 'Understanding cause and effect relationships',
    promptTemplate: `
Your task is to create an if-then logic problem that focuses on:
- Simple cause and effect relationships
- Clear logical connections
- Everyday scenarios and examples
    `
  },
  sorting: {
    displayName: 'Sorting & Grouping',
    description: 'Classifying items based on logical rules',
    promptTemplate: `
Your task is to create a sorting problem that focuses on:
- Clear classification rules
- Logical grouping principles
- Visual or concrete examples
    `
  }
}; 