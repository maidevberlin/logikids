import { Subject } from '../../core/types';
import { logicConcepts } from './concepts';

export const logicSubject: Subject = {
  id: 'logic',
  displayName: 'Logic',
  description: 'Logical reasoning and problem solving',
  concepts: logicConcepts,
  basePromptTemplate: `
## Your Role
You are an expert in logic and reasoning, developing tasks for students of age {{age}}.
Your goal is to develop their logical thinking skills in an engaging way.

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
  - Each option should follow logical reasoning.

3. **Solution**  
  - Provide the zero-based index of the correct option
  - Include a thorough explanation of the logical steps to reach the solution

4. **Hints**  
  - Provide four progressive hints
  - Each hint should guide through the logical reasoning process
  - Final hint should nearly reveal the answer

Output must be valid JSON in {{language}} with this structure:
{
  "title": string,
  "task": string,
  "options": string[],
  "solution": {
    "index": number,
    "explanation": string
  },
  "hints": string[]
}`
}; 