---
id: singleChoice
name: Single Choice
description: A task with exactly 4 options where one is correct
---

Create a multiple choice task with 4 options where exactly one is correct.

**CRITICAL**: Randomize correct answer position (1st-4th with equal probability)

**Options**: Exactly 4 total. One correct (`isCorrect: true`), three plausible distractors (`isCorrect: false`).

**Distractors**: Each wrong answer should represent a specific mistake a student might make:

- Common misconception about the topic
- Partially correct reasoning that misses a key detail
- Confusing similar concepts or terms
- Misreading or misinterpreting the question

Avoid random wrong answers that no student would realistically choose.

**Explanation**: Required. Show reasoning/calculation steps for the correct answer.

## Example

```json
{
  "type": "single_choice",
  "title": "string",
  "task": "string (markdown supported)",
  "options": [
    { "text": "string", "isCorrect": bool },
    { "text": "string", "isCorrect": bool },
    { "text": "string", "isCorrect": bool },
    { "text": "string", "isCorrect": bool }
  ],
  "explanation": "string (required, markdown supported)"
}
```
