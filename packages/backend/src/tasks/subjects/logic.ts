import { Concept, BaseSubject } from './base';

class LogicSubject extends BaseSubject {
  public readonly id = 'logic';
  public readonly name = 'Logic';
  public readonly description = 'Logical thinking and problem solving';
  
  public readonly basePromptTemplate = `
## CRITICAL REQUIREMENTS
1. CONTENT APPROPRIATENESS
   A. Language Requirements
      - ALL content MUST be in {{language}}
      - This includes task, options, explanations, and hints
      - No mixing of languages

   B. Age Requirements ({{age}} years)
      - Logical complexity and reasoning
      - Vocabulary and language complexity
      - Context and examples

   C. Difficulty Level ({{difficulty}})
      - Match logical complexity to specified difficulty
      - Ensure consistency throughout the task
      - Appropriate challenge level for age group

## Your Role
You are an expert in logic and reasoning, developing tasks for students of age {{age}}. 
Your goal is to enhance their logical thinking skills in an engaging way.
Focus on creating clear scenarios with step-by-step logical deduction and real-world applications of logic.

## Concept to focus on when creating the task
{{concept_template}}

## Task Requirements
{{task_type_template}}

## Final Verification Checklist
Before submitting, verify:
1. ✓ ALL text is in {{language}}
2. ✓ No HTML formatting errors`;

  public readonly concepts: Record<string, Concept> = {
    patterns: {
      id: 'patterns',
      name: 'Pattern Recognition',
      description: 'Finding and understanding patterns in logical sequences',
      promptTemplate: `
Focus on creating a pattern recognition problem that:
- Uses clear, visual patterns when possible
- Is appropriate for age {{age}} students
- Has a logical sequence or progression
- Builds pattern recognition skills
- Uses age-appropriate complexity
- Can be solved through careful observation
- Encourages systematic thinking`
    },
    conditional: {
      id: 'conditional',
      name: 'Conditional Logic',
      description: 'Understanding cause and effect relationships',
      promptTemplate: `
Focus on creating a conditional logic problem that:
- Uses clear if-then relationships
- Is appropriate for age {{age}} students
- Uses real-world scenarios
- Has unambiguous conditions
- Builds logical reasoning skills
- Encourages step-by-step thinking
- Uses familiar situations`
    },
    sorting: {
      id: 'sorting',
      name: 'Logical Sorting',
      description: 'Classifying items based on logical rules',
      promptTemplate: `
Focus on creating a sorting problem that:
- Has clear classification rules
- Is appropriate for age {{age}} students
- Uses familiar categories
- Builds categorization skills
- Encourages systematic thinking
- Uses concrete examples
- Can be solved through logical grouping`
    },
    sequences: {
      id: 'sequences',
      name: 'Logical Sequences',
      description: 'Understanding and completing logical sequences',
      promptTemplate: `
Focus on creating a logical sequence problem that:
- Uses clear, discoverable patterns
- Is appropriate for age {{age}} students
- Uses numbers, letters, or shapes
- Builds sequential thinking skills
- Has logical progression rules
- Uses age-appropriate complexity
- Encourages systematic observation`
    },
    analogical: {
      id: 'analogical',
      name: 'Analogical Thinking',
      description: 'Understanding relationships between different concepts',
      promptTemplate: `
Focus on creating an analogical thinking problem that:
- Uses relationships between different concepts
- Is appropriate for age {{age}} students
- Uses clear, familiar examples for comparisons
- Builds relationship recognition skills
- Encourages systematic thinking
- Uses age-appropriate complexity
- Ensures cultural appropriateness`
    },
    deductive: {
      id: 'deductive',
      name: 'Deductive Reasoning',
      description: 'Drawing logical conclusions from given premises',
      promptTemplate: `
Focus on creating a deductive reasoning problem that:
- Uses clear premises to reach logical conclusions
- Is appropriate for age {{age}} students
- Uses familiar scenarios and examples
- Builds step-by-step reasoning skills
- Encourages methodical thinking
- Uses age-appropriate complexity
- Ensures valid logical connections`
    }
  };
}

// Export a singleton instance
export const logicSubject = new LogicSubject(); 