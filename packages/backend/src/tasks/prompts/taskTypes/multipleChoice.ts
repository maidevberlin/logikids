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

## INSTRUCTIONS FOR TASK CREATION

### CREATE TASK TITLE AND DESCRIPTION
   - Write a clear, focused, but creative problem statement.
   - Use age-appropriate language, concepts, and scenarios.
   - Include ALL necessary information for solving the problem.
   - Use HTML formatting to improve readability and structure/highlight important information.

### CREATE THE SOLUTION OPTION
   - Think through the correct answer logically before creating options.
   - Write the correct answer as an option with "isCorrect" set to 'true' and provide an explanation.

### VALIDATE THE CORRECTNESS
   - Ensure the selected "isCorrect" option aligns with the reasoning and explanation.
   - If the selected correct answer is wrong, do not explain why it's wrong; **correct it immediately and update the response**.

### CREATE THE INCORRECT OPTIONS AND SHUFFLE
   - Create EXACTLY THREE plausible but incorrect answers as text, set "isCorrect" to 'false', and omit explanations.
   - Shuffle all four created options.

### CREATE HINTS
   - Create 4 progressive hints that gradually build understanding:
     1. Reframe the problem in simpler terms and highlight the goal (without giving away the solution).
     2. Point out a specific detail or pattern in the problem that's crucial for solving it.
     3. Help narrow down the options by explaining why certain approaches wouldn't work.
     4. Walk through the logical steps to reach the correct answer (but don't directly state it).

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
}

## ADDITIONAL INSTRUCTION
- If the task generation leads to an incorrect or illogical correct option, **fix the issue and regenerate the options.**
- Ensure no conflicting statements exist between the correct option and its explanation.
- The final response should always be internally consistent.
`;