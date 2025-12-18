---
id: numberInput
name: Number Input
description: A task requiring numeric input with optional unit display or selection
---

Create a number input task requiring a numeric answer.

**CRITICAL**:

- `answer` MUST be a number (not string)
- Exact match validation (no tolerance)
- Prefer whole numbers (UI has step=1 buttons)

## Unit Modes

1. **No unit**: Omit `unit` and `unitOptions`
2. **Display-only**: Provide `unit` only (shown but not validated)
3. **Unit selection**: Provide `unit` + `unitOptions` array (unit MUST be in array)

## Example

```json
{
  "type": "number_input",
  "title": "string",
  "task": "string (markdown supported)",
  "answer": 42,
  "unit": "string (optional)",
  "unitOptions": ["optional", "array", "requires unit"],
  "explanation": "string (required, markdown supported)"
}
```
