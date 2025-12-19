---
id: multiSelect
name: Multi-Select
description: A task with 5-7 options where 2-4 are correct (select all that apply)
---

Create a multi-select task where students identify ALL correct answers.

**CRITICAL**:

- 5-7 options total, 2-4 correct
- `expectedCount` MUST equal the number of options with `isCorrect: true`
- Spread correct answers throughout (don't cluster at start or end)

## Example

```json
{
  "type": "multi_select",
  "title": "string",
  "task": "string (markdown supported)",
  "options": [
    { "id": 0, "text": "string", "isCorrect": bool },
    { "id": 1, "text": "string", "isCorrect": bool },
    { "id": 2, "text": "string", "isCorrect": bool },
    { "id": 3, "text": "string", "isCorrect": bool },
    { "id": 4, "text": "string", "isCorrect": bool }
  ],
  "expectedCount": number,
  "explanation": "string (required, markdown supported)"
}
```
