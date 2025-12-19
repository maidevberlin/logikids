---
id: fillInBlank
name: Fill in the Blank
description: Text with 1-3 blanks where students type short answers
---

Create a fill-in-the-blank task with 1-3 blanks.

**CRITICAL**: Write `__BLANK__` literally in fillableText. Include 2-3 accepted answer variations per blank (e.g., "Paris", "paris" or "photosynthesis", "Photosynthesis").

**NEVER** place `__BLANK__` inside LaTeX math expressions like `$\frac{__BLANK__}{8}$`. This breaks rendering. Instead, describe the math context in plain text:

- Bad: `$\frac{__BLANK__}{8}$`
- Good: `The numerator of the fraction is __BLANK__.` or `__BLANK__ ÷ 8 = 6`

**Structure:**

- `task`: Context (NO blanks)
- `fillableText`: Text with `__BLANK__` markers
- `blanks`: Array with id (0, 1, 2...), acceptedAnswers, caseSensitive (usually false)

## Example

```json
{
  "type": "fill_in_blank",
  "title": "string",
  "task": "string (markdown supported)",
  "fillableText": "string with __BLANK__ markers",
  "blanks": [{ "id": 0, "acceptedAnswers": ["answer", "alt"], "caseSensitive": bool }],
  "explanation": "string (required, markdown supported)"
}
```
