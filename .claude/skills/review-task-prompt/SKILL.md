---
name: review-task-prompt
description: Analyze full composed prompts for structural issues and test task generation quality - identifies repetition, missing instructions, and validates via real task generation
---

# Review Task Prompt Architecture

## Overview

This skill performs a comprehensive review of the entire prompt composition system by:
1. **Structural Analysis**: Examining the full composed prompt for repetition, missing instructions, and proper hierarchy
2. **Task Generation Testing**: Using the test-concept skill to validate actual task quality
3. **Root Cause Tracing**: Identifying which file/level needs changes to fix issues

**Use this skill when:**
- Creating or refining concept files
- Investigating why tasks have repetitive patterns
- Validating prompt architecture changes
- Debugging learning objective coverage issues

## Prerequisites

- Concept file exists and passes `check:concept` validation
- Backend is running
- AI provider is configured

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

Analyze the composed prompt for these issues:

#### A. Learning Objective Instructions

**Check 1: Are learning objectives listed?**
- Search for the objectives in the prompt
- Should appear in "## Learning objectives" section or similar

**Check 2: Is there instruction on HOW to use them?**
- Look for phrases like:
  - "Rotate through different objectives"
  - "Target ALL objectives"
  - "Ensure variety by including"
  - "Do not focus on only one/two objectives"

**Check 3: Where does the instruction appear?**
- ❌ **BAD**: Only in concept-specific section (repetitive across concepts)
- ✅ **GOOD**: In base-prompt or subject-level template (applies to all concepts)

**Issue Detection:**
- ❌ **FAIL**: Objectives listed but no instruction on coverage
- ⚠️ **WARNING**: Instruction appears in concept (should be at base level)
- ✅ **PASS**: Clear instruction at base/subject level

#### B. Repetition Detection

**Check for repeated instruction blocks between:**
- Base prompt and concept
- Subject template and concept
- Variations template and concept

**Common repetitions to detect:**
- Numerical variation principles (should be at subject level for math)
- Problem structure rotation (should be at base level)
- Language/phrasing variety (should be at variations level)

**Issue Detection:**
- ❌ **FAIL**: 50+ word blocks repeated between levels
- ⚠️ **WARNING**: Similar instructions at multiple levels
- ✅ **PASS**: Each level has distinct, non-overlapping content

#### C. Instruction Hierarchy Check

Validate proper separation of concerns:

**Base Prompt Level** (`base-prompt.md`):
- Generic task creation rules (all subjects)
- Format guidelines (LaTeX, SVG, markdown)
- Task vs solution separation
- Learning objective rotation (GENERIC instruction)

**Variations Level** (`variations.md`):
- Scenario context
- Language style
- Enrichments (character, temporal, etc.)

**Subject Level** (e.g., `math/base.md`):
- Subject-specific content types
- Subject-specific task variation principles
- Numerical variation (for math)

**Task Type Level** (e.g., `singleChoice.md`):
- Task type schema
- Option creation guidelines
- Distractor quality rules

**Concept Level** (e.g., `grade1-patterns-and-structures.md`):
- ONLY concept-specific guidance
- What makes THIS concept unique
- Specific problem types for THIS concept
- Common misconceptions for THIS concept

**Issue Detection:**
- ❌ **FAIL**: Generic instructions at concept level
- ⚠️ **WARNING**: Subject-specific instructions at concept level
- ✅ **PASS**: Clear separation of concerns

#### D. Token Efficiency

Measure prompt sections:

```bash
# Count words in each section
wc -w base-prompt.md
wc -w variations.md
wc -w [subject-base].md
wc -w [concept-file].md
```

**Issue Detection:**
- ❌ **FAIL**: Concept >1200 words (too verbose)
- ⚠️ **WARNING**: Concept >800 words (consider compression)
- ✅ **PASS**: Concept 400-800 words (optimal)

### Step 4: Task Generation Quality Testing

**CRITICAL: Run the test-concept skill to validate actual task quality.**

Use the Task tool to launch test-concept skill with the concept file path:

```
Use Task tool with subagent_type='test-concept' to generate 5 tasks and analyze patterns
```

The test-concept skill will return:
- Numerical repetition analysis
- Language variety check
- Code duplication detection
- Problem structure variety
- Learning objective alignment (this validates if the instructions work!)

**Wait for test-concept to complete before proceeding.**

### Step 5: Combined Verdict

Combine structural analysis and task generation results:

**PASS Criteria:**
- ✅ Structural issues: 0 FAIL, ≤1 WARNING
- ✅ Task generation: PASS from test-concept

**REFINE Criteria:**
- Structural issues: 1-2 FAILs OR 2+ WARNINGs
- OR Task generation: FAIL from test-concept

**FAIL Criteria:**
- Structural issues: 3+ FAILs
- AND Task generation: FAIL with <40% objective coverage

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
