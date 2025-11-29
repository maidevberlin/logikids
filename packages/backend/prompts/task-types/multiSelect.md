---
id: multiSelect
name: Multi-Select
description: A task with 5-7 options where 2-4 are correct (select all that apply)
---

Create a multi-select task where students identify ALL correct answers.

**CRITICAL**:
- 5-7 options total, 2-4 correct
- `expectedCount` MUST match actual correct count
- Spread correct answers throughout (don't cluster)

## Example

```json
{
  "type": "multi_select",
  "title": "Prime Numbers",
  "task": "Which of these numbers are prime?",
  "options": [
    { "id": 0, "text": "2", "isCorrect": true },
    { "id": 1, "text": "4", "isCorrect": false },
    { "id": 2, "text": "7", "isCorrect": true },
    { "id": 3, "text": "9", "isCorrect": false },
    { "id": 4, "text": "11", "isCorrect": true }
  ],
  "expectedCount": 3,
  "explanation": "2, 7, and 11 are prime (only divisible by 1 and themselves). 4 = 2×2, 9 = 3×3."
}
```

## Output Format

```json
{
  "type": "multi_select",
  "title": "string",
  "task": "string (markdown supported)",
  "options": [{ "id": number, "text": "string", "isCorrect": boolean }],
  "expectedCount": number,
  "explanation": "string (required, markdown supported)"
}
```
