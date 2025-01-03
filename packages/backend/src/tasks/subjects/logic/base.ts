import { Subject } from '../../core/types';
import { logicConcepts } from './concepts';

export const logicSubject: Subject = {
  id: 'logic',
  displayName: 'Logic',
  description: 'Logical reasoning and problem solving',
  concepts: logicConcepts,
  basePromptTemplate: `
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

2. The task MUST be completely solvable through logical reasoning alone
   - Include ALL necessary information
   - No ambiguous or missing details
   - Every logical step must be clear and followable

3. The solution index MUST be correct
   - Double-check that the correct answer is at the specified index
   - Verify that no other option could be logically correct
   - Index must be 0-3 (zero-based)
   - Use a checklist to ensure:
     * The logical path leads to the correct option
     * All other options are clearly incorrect
     * The index matches the correct option
   - Example: If the correct answer is 'B', ensure the index is 1 (0-based)
   - Re-evaluate if any doubt remains about the correctness

## Your Role
You are an expert in logic and reasoning, developing tasks for students of age {{age}}. Your goal is to enhance their logical thinking skills in an engaging way.

## Task Type
{{concept_template}}

## Task Structure Requirements
1. **Task Description**
   - Clearly set up the logical scenario
   - Explicitly list all given information and rules
   - State the logical question clearly and unambiguously
   - Use HTML format for readability

2. **Multiple-Choice Options**
   - Provide exactly four options in HTML format
   - Ensure only one option is logically correct
   - Make wrong options plausible yet logically incorrect
   - Ensure options are complete and self-contained

3. **Solution**
   - Verify the index matches the correct option (0-3)
   - Provide a complete logical reasoning path:
     * Start with given facts/rules
     * Show each logical deduction step
     * Prove why this leads to the correct answer
     * Explain why other options violate logical rules

4. **Progressive Hints**
   - First hint: Which logical principle to apply
   - Second hint: Key facts/rules to focus on
   - Third hint: Key logical deduction step
   - Final hint: Almost complete logical path

## Response Format
Respond ONLY with this JSON structure:

{
  "title": string,      // Clear, descriptive title
  "task": string,      // Complete task in HTML format
  "options": string[], // Exactly 4 options in HTML format
  "solution": {
    "index": number,   // Correct option index (0-3)
    "explanation": string // Complete logical reasoning path
  },
  "hints": string[]    // 4 progressive hints
}

## Final Verification Checklist
Before submitting, verify:
1. ✓ Task contains ALL information needed for logical deduction
2. ✓ Solution index matches the logically correct option
3. ✓ ALL text is in {{language}}
4. ✓ No HTML formatting errors
5. ✓ JSON structure is valid
6. ✓ Logical complexity is appropriate for age {{age}}`
}; 