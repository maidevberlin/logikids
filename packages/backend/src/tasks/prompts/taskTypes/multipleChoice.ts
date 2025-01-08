export const prompt = `
## TASK STRUCTURE
  A task has this structure:
  {
    "title": "Clear, descriptive, creative title",
    "task": "Complete task description in HTML",
    "options": [
      {
        "text": "Option text",
        "isCorrect": boolean (true/false),
        "explanation": "Explanation for correct option"
      }
    ],
    "hints": ["General approach", "Key concept", "Major step", "Complete Solution"]
  }

## CREATE TASK TITLE AND DESCRIPTION
   - Write a clear, focused but creative problem statement.
   - Use age appropriate language, concepts and scenarios.
   - Include ALL necessary information for solving the problem.
   - Use HTML formatting to improve readability and structure/highlight important information

## CREATE THE SOLUTION OPTION
   - Reason about the correct answer to the given task.
   - Write the result of your reasoning into the "text" option and set "isCorrect"=true.

## CREATE THE INCORRECT OPTIONS AND SHUFFLE
   - Create EXACTLY THREE options with a plausible, but incorrect answer as text, isCorrect=false and no explanation.
   - Shuffle all 4 created options

## CREATE HINTS
   - Create 4 progressive hints that gradually build understanding:
     1. Reframe the problem in simpler terms and highlight the goal (without giving away the solution)
     2. Point out a specific detail or pattern in the problem that's crucial for solving it
     3. Help narrow down the options by explaining why certain approaches wouldn't work
     4. Walk through the logical steps to reach the correct answer (but don't directly state it)

## RESPONSE TEMPLATE (JSON)
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