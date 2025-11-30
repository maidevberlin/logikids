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

## Examples

**No unit:**

```json
{
  "type": "number_input",
  "title": "Multiplication",
  "task": "What is 7 × 6?",
  "answer": 42,
  "explanation": "7 × 6 = 42"
}
```

**Display-only unit:**

```json
{
  "type": "number_input",
  "title": "Rectangle Area",
  "task": "Calculate the area of a 4 cm × 6 cm rectangle.",
  "answer": 24,
  "unit": "cm²",
  "explanation": "Area = 4 × 6 = 24 cm²"
}
```

**Unit selection:**

```json
{
  "type": "number_input",
  "title": "Garden Area",
  "task": "A garden is 8 m long and 5 m wide. Calculate its area and select the unit.",
  "answer": 40,
  "unit": "m²",
  "unitOptions": ["m", "m²", "m³"],
  "explanation": "Area = 8 × 5 = 40. Multiplying lengths gives square units (m²)."
}
```

## Output Format

```json
{
  "type": "number_input",
  "title": "string",
  "task": "string (markdown supported)",
  "answer": number,
  "unit": "string (optional)",
  "unitOptions": ["string"] (optional, requires unit),
  "explanation": "string (required, markdown supported)"
}
```
