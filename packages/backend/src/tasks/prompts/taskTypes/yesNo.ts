export const prompt = `
## Task Creation Guidelines for Yes/No Questions
Age: {{age}} | Difficulty: {{difficulty}}

1. TASK STRUCTURE
   - Write a clear, focused question that can be answered with Yes or No
   - Include ALL necessary information for solving
   - Use simple, age-appropriate language
   - Format in HTML for readability
   - Question should be unambiguous with a clear correct answer

2. SOLUTION STRUCTURE [CRITICAL]
   - Answer must be strictly true or false
   - Provide a detailed explanation of why the answer is correct
   - Include key reasoning points
   - Reference specific details from the question

3. HINTS STRUCTURE
   - Create 4 progressive hints:
     1. General approach/starting point
     2. Key concept to focus on
     3. Major step in reasoning
     4. Everything except final answer

## Response Template (JSON)
{
  "title": "Clear, descriptive title",
  "task": "Complete task description in HTML, ending with a clear yes/no question",
  "solution": {
    "answer": true,  // or false
    "explanation": "Detailed explanation of why the answer is correct"
  },
  "hints": [
    "General approach",
    "Key concept",
    "Major step",
    "Almost complete"
  ]
}`; 