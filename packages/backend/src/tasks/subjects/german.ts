import { Concept, BaseSubject } from './base';

class GermanSubject extends BaseSubject {
  public readonly id = 'german';
  public readonly name = 'German';
  public readonly description = 'German language learning and understanding';
  
  public readonly basePromptTemplate = `
## CRITICAL REQUIREMENTS
1. CONTENT APPROPRIATENESS
   A. Language Requirements
      - ALL content MUST be in {{language}}
      - This includes task, options, explanations, and hints
      - No mixing of languages
      - Use clear, age-appropriate German

   B. Age Requirements ({{age}} years)
      - Language complexity appropriate for age
      - Vocabulary level matching age group
      - Examples from age-relevant contexts

   C. Difficulty Level ({{difficulty}})
      - Match language complexity to specified difficulty
      - Ensure consistency throughout the task
      - Appropriate challenge level for age group

## Your Role
You are an expert German language teacher, developing tasks for students of age {{age}}. 
Your goal is to enhance their German language skills in an engaging way.
Focus on creating clear examples with step-by-step learning and practical applications.

## Concept to focus on when creating the task
{{concept_template}}

## Task Requirements
{{task_type_template}}

## Final Verification Checklist
Before submitting, verify:
1. ✓ ALL text is in {{language}}
2. ✓ No HTML formatting errors
3. ✓ JSON structure is valid
4. ✓ German grammar and spelling are correct`;

  public readonly concepts: Record<string, Concept> = {
    parts_of_speech: {
      id: 'parts_of_speech',
      name: 'Parts of Speech',
      description: 'Understanding and identifying different parts of speech in German',
      promptTemplate: `
Focus on creating a parts of speech problem that:
- Uses clear examples of different word types
- Is appropriate for age {{age}} students
- Includes common German words
- Builds understanding of word functions
- Uses age-appropriate vocabulary
- Connects to practical language use
- Helps identify nouns, verbs, adjectives, etc.`
    },
    spelling: {
      id: 'spelling',
      name: 'Spelling',
      description: 'German spelling and orthography',
      promptTemplate: `
Focus on creating a spelling problem that:
- Uses common German spelling rules
- Is appropriate for age {{age}} students
- Includes frequently used words
- Builds spelling awareness
- Uses practical examples
- Helps understand capitalization rules
- Focuses on typical spelling challenges`
    },
    reading_comprehension: {
      id: 'reading_comprehension',
      name: 'Text verstehen',
      description: 'Reading comprehension and text understanding',
      promptTemplate: `
Focus on creating a text comprehension problem that:
- Uses age-appropriate German texts
- Is suitable for age {{age}} students
- Includes engaging content
- Builds reading comprehension skills
- Uses clear and structured texts
- Helps develop understanding strategies
- Connects to real-world contexts`
    }
  };
}

// Export a singleton instance
export const germanSubject = new GermanSubject(); 