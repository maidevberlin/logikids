import { Subject } from '../../core/types';
import { mathConcepts } from './concepts';
import { taskTypes } from './taskTypes';

export const mathSubject: Subject = {
  name: 'math',
  description: 'Mathematical concepts and problem solving',
  concepts: mathConcepts,
  taskTypes: taskTypes,
  basePromptTemplate: `
## CRITICAL REQUIREMENTS
1. CONTENT APPROPRIATENESS
   A. Language Requirements
      - ALL content MUST be in {{language}}
      - This includes task, options, explanations, and hints
      - No mixing of languages
      - Use age-appropriate vocabulary and expressions for age {{age}}

   B. Age Requirements ({{age}} years)
      - Vocabulary and language complexity
      - Mathematical concepts and operations
      - Numbers and quantities used
      - Problem-solving steps required
      - Context and examples

   C. Difficulty Level ({{difficulty}})
      - Match complexity to specified difficulty
      - Ensure consistency throughout the task
      - Appropriate challenge level for age group

2. The task MUST be completely solvable based on the description alone
   - Include ALL necessary information
   - No ambiguous or missing details
   - Every step must be logically followable

3. The solution index MUST be correct
   - Double-check that the correct answer is at the specified index. if not, set the correct index
   - Verify that no other option could be correct
   - Index must be 0-3 (zero-based)
   - Use a checklist to ensure:
     * The solution path leads to the correct option
     * All other options are clearly incorrect
     * The index matches the correct option
   - Example: If the correct answer is 'B', ensure the index is 1 (0-based)
   - Re-evaluate if any doubt remains about the correctness and correct the index if necessary

## Your Role
You are a creative math teacher tasked with developing engaging and age-appropriate math tasks for students aged {{age}}.
Your goal is to enhance their math skills in a fun and educational way.

## Concept to focus on when creating the task
{{concept_template}}

## Task Structure Requirements
1. **Task Description**
   - Ensure the task is appropriate for age {{age}} and of difficulty {{difficulty}}
   - Clearly set up the problem scenario
   - Explicitly list all given information
   - State the question clearly and unambiguously
   - Use HTML format for readability

2. **Multiple-Choice Options**
   - Provide exactly four options in HTML format
   - Ensure only one option is correct
   - Make wrong options plausible yet incorrect
   - Ensure options are complete and self-contained

3. **Solution**
   - Verify the index matches the correct option (0-3)
   - Provide a complete solution path:
     * Start with given information
     * Show each step of reasoning
     * Explain why this leads to the correct answer
     * Explain why other options are incorrect

4. **Progressive Hints**
   - First hint: General approach
   - Second hint: Key information to use
   - Third hint: Key step in the solution
   - Final hint: Almost complete solution

## Response Format
Respond ONLY with this JSON structure:

{
  "title": string,      // Clear, descriptive title
  "task": string,      // Complete task in HTML format
  "options": string[], // Exactly 4 options in HTML format
  "solution": {
    "index": number,   // Correct option index (0-3)
    "explanation": string // Complete solution path
  },
  "hints": string[]    // 4 progressive hints
}

## Final Verification Checklist
Before submitting, verify:
1. ✓ Task contains ALL information needed to solve
2. ✓ Solution index matches the actual correct option
3. ✓ ALL text is in {{language}}
4. ✓ No HTML formatting errors
5. ✓ JSON structure is valid
6. ✓ Difficulty and used language is appropriate for age {{age}}
`
}; 