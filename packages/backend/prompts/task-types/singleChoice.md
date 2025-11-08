---
id: singleChoice
name: Single Choice
description: A task with exactly 4 options where one is correct
---

Create a multiple choice task with a question and 4 answer options where exactly one is correct.

**CRITICAL**:
- One of the generated Options MUST BE CORRECT. Double check and regenerate all options if you find a mistake.
- Randomize the position of the correct answer. Do NOT always put it first. The correct answer should appear in different positions (1st, 2nd, 3rd, or 4th) with equal probability. Avoid any position bias.

## Quality Guidelines

**Options (all 4):**
- Create exactly 4 options total
- One correct option - mark with `isCorrect: true`
- Three plausible but incorrect options - mark with `isCorrect: false`
- Make incorrect options believable and challenging

**Explanation:**
- Explain why the correct answer is correct
- Optionally explain why common wrong answers are incorrect
- Make it educational and thorough
- Reference specific details from the task
- Per-option explanations are still optional for additional context

## Examples

**Good Single Choice Task:**
```json
{
  "type": "single_choice",
  "title": "Photosynthesis",
  "task": "What is the primary gas that plants absorb during photosynthesis?",
  "options": [
    { "text": "Oxygen", "isCorrect": false },
    { "text": "Carbon dioxide", "isCorrect": true },
    { "text": "Nitrogen", "isCorrect": false },
    { "text": "Hydrogen", "isCorrect": false }
  ],
  "explanation": "Plants absorb carbon dioxide (CO₂) from the air during photosynthesis. They use it along with water and sunlight to produce glucose and release oxygen as a byproduct. This process is the opposite of what happens during respiration."
}
```

**Output Format:**
```json
{
  "type": "single_choice",
  "title": "string",
  "task": "string (markdown supported)",
  "options": [
    {
      "text": "string (markdown supported)",
      "isCorrect": boolean,
      "explanation": "string (optional, markdown supported)"
    }
  ],
  "explanation": "string (markdown supported)"
}
```
