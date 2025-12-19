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
- State ordering criterion clearly (chronological, by size, by sequence, etc.)

**Explanation**: Explain why this sequence is correct.

## Example

```json
{
  "type": "ordering",
  "title": "string",
  "task": "string (markdown supported)",
  "items": [
    { "id": "b", "content": "string" },
    { "id": "c", "content": "string" },
    { "id": "a", "content": "string" }
  ],
  "correctOrder": ["a", "b", "c"],
  "explanation": "string (required, markdown supported)"
}
```
