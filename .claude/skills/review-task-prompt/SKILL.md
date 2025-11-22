---
name: review-task-prompt
description: Analyze full composed prompts for structural issues and test task generation quality - identifies repetition, missing instructions, and validates via real task generation
---

# Review Task Prompt Architecture

## Prerequisites

**REQUIRED READING:** Load `.claude/docs/task-prompt-rules.md` for complete requirements.

This skill provides the REVIEW PROCESS. The rules document provides REQUIREMENTS.

**Load task-prompt-rules.md NOW using Read tool before proceeding.**

**Additional requirements:**
- Concept file exists and passes `check:concept` validation
- Backend is running
- AI provider is configured

## Overview

This skill performs comprehensive review of prompt composition by:
1. **Structural Analysis**: Examining hierarchy, repetition, and proper separation of concerns (see task-prompt-rules.md)
2. **Task Generation Testing**: Validating actual task quality via test-concept skill
3. **Root Cause Tracing**: Identifying which file/level needs changes

**Use this skill when:**
- Creating or refining concept files
- Investigating why tasks have repetitive patterns
- Validating prompt architecture changes
- Debugging learning objective coverage issues

## Note on Task Generation Testing

**IMPORTANT**: This skill performs task generation testing directly via Bash commands rather than spawning the test-concept skill.

**Why?** Claude Code intentionally blocks recursive agent spawning (subagents cannot spawn other subagents). We execute the task generation logic directly using Bash.

## Process

### Step 1: Identify Concept Parameters

Ask user for or extract from context:
- Subject
- Concept ID (from file path or concept frontmatter)
- Grade (from frontmatter)
- Task type to test (default: `singleChoice`)
- Language (default: `en`)

### Step 2: Generate Full Composed Prompt

Run command to get the complete prompt that will be sent to the AI:

```bash
bun run test:prompt --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=easy --language={language}
```

Save output to analyze.

### Step 3: Structural Analysis

Analyze the composed prompt using criteria from task-prompt-rules.md § Quality Criteria.

Run all 4 checks (see task-prompt-rules.md § Validation Process):

**A1. Learning Objective Instructions**
- Check if objectives listed
- Check instruction on HOW to cover them
- Verify instruction at base/subject level (not concept)

**A2. Repetition Detection**
- Search for 50+ word blocks repeated across levels
- Identify common repetitions (numerical variation, structure rotation, etc.)

**A3. Instruction Hierarchy**
- Validate each level contains only appropriate content
- Check for generic/subject instructions misplaced in concept

**A4. Token Efficiency**
- Count words in each section
- Verify concept 400-800 words (max 1,200)
- Check total prompt <4,000 words

**See task-prompt-rules.md for detailed criteria, examples, and pass/fail thresholds.**

### Step 4: Task Generation Quality Testing

**CRITICAL: Generate real tasks to validate actual task quality.**

Generate 5 tasks directly using Bash commands (run in parallel):

```bash
# Generate 5 tasks with varying difficulty
bun run generate:task --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=easy --language={language}
bun run generate:task --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=easy --language={language}
bun run generate:task --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=medium --language={language}
bun run generate:task --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=medium --language={language}
bun run generate:task --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=hard --language={language}
```

**Extract from each task output:**
- Task title and description
- Problem type/structure
- Numbers or patterns used
- Learning objectives targeted

**Analyze the 5 generated tasks for:**
- **Numerical repetition**: Same numbers in 3+ tasks (≥40% = FAIL)
- **Language variety**: Repeated phrases in 2+ tasks (FAIL)
- **Code duplication**: Identical LaTeX/SVG (CARDINAL RULE violation)
- **Problem structure variety**: Count unique problem types (need 4-5 for PASS)
- **Learning objective alignment**: Which objectives tested (need 60-80% coverage)

**Use parallel Bash calls** (5 calls in one message) for efficiency.

### Step 5: Combined Verdict

Combine structural analysis and task generation results using criteria from task-prompt-rules.md § Pass/Fail Criteria.

**See task-prompt-rules.md for complete thresholds (PASS, REFINE, FAIL).**

### Step 6: Structured Feedback Report

Provide detailed report:

```markdown
## Task Prompt Review: [PASS / REFINE / FAIL]

### Concept Metadata
- Subject: {subject}
- Concept: {concept-id} (Grade {grade})
- Version: {version from frontmatter}
- File: {file path}

---

## PART A: Structural Analysis

### A1. Learning Objective Instructions: [PASS / WARNING / FAIL]

**Objectives found in prompt:** {yes/no}
- {list the actual objectives from prompt}

**Instruction on HOW to use objectives:** {yes/no/partial}
- {quote the instruction if found, or "NOT FOUND"}

**Location of instruction:**
- {which section: base-prompt, subject, concept}

**Issue:** {if WARNING or FAIL}
- {describe the problem}

**Recommended fix:**
- {specific action to take}

### A2. Repetition Detection: [PASS / WARNING / FAIL]

**Repeated instruction blocks:**
- {list any 50+ word blocks that appear in multiple levels}

**Example repetition:**
```
{quote the repeated block}
```

**Locations:**
- Found in: {file 1, line X}
- Found in: {file 2, line Y}

**Recommended fix:**
- {which file to remove it from, which to keep it in}

### A3. Instruction Hierarchy: [PASS / WARNING / FAIL]

**Generic instructions in concept:** {yes/no}
- {list any that should be at base level}

**Subject instructions in concept:** {yes/no}
- {list any that should be at subject level}

**Recommended fixes:**
- {specific moves between files}

### A4. Token Efficiency: [PASS / WARNING / FAIL]

**Word counts:**
- Base prompt: {count} words
- Variations: {count} words
- Subject template: {count} words
- Concept: {count} words ← {status: optimal/warning/fail}
- **Total composed prompt**: {count} words

**Efficiency rating:** {optimal/acceptable/verbose}

**Recommended compression:** {if needed}

---

## PART B: Task Generation Quality

{Insert full test-concept results here}

**Key metrics from testing:**
- Learning objective coverage: {X/Y objectives tested}
- Problem structure variety: {X different types}
- Numerical/pattern repetition: {pass/warning/fail}

---

## PART C: Root Cause Analysis

For each FAIL or WARNING, trace to root cause:

### Issue 1: {issue name}

**Symptom:** {what we observed}

**Root cause:** {which file and why}

**Evidence:**
```
{quote from prompt showing the issue}
```

**Fix location:** {file path:line number}

**Recommended change:**
```markdown
{exact text to add/remove/change}
```

### Issue 2: {repeat for each issue}

---

## Final Verdict: [APPROVE / REFINE PROMPT / REFINE CONCEPT]

**If APPROVE:**
"✅ Prompt architecture is clean and generates high-quality varied tasks. Ready for production."

**If REFINE PROMPT:**
"⚠️ Structural issues in prompt composition. Fix architecture first, then re-test."
- Primary issues: {list structural problems}
- Files to modify: {list}

**If REFINE CONCEPT:**
"⚠️ Prompt structure is good but concept needs refinement for task variety."
- Primary issues: {list task generation problems}
- Use edit concept to address issues

---

## Required Actions

**If REFINE PROMPT:**
1. {specific file change with line numbers}
2. {specific file change with line numbers}
3. Re-run review-task-prompt to verify fixes

**If REFINE CONCEPT:**
1. {specific concept changes}
2. Re-run test-concept (not full review) to verify

**If APPROVE:**
- Mark concept as reviewed
- Update version notes if needed
- Move to next concept
```

## Red Flags - Problems with Review Process

If you catch yourself thinking:

- "The prompt looks fine to me" → Run objective checks, don't rely on intuition
- "Task generation passed, structure doesn't matter" → Structure affects ALL concepts, not just this one
- "Small repetition is OK" → 50+ words × 50 concepts = 2500+ wasted tokens
- "I'll skip the test-concept part" → Task generation is MANDATORY part of review
- "This is taking too long" → Proper review saves time across all 53 concepts
- "The instruction could go either place" → Follow hierarchy rules strictly

## Success Criteria

A successful review:

1. ✅ Generated full composed prompt
2. ✅ Ran all 4 structural checks (A1-A4)
3. ✅ Executed test-concept skill (actual task generation)
4. ✅ Combined both analyses in verdict
5. ✅ Traced issues to specific files and line numbers
6. ✅ Provided exact fixes with code snippets
7. ✅ Clear next action (approve, refine prompt, or refine concept)

## Notes

**This skill is different from test-concept:**
- `test-concept`: Validates task generation quality only
- `review-task-prompt`: Validates BOTH prompt structure AND task quality

**This skill is different from review-concept:**
- `review-concept`: Validates schema, CARDINAL RULE, curriculum research
- `review-task-prompt`: Validates prompt composition architecture

**All three skills serve different purposes in the quality pipeline:**
1. `review-concept`: Schema and content validation
2. `review-task-prompt`: Prompt architecture validation ← THIS SKILL
3. `test-concept`: Task generation quality validation (called BY review-task-prompt)
