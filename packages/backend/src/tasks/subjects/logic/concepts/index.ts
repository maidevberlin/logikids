import { Concept } from '../../../core/types';

export const logicConcepts: Record<string, Concept> = {
  sequential: {
    displayName: 'Sequential Reasoning',
    description: 'Understanding and continuing patterns and sequences in logical progression',
    promptTemplate: `
Your task is to create a sequential reasoning problem that focuses on:
- Pattern recognition and continuation
- Logical progression suitable for age {{age}}
- {{difficulty}} difficulty level
- Clear sequence of steps in reasoning
    `
  },
  categorical: {
    displayName: 'Categorical Logic',
    description: 'Understanding relationships between categories and making logical deductions',
    promptTemplate: `
Your task is to create a categorical logic problem that focuses on:
- Classification and categorization
- Logical relationships between groups
- Age-appropriate {{age}} categories
- {{difficulty}} level deductive reasoning
    `
  },
  conditional: {
    displayName: 'Conditional Logic',
    description: 'Understanding if-then relationships and making logical conclusions',
    promptTemplate: `
Your task is to create a conditional logic problem that focuses on:
- If-then relationships
- Cause and effect reasoning
- Age-appropriate {{age}} scenarios
- {{difficulty}} level logical implications
    `
  },
  deductive: {
    displayName: 'Deductive Reasoning',
    description: 'Drawing specific conclusions from general principles',
    promptTemplate: `
Your task is to create a deductive reasoning problem that focuses on:
- Drawing valid conclusions from given premises
- Step-by-step logical deduction
- Age-appropriate {{age}} scenarios
- {{difficulty}} level reasoning chains
    `
  }
}; 