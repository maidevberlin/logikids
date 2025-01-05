export const prompt = `
## Task Creation Guidelines for Multiple Choice Questions
Age: {{age}} | Difficulty: {{difficulty}}

1. TASK STRUCTURE
   - Write a clear, focused but creative problem statement.
   - Include ALL necessary information for solving the problem.
   - You can format any text in the task:
      - Use HTML formatting to improve readability and highlighting important information
      - Use SVG images to visualize concepts

2. ANSWER OPTIONS [CRITICAL]
   - Create EXACTLY 4 options
   - Each option must have:
     * text: Clear, concise option text
     * isCorrect: boolean (true/false).
     * explanation: Required for correct option only where isCorrect=true.
   - EXACTLY ONE option must be the correct answer. The other options must be plausible but incorrect.
   - Double check that the correct option has isCorrect=true.
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

3. HINTS STRUCTURE
   - Create 4 progressive hints:
     1. Describe the problem easier and give a starting point
     2. Give a hint which information is important for solving the problem
     3. Guide the student through half of the solution
     4. Guide the student through the complete solution

## Response Template (JSON)
{
  "title": "Clear, descriptive, creative title",
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