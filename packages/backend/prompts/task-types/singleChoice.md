---
id: singleChoice
name: Single Choice
description: A task with exactly 4 options where one is correct
---

Create a multiple choice task with 4 options where exactly one is correct.

**CRITICAL**: Randomize correct answer position (1st-4th with equal probability).

**Options**: Exactly 4 total. One correct (`isCorrect: true`), three plausible distractors (`isCorrect: false`). Distractors should target common misconceptions or calculation errors.

**Explanation**: Required. Show reasoning/calculation steps for the correct answer.

## Example

```json
{
  "type": "single_choice",
  "title": "Solving Linear Equations",
  "task": "Solve for x: 3x - 7 = 14",
  "options": [
    { "text": "x = 5", "isCorrect": false },
    { "text": "x = 7", "isCorrect": true },
    { "text": "x = 21", "isCorrect": false },
    { "text": "x = 3", "isCorrect": false }
  ],
  "explanation": "Add 7 to both sides: 3x = 21. Divide by 3: x = 7. Verify: 3(7) - 7 = 14 ✓"
}
```

## Output Format

```json
{
  "type": "single_choice",
  "title": "string",
  "task": "string (markdown supported)",
  "options": [{ "text": "string", "isCorrect": boolean }],
  "explanation": "string (required, markdown supported)"
}
```
