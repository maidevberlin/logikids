---
id: yesNo
name: Yes/No
description: A task that can be answered with yes or no
---

Create a yes/no task with a clear boolean answer.

**CRITICAL**: Vary answers - generate balanced mix of true/false. The `answer` field MUST be boolean.

**Explanation**: Explain why the answer is yes/no with clear reasoning.

## Example

```json
{
  "type": "yes_no",
  "title": "Prime Numbers",
  "task": "Is 17 a prime number?",
  "answer": true,
  "explanation": "Yes, 17 is prime. It is only divisible by 1 and itself. Checking: 17 ÷ 2, 3, 4... none divide evenly."
}
```

## Output Format

```json
{
  "type": "yes_no",
  "title": "string",
  "task": "string (markdown supported)",
  "answer": boolean,
  "explanation": "string (required, markdown supported)"
}
```
