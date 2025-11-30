---
id: ordering
name: Ordering
description: A task where students arrange 3-5 items in the correct sequence
---

Create an ordering task where students arrange 3-5 items in correct sequence.

**CRITICAL**:

- Generate 3-5 items with unique IDs ("a", "b", "c"...)
- Randomize `items` array order (NOT the correct order)
- `correctOrder` contains IDs in the correct sequence
- State ordering criterion clearly (chronological, smallest-to-largest, etc.)

**Explanation**: Explain why this sequence is correct.

## Example

```json
{
  "type": "ordering",
  "title": "Decimal Numbers",
  "task": "Arrange these decimal numbers from smallest to largest.",
  "items": [
    { "id": "b", "content": "0.75" },
    { "id": "c", "content": "1.2" },
    { "id": "a", "content": "0.03" }
  ],
  "correctOrder": ["a", "b", "c"],
  "explanation": "From smallest to largest: 0.03, 0.75, 1.2. Compare place values left to right."
}
```

## Output Format

```json
{
  "type": "ordering",
  "title": "string",
  "task": "string (markdown supported)",
  "items": [{ "id": "string", "content": "string" }],
  "correctOrder": ["id1", "id2", ...],
  "explanation": "string (required, markdown supported)"
}
```
