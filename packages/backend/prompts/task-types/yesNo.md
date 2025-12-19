---
id: yesNo
name: Yes/No
description: A task that can be answered with yes or no
---

Create a yes/no task with a clear boolean answer.

**CRITICAL**: The `answer` field MUST be boolean. Aim for ~50% false answers - don't default to true.

**Explanation**: Explain why the answer is yes/no with clear reasoning.

## Example

```json
{
  "type": "yes_no",
  "title": "string",
  "task": "string (markdown supported)",
  "answer": bool,
  "explanation": "string (required, markdown supported)"
}
```
