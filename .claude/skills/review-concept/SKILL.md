---
name: review-concept
description: Use when reviewing educational concept files for Logikids - enforces schema validation, CARDINAL RULE compliance, curriculum research verification, and task generation quality testing before approval
---

# Review Educational Concept Files

## Overview

Comprehensive concept review including automated validation, manual quality checks, and task generation testing. References concept-rules.md for all requirements.

**Core principle:** Validate against actual sources, not invented requirements. Test with real AI-generated tasks.

## When to Use

Use when:
- Reviewing concept files before merge/approval
- Part of two-agent creation workflow (one creates, one reviews)
- Checking existing concepts for compliance
- Quality gate before publishing educational content

## Prerequisites

**REQUIRED READING:**
1. `.claude/docs/concept-rules.md` - Complete requirements (LOAD FIRST)
2. `packages/backend/src/prompts/schemas.ts:conceptFrontmatterSchema` - Schema source

This skill provides the REVIEW PROCESS. The rules document provides REQUIREMENTS.

## The Iron Law

```
NO REVIEW WITHOUT:
1. Loading .claude/docs/concept-rules.md
2. Running automated validation
3. Testing task generation quality
```

**Steps 1-3 are ABSOLUTELY MANDATORY. No exceptions.**

Skip them? Delete your review. Start over.

## Review Process

### Step 1: Load Requirements (MANDATORY)

**Use Read tool to load these files NOW:**
- `.claude/docs/concept-rules.md` - Complete requirements
- `packages/backend/src/prompts/schemas.ts:conceptFrontmatterSchema` - Actual schema

**DO NOT review from memory.**

If you didn't use Read tool to load both files, you are violating this skill. Stop and load them now.

### Step 2: Run Automated Validation (MANDATORY)

**Use Bash tool to run automated checker:**
```bash
docker compose exec backend-dev bun run check:concept {subject}/{concept-name}
```

Example:
```bash
docker compose exec backend-dev bun run check:concept math/grade5-fractions
```

This validates schema, filename, CARDINAL RULE, structure count, templates, word count, and translations.

**Include the output in your review.**

If you didn't run this command, you are violating this skill. Stop and run it now.

### Step 3: Test Task Generation Quality (MANDATORY)

**Generate 5 real tasks to test for repetitive patterns:**

Extract from concept frontmatter:
- Subject (from file path)
- Concept ID (from `id` field)
- Grade (from `grade` field)

Run these commands:

```bash
# Task 1: Easy
docker compose exec backend-dev bun run generate:task --subject={subject} --concept={concept-id} --taskType=singleChoice --grade={grade} --difficulty=easy --language=en --output=/tmp/task1.json

# Task 2: Easy
docker compose exec backend-dev bun run generate:task --subject={subject} --concept={concept-id} --taskType=singleChoice --grade={grade} --difficulty=easy --language=en --output=/tmp/task2.json

# Task 3: Medium
docker compose exec backend-dev bun run generate:task --subject={subject} --concept={concept-id} --taskType=singleChoice --grade={grade} --difficulty=medium --language=en --output=/tmp/task3.json

# Task 4: Medium
docker compose exec backend-dev bun run generate:task --subject={subject} --concept={concept-id} --taskType=singleChoice --grade={grade} --difficulty=medium --language=en --output=/tmp/task4.json

# Task 5: Hard
docker compose exec backend-dev bun run generate:task --subject={subject} --concept={concept-id} --taskType=singleChoice --grade={grade} --difficulty=hard --language=en --output=/tmp/task5.json
```

**Read all 5 generated task files** and analyze for patterns (see concept-rules.md § Task Generation Quality Tests):

1. **Numerical Repetition**: Same number in 3+ tasks = FAIL
2. **Language Variety**: Exact phrase (5+ words) in 2+ tasks = FAIL
3. **Code Duplication**: Identical LaTeX/SVG in 2+ tasks = FAIL (CARDINAL RULE violation)
4. **Problem Structure Variety**: Same structure in 3+ tasks = FAIL
5. **Learning Objective Alignment**: Any task not targeting objectives = FAIL

**If you didn't generate and analyze tasks, you are violating this skill. Stop and do it now.**

### Step 4: Manual Review

After automated validation and task testing:

**Review for:**
- [ ] Curriculum research documented (concept-rules.md § Curriculum Research Requirement)
- [ ] Numerical variation principles, not specific values (concept-rules.md § CARDINAL RULE)
- [ ] Content quality and curriculum alignment

### Step 6: Provide Structured Feedback

Use this format:

```markdown
## Review: [PASS / FAIL]

### Automated Validation
[Paste check:concept output here]

### Task Generation Quality Test

**Test Parameters:**
- Subject: {subject}
- Concept: {concept-id} (Grade {grade})
- Tasks Generated: 5 (2 easy, 2 medium, 1 hard)

**Pattern Analysis:**

1. **Numerical Repetition**: [PASS / FAIL]
   - [Details: which numbers repeated, frequency]

2. **Language Variety**: [PASS / FAIL]
   - [Details: repeated phrases found]

3. **Code Duplication**: [PASS / FAIL]
   - [Details: LaTeX/SVG analysis]

4. **Problem Structure Variety**: [PASS / FAIL]
   - [List structures: e.g., "Identification (3), Comparison (1), Application (1)"]

5. **Learning Objective Alignment**: [PASS / FAIL]
   - [Map tasks to objectives]

**Generated Tasks Summary:**
- Task 1 (Easy): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 2 (Easy): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 3 (Medium): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 4 (Medium): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 5 (Hard): {first 50 chars}... [Structure: X, Numbers: Y]

### Manual Review

**Curriculum Research:**
- Status: [PASS / FAIL]
- Evidence: [Found / Missing]
- Fix if needed: [See concept-rules.md § Curriculum Research Requirement]

**Numerical Variation:**
- Status: [PASS / FAIL]
- Issues: [Specific values that should be principles instead]

**Content Quality:**
- Status: [PASS / FAIL]
- Issues: [Specific problems with alignment, clarity, etc.]

### Recommendation
[APPROVE / REFINE CONCEPT / REJECT]

### Required Actions (if any)
1. [Specific action with reference to concept-rules.md]
2. [If task generation failed: trace to concept lines that caused issues]
```

**Note:** Include ALL test results. Task generation testing is now mandatory.

### Step 7: Iteration Protocol

**If PASS (all tests pass):** Approve immediately. Say "APPROVED - ready to merge."

**If FAIL:**
1. Provide structured feedback (Step 6 format)
2. Reference specific concept-rules.md sections
3. If task generation failed: trace issues back to specific concept lines
4. Wait for creator to fix
5. Re-review from Step 2 (full process including task generation)

**Do NOT:**
- Rewrite the concept yourself (no example rewrites)
- Write verbose explanations (point to concept-rules.md instead)
- Provide vague feedback ("add more variety")
- Approve with minor issues ("good enough")
- Skip task generation testing ("takes too long")

## Common Mistakes

### ❌ Schema Hallucination
Inventing requirements like `ageRange`, `camelCase`, `keywords`, `concepts` field.

**Fix:** Always validate against actual schema source, not assumptions.

### ❌ Misunderstanding Concept Purpose
Asking for "detailed educational content" or "2-3 paragraphs explaining fundamentals".

**Fix:** Concepts are CREATIVE PROMPTS, not textbooks. See concept-rules.md § Overview.

### ❌ Template Variable Confusion
Flagging `{{age}}` or `{{difficulty}}` as problems.

**Fix:** These are REQUIRED syntax for age/difficulty scaffolding. See concept-rules.md § Schema Requirements.

### ❌ Skipping Validation
Reviewing without running `check:concept`.

**Fix:** Run validation FIRST, every time. See Iron Law.

### ❌ Skipping Task Generation Testing
Approving without generating real tasks.

**Fix:** Task generation testing is MANDATORY. See Step 3. No exceptions.

### ❌ Vague Feedback
"Needs more variety", "too short", "add more content".

**Fix:** Cite specific concept-rules.md sections (e.g., "Need 5-10 problem structures, currently has 3. See concept-rules.md § Required Variation Dimensions").

### ❌ Providing Verbose Rewrites
Writing example sections like "Here's how the Problem Variations section should look:" followed by 30 lines of rewritten content.

**Fix:** Point to concept-rules.md. Don't write the concept for them. Creator should read the rules and fix it themselves.

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "I know the schema by heart" | Schema changes. Load actual source every time. |
| "Validation is slow, I'll just review manually" | Manual review misses schema errors. Validation is mandatory. |
| "I'll skip loading files, I know the rules" | You're reviewing from memory. Iron Law violated. Load files. |
| "Providing example rewrites helps the creator" | Rewrites burn tokens and encourage dependency. Point to rules instead. |
| "Writing detailed explanations is being helpful" | Verbose feedback is harder to act on. Be concise, cite line numbers. |
| "Close enough, minor issues can be fixed later" | Approve only when fully compliant. No exceptions. |
| "Creator is senior/experienced, trust their work" | Review the work, not the person. Authority doesn't bypass validation. |
| "Time pressure, need to approve quickly" | Broken concepts cost more time debugging. Review thoroughly. |
| "I remember concept-rules" | Rules evolve. Load current version every time. |
| "Word count is just over 800, close enough" | Length limits are strict. Over 800 = needs compression unless truly complex topic. |
| "The extra content adds value" | After 800 words, additional content dilutes focus. Compress or reject. |
| "Task generation testing is optional" | Testing is MANDATORY. No exceptions. |
| "5 tasks aren't enough to judge" | Patterns emerge by task 3. 5 is sufficient. |

**Red Flags - STOP if you catch yourself thinking:**
- "I'll skip validation this once..."
- "I'll skip loading files this once..."
- "I'll skip task generation this once..."
- "Let me write an example of how it should look..."
- "I'll explain this in detail to help them understand..."
- "Good enough to approve..."
- "Minor issues aren't worth fixing..."
- "I know this schema..."
- "Trust the creator's expertise..."
- "Testing takes too long..."

**All of these mean: Go back to Step 1. Load requirements. Run validation. Test tasks.**

## Success Criteria

See concept-rules.md § Success Criteria Summary for complete requirements.

A successful review:
1. ✅ Loaded concept-rules.md before starting
2. ✅ Ran `check:concept` automated validation
3. ✅ Generated and analyzed 5 real tasks for quality patterns
4. ✅ Verified filename follows `grade{X}-{concept-name}.md` pattern
5. ✅ Provided structured feedback referencing concept-rules.md sections
6. ✅ Clear PASS/FAIL decision with no ambiguity
7. ✅ Enforced curriculum research requirement
8. ✅ Caught CARDINAL RULE violations in both concept text and generated tasks
9. ✅ All pattern analysis tests passed or issues clearly documented