---
id: multiSelect
name: Multi-Select
description: A task with 5-7 options where 2-4 are correct (select all that apply)
---

Create a multi-select task where students must identify ALL correct answers from a list of options.

**CRITICAL**:
- Generate exactly 2-4 correct answers from a total of 5-7 options
- At least ONE option MUST BE CORRECT. Double check and regenerate all options if you find a mistake.
- The `expectedCount` field MUST match the actual number of correct answers
- Randomize the position of correct answers. Do NOT cluster them together. Spread correct answers throughout the options with equal probability.
- Ensure all correct options are marked with `isCorrect: true` and all incorrect options with `isCorrect: false`

## Quality Guidelines

**Task Text:**
- Clearly state what to look for: "Which of these...", "Select all...", "Identify all..."
- Provide all necessary context for solving
- Make the criteria unambiguous

**Options (5-7 total):**
- Generate 5-7 options total (not too few, not overwhelming)
- Mark 2-4 options as correct (`isCorrect: true`)
- Remaining options incorrect (`isCorrect: false`)
- Make incorrect options plausible and challenging
- All options should be distinct and unambiguous
- Balance difficulty - not all obvious, not impossible

**Expected Count:**
- Set `expectedCount` to the exact number of correct answers
- This helps students know how many to select
- The frontend will display: "Select {expectedCount} correct answers"

**Explanation:**
- Explain why each correct answer is correct
- Optionally explain why common wrong answers are incorrect
- Make it educational and thorough
- Reference specific details from the task

## Examples

**Good Multi-Select Task:**
```json
{
  "type": "multi_select",
  "title": "Prime Numbers",
  "task": "Which of these numbers are prime? (Prime numbers are only divisible by 1 and themselves)",
  "options": [
    { "id": 0, "text": "2", "isCorrect": true },
    { "id": 1, "text": "4", "isCorrect": false },
    { "id": 2, "text": "7", "isCorrect": true },
    { "id": 3, "text": "9", "isCorrect": false },
    { "id": 4, "text": "11", "isCorrect": true }
  ],
  "expectedCount": 3,
  "explanation": "The prime numbers are 2, 7, and 11. A prime number is only divisible by 1 and itself. 4 is divisible by 2, and 9 is divisible by 3, so they are not prime."
}
```

**Output Format:**
```json
{
  "type": "multi_select",
  "title": "string",
  "task": "string (markdown supported)",
  "options": [
    {
      "id": 0,
      "text": "string (markdown supported)",
      "isCorrect": boolean
    }
  ],
  "expectedCount": number,
  "explanation": "string (markdown supported)"
}
```
