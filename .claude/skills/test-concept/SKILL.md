---
name: test-concept
description: Use when testing educational concept files for task generation quality - generates real tasks via AI to detect repetitive patterns, validates variety and creativity before approval
---

# Test Concept Task Generation Quality

## Overview

Generate 5 real tasks using a concept and analyze them for repetitive patterns, insufficient variety, and CARDINAL RULE violations. This skill validates that concept prompts produce high-quality, varied tasks.

**Core principle:** A concept that passes schema validation might still produce boring, repetitive tasks. Only real task generation reveals quality.

## When to Use

Use this skill when:
- Testing new concept files after creation
- Validating concept changes/refinements
- Part of concept generation workflow (mandatory step after draft)
- Investigating why tasks feel repetitive
- Before merging concept changes

**DO NOT use for:**
- Schema validation (use check:concept instead)
- Reviewing frontmatter structure (use review-concept instead)

## Prerequisites

**Before running this skill:**
- Concept file exists and passes `check:concept` validation
- Backend is running (`docker compose up backend-dev`)
- AI provider is configured (check `packages/backend/config.yaml`)

## The Quality Gate

```
NO CONCEPT APPROVAL WITHOUT PASSING TASK GENERATION TEST
```

Schema validation proves structure. Task generation proves quality.

**If concept produces repetitive tasks:** Refine concept and test again.

## Process

### Step 1: Identify Test Parameters

Extract from concept frontmatter:
- Subject (from file path: `subjects/{subject}/official/`)
- Concept ID (from frontmatter `id` field)
- Grade (from frontmatter `grade` field)

Ask user for:
- Task type to test (default: `singleChoice`)
- Language (default: `en`)

### Step 2: Generate 5 Tasks with AI

**CRITICAL:** Generate real tasks using AI, not just prompts.

Run these commands to generate 5 tasks with varying difficulty:

```bash
# Task 1: Easy, Age = grade+6
docker compose exec backend-dev bun run generate:task --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=easy --language={language} --output=/tmp/task1.json

# Task 2: Easy, Age = grade+6
docker compose exec backend-dev bun run generate:task --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=easy --language={language} --output=/tmp/task2.json

# Task 3: Medium, Age = grade+6
docker compose exec backend-dev bun run generate:task --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=medium --language={language} --output=/tmp/task3.json

# Task 4: Medium, Age = grade+6
docker compose exec backend-dev bun run generate:task --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=medium --language={language} --output=/tmp/task4.json

# Task 5: Hard, Age = grade+6
docker compose exec backend-dev bun run generate:task --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=hard --language={language} --output=/tmp/task5.json
```

**If generate:task script doesn't exist:** You'll need to create it or use the backend API directly to generate tasks.

**Expected output:** Each command should produce a JSON file with task data.

### Step 3: Load Generated Tasks and Concept Metadata

Read the concept file to extract:
- `learning_objectives` array from frontmatter
- Full concept content for context

Read all 5 task files:
- `/tmp/task1.json`
- `/tmp/task2.json`
- `/tmp/task3.json`
- `/tmp/task4.json`
- `/tmp/task5.json`

Extract from each task:
- `task` field (what student sees)
- `title` field
- Task-specific data (options, answer, etc.)
- Any LaTeX formulas
- Any SVG diagrams

### Step 4: Analyze for Patterns

Run these automated checks:

#### 1. Numerical Repetition Detection

**Check:** Are the same numbers appearing in 3+ tasks?

**How to detect:**
- Extract all numbers from task descriptions (integers, decimals, fractions)
- Count frequency of each unique number
- **FAIL** if any number appears in 3+ tasks (40% threshold = too repetitive)

**Example FAIL:**
- Task 1: "A pizza is cut into 8 slices..."
- Task 2: "There are 8 apples..."
- Task 3: "8 students share..."
- Task 4: "Divide 8 cookies..."
- → Number "8" appears 4/5 times = FAIL

**Example PASS:**
- Task 1: "6 slices"
- Task 2: "8 apples"
- Task 3: "5 students"
- Task 4: "12 cookies"
- Task 5: "4 pieces"
- → All different = PASS

#### 2. Language/Phrasing Repetition

**Check:** Are the same phrases/sentence structures appearing verbatim in multiple tasks?

**How to detect:**
- Look for repeated phrases (5+ consecutive words)
- **FAIL** if same phrase appears in 2+ tasks
- **WARNING** if very similar sentence structures in 3+ tasks

**Example FAIL:**
- Task 1: "What fraction of the shape is shaded?"
- Task 2: "What fraction of the shape is shaded?"
- Task 3: "What fraction of the circle is shaded?"
- → Exact phrase repeated = FAIL

**Example PASS:**
- Task 1: "What fraction is shaded?"
- Task 2: "Which fraction represents the colored part?"
- Task 3: "Identify the fraction shown"
- Task 4: "What portion is highlighted?"
- → Varied phrasing = PASS

#### 3. Example Code Duplication (CARDINAL RULE)

**Check:** Is LaTeX/SVG code being copied between tasks?

**How to detect:**
- Extract LaTeX formulas (between $ or $$)
- Extract SVG elements (viewBox, paths, structure)
- **FAIL** if identical or near-identical code in 2+ tasks
- This indicates concept violated CARDINAL RULE by providing example code

**Example FAIL:**
- Task 1: `$$\frac{2}{5}$$`
- Task 2: `$$\frac{2}{5}$$`
- Task 3: `$$\frac{3}{5}$$`
- → Same fraction structure, likely copied from concept = FAIL

**Example for SVG:**
- Task 1: `<rect width="100" height="20" x="0" y="0" fill="blue"/>`
- Task 2: `<rect width="100" height="20" x="0" y="40" fill="red"/>`
- → Nearly identical structure = FAIL (concept likely had example)

**Example PASS:**
- Task 1: `$$\frac{2}{5}$$`
- Task 2: `$$\frac{4}{6}$$`
- Task 3: Uses words "two-fifths" instead
- Task 4: Uses diagram, no LaTeX
- → Varied representations = PASS

#### 4. Problem Structure Variety

**Check:** Are tasks using different problem types/structures?

**How to detect:**
- Classify each task by structure:
  - Identification (identify fraction from visual)
  - Comparison (which is bigger)
  - Application (real-world scenario)
  - Ordering (arrange from smallest to largest)
  - Equivalent (find equal fractions)
  - etc.
- **FAIL** if same structure appears in 3+ tasks
- **WARNING** if only 2-3 different structures across all 5 tasks

**Example FAIL:**
- Task 1: "What fraction is shaded?" (identification)
- Task 2: "What fraction is colored?" (identification)
- Task 3: "Identify the fraction shown" (identification)
- Task 4: "Which fraction is represented?" (identification)
- → Same structure 4/5 times = FAIL

**Example PASS:**
- Task 1: Identification from visual
- Task 2: Comparison between two fractions
- Task 3: Real-world application (pizza sharing)
- Task 4: Equivalent fractions
- Task 5: Ordering fractions
- → 5 different structures = PASS

#### 5. Learning Objective Alignment

**Check:** Do generated tasks actually target the learning objectives defined in the concept frontmatter?

**How to detect:**
- Extract `learning_objectives` array from concept frontmatter
- For each task, analyze what skill/knowledge it requires to solve
- Map each task to one or more learning objectives it addresses
- **FAIL** if any task doesn't clearly target at least one objective
- **WARNING** if some objectives are never tested across all 5 tasks

**Example FAIL:**

Concept has objectives:
- "Understand fractions as parts of a whole"
- "Compare fractions with same denominators"
- "Recognize equivalent fractions"

Generated tasks:
- Task 1: Identify fraction from visual (targets objective 1) ✓
- Task 2: Order fractions with same denominator (targets objective 2) ✓
- Task 3: Add two fractions (targets NOTHING - addition not in objectives) ✗
- Task 4: Identify fraction from visual (targets objective 1) ✓
- Task 5: Convert fraction to decimal (targets NOTHING - decimals not in objectives) ✗

→ 2/5 tasks don't target any learning objective = FAIL

**Example WARNING:**

Concept has objectives:
- "Understand fractions as parts of a whole"
- "Compare fractions with same denominators"
- "Recognize equivalent fractions"

Generated tasks:
- Task 1: Identify fraction (objective 1) ✓
- Task 2: Identify fraction (objective 1) ✓
- Task 3: Compare fractions (objective 2) ✓
- Task 4: Identify fraction (objective 1) ✓
- Task 5: Compare fractions (objective 2) ✓

→ All tasks target objectives, but objective 3 (equivalent fractions) is never tested = WARNING

**Example PASS:**

Concept has objectives:
- "Understand fractions as parts of a whole"
- "Compare fractions with same denominators"
- "Recognize equivalent fractions"

Generated tasks:
- Task 1: Identify fraction from visual (objective 1) ✓
- Task 2: Compare two fractions (objective 2) ✓
- Task 3: Find equivalent fraction visually (objective 3) ✓
- Task 4: Identify fraction from set (objective 1) ✓
- Task 5: Order fractions (objective 2) ✓

→ All tasks target objectives, all objectives covered = PASS

### Step 5: Generate Verdict

Based on analysis results:

**PASS:** All checks pass or only minor warnings
**FAIL:** Any check fails or multiple warnings

### Step 6: Provide Structured Feedback

Use this format:

```markdown
## Task Generation Test: [PASS / FAIL]

### Test Parameters
- Subject: {subject}
- Concept: {concept-id} (Grade {grade})
- Task Type: {taskType}
- Language: {language}
- Tasks Generated: 5 (2 easy, 2 medium, 1 hard)

### Generated Tasks Summary

**Task 1 (Easy):**
Title: {title}
Task: {first 100 chars of task}...
Key elements: {numbers used, context, structure type}

**Task 2 (Easy):**
Title: {title}
Task: {first 100 chars}...
Key elements: {numbers, context, structure}

**Task 3 (Medium):**
Title: {title}
Task: {first 100 chars}...
Key elements: {numbers, context, structure}

**Task 4 (Medium):**
Title: {title}
Task: {first 100 chars}...
Key elements: {numbers, context, structure}

**Task 5 (Hard):**
Title: {title}
Task: {first 100 chars}...
Key elements: {numbers, context, structure}

### Pattern Analysis Results

**1. Numerical Repetition:** [PASS / WARNING / FAIL]
- {Details: which numbers repeated, how many times}
- {If FAIL: "Number X appears in Y/5 tasks"}

**2. Language Variety:** [PASS / WARNING / FAIL]
- {Details: repeated phrases found}
- {If FAIL: "Phrase 'X' appears in Y tasks"}

**3. Code Duplication:** [PASS / FAIL]
- {Details: LaTeX/SVG analysis}
- {If FAIL: "Example code copied between tasks - CARDINAL RULE violation"}

**4. Problem Structure Variety:** [PASS / WARNING / FAIL]
- {List structures found: "Identification (3), Comparison (1), Application (1)"}
- {If FAIL: "Only X unique structures, need 4-5 minimum"}

**5. Learning Objective Alignment:** [PASS / WARNING / FAIL]
- {Map each task to objectives it targets}
- {If FAIL: "Task X doesn't target any learning objective"}
- {If WARNING: "Objective Y never tested across all tasks"}

### Root Cause Analysis

{For each FAIL, trace back to likely cause in concept:}

**Issue:** {specific problem found}
**Likely Cause:** {reference to concept lines that caused this}
**Example from concept:** {quote the problematic section}
**Recommended Fix:** {how to improve the concept}

### Verdict: [APPROVE / REFINE CONCEPT / REJECT]

**If APPROVE:**
"✅ Concept generates high-quality, varied tasks. Ready for next step."

**If REFINE CONCEPT:**
"⚠️ Concept needs refinement to improve variety. Address issues above and re-test."

**If REJECT:**
"❌ Concept produces severely repetitive tasks. Major revision needed."

### Required Actions (if not APPROVE)

1. {Specific change to concept with line numbers}
2. {Specific change with line numbers}
3. Re-run test-concept skill to verify improvements
```

## Common Issues and Fixes

| Issue Found | Likely Cause in Concept | Fix |
|-------------|-------------------------|-----|
| Same numbers in 3+ tasks | Concept includes example values | Remove specific numbers, describe variation principles only |
| Identical phrases in tasks | Concept uses formulaic language | Show variety in phrasing, not templates |
| Code duplication | CARDINAL RULE violated - example code in concept | Remove ALL example LaTeX/SVG, describe what to create |
| Only 2-3 structures | Concept doesn't specify enough problem types | List 7-10 distinct problem structures |
| Tasks don't target objectives | Concept prompt diverges from stated objectives | Align problem structures with learning objectives OR refine objectives to match concept scope |
| All tasks feel similar | Concept is too prescriptive/narrow | Broaden guidance, emphasize creativity |

## Iteration Protocol

**First test FAILS:**
1. Identify root causes in concept
2. Recommend specific fixes with line numbers
3. Wait for creator to revise concept
4. **Re-run test-concept** from Step 2
5. Compare new results to previous run
6. Continue until PASS

**Second test still FAILS:**
- If same issues: Concept needs major revision, not minor tweaks
- If different issues: Progress made, but more work needed
- If worse: Revisions went wrong direction, revert and try different approach

**Third+ test FAILS:**
- Consider if concept is too narrow/specific for variety
- May need to rethink topic scope or split into multiple concepts
- Consult with user on whether concept is viable

## Red Flags - Problems with Testing Process

If you catch yourself thinking:

- "5 tasks aren't enough to judge" → Wrong. Patterns emerge by task 3.
- "These tasks look fine to me" → Your judgment is subjective. Use automated checks.
- "The repetition isn't that bad" → 3/5 = 60% repetition = very bad.
- "Example code is needed for this topic" → Never. Describe, don't demonstrate.
- "I'll approve with minor issues" → No. Fix first, then approve.
- "Testing is too slow, skip it" → Testing is mandatory. No exceptions.
- "Concept is good, tasks are just unlucky" → Run test again. If still fails, concept is the problem.

**All of these mean: Stop. Follow the process. Use objective criteria.**

## Success Criteria

A successful test:

1. ✅ Generated 5 real tasks via AI
2. ✅ Ran all 5 automated checks
3. ✅ Provided objective verdict (not subjective opinion)
4. ✅ If FAIL: Traced issues to specific concept lines
5. ✅ If FAIL: Recommended concrete fixes
6. ✅ Clear next action (approve or refine)

## Important Notes

**This skill tests task generation, not concept structure:**
- Schema validation: `check:concept` script
- Frontmatter review: `review-concept` skill
- Task generation quality: **this skill** (test-concept)

**Real AI generation is required:**
- Don't just look at prompts
- Don't simulate what tasks "would" look like
- Generate actual tasks with actual AI
- Cost is acceptable (5 tasks × 1 concept = minimal)

**Pattern detection must be objective:**
- Use frequency thresholds (3/5 = 60% = FAIL)
- Don't rely on "seems repetitive" gut feeling
- Count actual occurrences
- Show evidence in feedback

**Iteration is expected:**
- First test often fails
- Refinement is normal
- Keep testing until pass
- Track improvements between runs
