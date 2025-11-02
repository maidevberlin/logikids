---
id: multipleChoice
name: Multiple Choice
description: A task with exactly 4 options where one is correct
---

Create a multiple choice task with a question and 4 answer options where exactly one is correct.

**CRITICAL**:
- One of the generated Options MUST BE CORRECT. Double check and regenerate all options if you find a mistake.
- Randomize the position of the correct answer. Do NOT always put it first. The correct answer should appear in different positions (1st, 2nd, 3rd, or 4th) with equal probability. Avoid any position bias.

## Quality Guidelines

**Options (all 4):**
- Create exactly 4 options total. 
- One correct option with a detailed explanation showing WHY it's correct
- Three plausible but incorrect options (no explanations needed)
- Make incorrect options believable and challenging

**Randomization:**
- SHUFFLE the options array before returning
- The correct answer must NOT always be first
- Vary the position randomly across different tasks
