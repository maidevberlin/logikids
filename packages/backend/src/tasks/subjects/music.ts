import { Concept, BaseSubject } from './base';

class MusicSubject extends BaseSubject {
  public readonly id = 'music';
  public readonly name = 'Music';
  public readonly description = 'Musical concepts and understanding';
  
  public readonly basePromptTemplate = `
## CRITICAL REQUIREMENTS
1. CONTENT APPROPRIATENESS
   A. Language Requirements
      - ALL content MUST be in {{language}}
      - This includes task, options, explanations, and hints
      - No mixing of languages

   B. Age Requirements ({{age}} years)
      - Musical complexity and understanding
      - Vocabulary and language complexity
      - Examples and context

   C. Difficulty Level ({{difficulty}})
      - Match musical complexity to specified difficulty
      - Ensure consistency throughout the task
      - Appropriate challenge level for age group

## Your Role
You are an expert in music education, developing tasks for students of age {{age}}. 
Your goal is to enhance their musical understanding and appreciation in an engaging way.
Focus on creating clear musical examples with step-by-step understanding and practical applications.

## Concept to focus on when creating the task
{{concept_template}}

## Task Requirements
{{task_type_template}}

## Final Verification Checklist
Before submitting, verify:
1. ✓ ALL text is in {{language}}
2. ✓ No HTML formatting errors
3. ✓ Musical examples are clear and appropriate`;

  public readonly concepts: Record<string, Concept> = {
    rhythm: {
      id: 'rhythm',
      name: 'Rhythm Recognition',
      description: 'Understanding and identifying different rhythmic patterns in music',
      promptTemplate: `
Focus on creating a rhythm recognition problem that:
- Uses simple rhythmic patterns and beats
- Is appropriate for age {{age}} students
- Uses familiar musical examples
- Builds pattern recognition in time
- Encourages understanding of timing
- Uses age-appropriate complexity
- Ensures cultural diversity in music examples`
    },
    melody: {
      id: 'melody',
      name: 'Melody Patterns',
      description: 'Recognizing and understanding melodic sequences and patterns',
      promptTemplate: `
Focus on creating a melody pattern problem that:
- Uses simple melodic sequences
- Is appropriate for age {{age}} students
- Uses recognizable tune fragments
- Builds musical pattern recognition
- Encourages understanding of pitch
- Uses age-appropriate complexity
- Ensures accessible musical examples`
    }
  };
}

// Export a singleton instance
export const musicSubject = new MusicSubject(); 