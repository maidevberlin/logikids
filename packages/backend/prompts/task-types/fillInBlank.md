---
id: fillInBlank
name: Fill in the Blank
description: Text with 1-3 blanks where students type short answers
---

Create a fill-in-the-blank task with 1-3 blanks.

**CRITICAL**: Write `__BLANK__` literally in fillableText. Include 2-3 accepted answer variations per blank.

**Structure:**

- `task`: Context (NO blanks)
- `fillableText`: Text with `__BLANK__` markers
- `blanks`: Array with id (0, 1, 2...), acceptedAnswers, caseSensitive (usually false)

## Example

```json
{
  "type": "fill_in_blank",
  "title": "Equation Solution",
  "task": "Solve the following equation for x.",
  "fillableText": "If 2x + 5 = 13, then x = __BLANK__.",
  "blanks": [{ "id": 0, "acceptedAnswers": ["4", "4.0"], "caseSensitive": false }],
  "explanation": "Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4."
}
```

## Output Format

```json
{
  "type": "fill_in_blank",
  "title": "string",
  "task": "string (markdown supported)",
  "fillableText": "string with __BLANK__ markers",
  "blanks": [{ "id": number, "acceptedAnswers": ["string"], "caseSensitive": boolean }],
  "explanation": "string (required, markdown supported)"
}
```
