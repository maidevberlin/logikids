export const prompt = `
## Task Creation Guidelines for Multiple Choice Questions
Age: {{age}} | Difficulty: {{difficulty}}

1. TASK STRUCTURE
   - Write a clear, focused problem statement
   - Include ALL necessary information for solving
   - Use simple, age-appropriate language
   - Format in HTML for readability

2. ANSWER OPTIONS [CRITICAL]
   - Create EXACTLY 4 options
   - Each option must have:
     * text: Clear, concise option text
     * isCorrect: boolean (true/false)
     * explanation: Required for correct option only
   - EXACTLY ONE option must be correct
   - The correct option MUST have an explanation
   - Example structure:
     {
       text: "First option",
       isCorrect: false
     },
     {
       text: "Correct option",
       isCorrect: true,
       explanation: "Detailed explanation why this is correct"
     }

3. VALIDATION RULES [MOST CRITICAL]
   - Exactly 4 options total
   - Exactly 1 option marked as correct
   - Correct option MUST have explanation
   - Incorrect options must NOT have explanations
   - All options must have valid text

4. HINTS STRUCTURE
   - Create 4 progressive hints:
     1. General approach/starting point
     2. Key concept to focus on
     3. Major step in solution
     4. Everything except final answer

## Response Template (JSON)
{
  "title": "Clear, descriptive title",
  "task": "Complete task description in HTML",
  "options": [
    {
      "text": "First option",
      "isCorrect": false
    },
    {
      "text": "Second option",
      "isCorrect": false
    },
    {
      "text": "Correct option",
      "isCorrect": true,
      "explanation": "Detailed explanation why this is the correct answer"
    },
    {
      "text": "Fourth option",
      "isCorrect": false
    }
  ],
  "hints": [
    "General approach",
    "Key concept",
    "Major step",
    "Almost complete"
  ]
}`; 