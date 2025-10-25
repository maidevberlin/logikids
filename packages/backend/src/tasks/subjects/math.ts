import { Concept, BaseSubject } from './base';

class MathSubject extends BaseSubject {
  public readonly id = 'math';
  public readonly name = 'Math';
  public readonly description = 'Mathematical concepts and problem solving';
  
  public readonly basePromptTemplate = `
## CONTENT APPROPRIATENESS (CRITICAL)
   A. Language Requirements: ALL content (task, options, explanations, and hints) MUST be in "{{language}}".
   B. Age Requirements: The Task must be appropriate for age {{age}}.
   C. Difficulty Level: Match complexity to difficulty level {{difficulty}}.

## Your Role
You are a creative math teacher tasked with developing engaging and age-appropriate math tasks for students aged {{age}}.
Your goal is to enhance their math skills in a fun and educational way.
Focus on creating clear, engaging story contexts with step-by-step mathematical problem-solving and real-world applications.

## Concept to focus on when creating the task
{{concept_template}}

## Task Requirements
{{task_type_template}}

## Final Verification Checklist
Before submitting, verify:
1. ✓ ALL text is in {{language}}
2. ✓ No HTML formatting errors`;

  public readonly concepts: Record<string, Concept> = {
    arithmetic: {
      id: 'arithmetic',
      name: 'Basic Arithmetic',
      description: 'Fundamental operations with numbers including addition, subtraction, multiplication, and division',
      promptTemplate: `
Focus on creating an arithmetic problem that:
- Uses basic operations (addition, subtraction, multiplication, division)
- Is appropriate for age {{age}} students
- Has a clear step-by-step solution path
- Uses real-world examples when possible
- Avoids complex numbers or decimals unless necessary
- Includes visual elements if helpful (e.g., "3 apples + 2 apples")`
    },
    mental_math: {
      id: 'mental_math',
      name: 'Mental Math',
      description: 'Quick calculations and number sense without writing',
      promptTemplate: `
Focus on creating a mental math problem that:
- Can be solved without writing calculations
- Uses number relationships and patterns
- Is appropriate for age {{age}} students
- Involves practical everyday scenarios
- Teaches mental math strategies
- Encourages estimation and rounding when helpful`
    },
    word_problems: {
      id: 'word_problems',
      name: 'Word Problems',
      description: 'Real-world problem solving using mathematical concepts',
      promptTemplate: `
Focus on creating a word problem that:
- Uses a clear, engaging story context
- Is relatable for age {{age}} students
- Has all necessary information provided
- Requires step-by-step problem-solving
- Uses real-world scenarios
- Has numbers that make sense in context`
    },
    fractions: {
      id: 'fractions',
      name: 'Fractions & Decimals',
      description: 'Understanding and working with fractions, decimals, and percentages',
      promptTemplate: `
Focus on creating a fraction/decimal problem that:
- Uses clear visual representations when possible
- Is appropriate for age {{age}} students
- Connects to real-world usage
- Builds understanding of part-whole relationships
- Uses common fractions/decimals
- Includes practical examples (e.g., sharing, measuring)`
    },
    geometry: {
      id: 'geometry',
      name: 'Geometry',
      description: 'Geometric concepts including shapes, angles, and spatial reasoning',
      promptTemplate: `
Focus on creating a geometry problem that:
- Uses clear shape descriptions
- Is appropriate for age {{age}} students
- Involves spatial reasoning
- Uses real-world examples of shapes
- Includes visual thinking
- Connects to practical applications`
    },
    measurement: {
      id: 'measurement',
      name: 'Measurement & Units',
      description: 'Working with different units of measurement and conversions',
      promptTemplate: `
Focus on creating a measurement problem that:
- Uses appropriate units for age {{age}}
- Involves practical measuring scenarios
- Includes unit conversions if appropriate
- Uses real-world contexts
- Connects to everyday experiences
- Emphasizes proper unit usage`
    }
  };
}

// Export a singleton instance
export const mathSubject = new MathSubject(); 