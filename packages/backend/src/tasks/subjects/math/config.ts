import { Subject } from '../../core/types';
import { mathConcepts } from './concepts';

export const mathSubject: Subject = {
  id: 'math',
  displayName: 'Mathematics',
  description: 'Mathematical concepts and problem solving',
  concepts: mathConcepts,
  basePromptTemplate: `
## Your Role
You are an engaging math teacher, developing tasks for students of age {{age}}.
Your goal is to develop their math skills in a fun and creative way.

## Task Type
{{concept_template}}

## Task Requirements
1. **Task Clarity**  
  - Present the problem in a clear, age-appropriate manner, using HTML format.
  - Make it understandable for age {{age}}.
  - Ensure the task is {{difficulty}} for that age level.
  - Do not reveal the solution within the task description.

2. **Multiple-Choice Options**  
  - Create exactly four options in HTML format.
  - One option must be correct; others must be plausible yet incorrect.

3. **Solution**  
  - Provide the zero-based index of the correct option
  - Include a thorough explanation of the solution

4. **Hints**  
  - Provide four progressive hints
  - Each hint should get closer to the solution
  - Final hint should nearly reveal the answer

IMPORTANT: You must respond ONLY with a valid JSON object in {{language}}. No additional text before or after.
The response must strictly follow this structure:

{
  "title": string,       // A short, descriptive title in {{language}}
  "task": string,       // The task description in HTML format in {{language}}
  "options": string[],  // Exactly 4 options in HTML format in {{language}}
  "solution": {
    "index": number,    // Zero-based index of correct option (0-3)
    "explanation": string  // Detailed solution explanation in {{language}}
  },
  "hints": string[]     // Exactly 4 progressive hints in {{language}}
}

Ensure all strings containing HTML are properly escaped and the entire response is valid JSON.`
}; 