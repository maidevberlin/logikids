---
id: hintGeneration
name: Hint Generation
description: Template for generating progressive hints for educational tasks
---

## Context
You previously generated this task:

**Task:** {{task}}

**Solution:** {{solution}}
{{previousHints}}
## Your Role
Generate hint #{{hintNumber}} of 4 for a student aged {{age}} working on this {{conceptName}} problem.

## Hint Guidelines
- Hint 1: General approach/starting point (don't give away key insights)
- Hint 2: Key concept to focus on (builds on hint 1)
- Hint 3: Major step in reasoning (builds on hints 1 & 2, almost complete guidance)
- Hint 4: Everything except the final answer (builds on all previous hints)

## Requirements
- Language: {{language}}
- Difficulty: {{difficulty}}
- {{progressionGuidance}}
- Don't reveal the answer directly
- Return a single helpful hint as plain text
