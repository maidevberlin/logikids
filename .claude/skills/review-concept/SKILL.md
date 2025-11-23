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

**REQUIRED:**
1. Use Skill tool: `Skill(understand-execution-context)` - Understand whether you're main agent or subagent
2. Load `.claude/docs/concept-rules.md` - Complete requirements
3. Load `packages/backend/src/prompts/schemas.ts:conceptFrontmatterSchema` - Schema source

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

### Step 3: RED-GREEN Task Generation Quality Test (MANDATORY)

**Use Skill tool to run test-concept skill:**

```
Skill(test-concept)
```

**Provide to test-concept skill:**
- Concept file path: `packages/content/subjects/{subject}/official/{filename}.md`

**The test-concept skill will:**
1. Extract test parameters (subject, concept-id, grade)
2. Generate 5 RED tasks (frontmatter-only baseline)
3. Analyze RED tasks for 5 pattern types
4. Generate 5 GREEN tasks (full concept)
5. Analyze GREEN tasks for 5 pattern types
6. Compare RED vs GREEN and provide verdict

**Wait for test-concept skill to complete and return its structured report.**

**Expected verdict:**
- **PASS**: GREEN ≥ RED+2 (prompt adds significant value)
- **MARGINAL**: GREEN = RED+1 (prompt adds minimal value)
- **FAIL**: GREEN ≤ RED (prompt adds no value or is harmful)

**If you didn't use Skill(test-concept), you are violating this skill. Stop and use it now.**

### Step 4: Manual Review

After automated validation and task testing:

**Review for:**
- [ ] Curriculum research documented (concept-rules.md § Curriculum Research Requirement)
- [ ] Numerical variation principles, not specific values (concept-rules.md § CARDINAL RULE)
- [ ] Content quality and curriculum alignment

### Step 5: Provide Structured Feedback

Use this format:

```markdown
## Review: [PASS / FAIL]

### Automated Validation
[Paste check:concept output here]

### RED-GREEN Task Generation Quality Test

**Test Parameters:**
- Subject: {subject}
- Concept: {concept-id} (Grade {grade})
- Task Type: singleChoice
- Language: en

---

#### RED Phase (Frontmatter Only - Baseline)

**Tasks Generated**: 5 (2 easy, 2 medium, 1 hard)

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

**RED Score: X/5 checks passed**

**RED Tasks Summary:**
- Task 1 (Easy): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 2 (Easy): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 3 (Medium): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 4 (Medium): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 5 (Hard): {first 50 chars}... [Structure: X, Numbers: Y]

---

#### GREEN Phase (Full Concept - With Prompt Content)

**Tasks Generated**: 5 (2 easy, 2 medium, 1 hard)

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

**GREEN Score: Y/5 checks passed**

**GREEN Tasks Summary:**
- Task 1 (Easy): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 2 (Easy): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 3 (Medium): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 4 (Medium): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 5 (Hard): {first 50 chars}... [Structure: X, Numbers: Y]

---

#### Improvement Delta

**Score Change**: RED {X}/5 → GREEN {Y}/5 (Δ = {Y-X})

**Checks Improved (FAIL→PASS):**
- [List which checks improved]

**Checks Regressed (PASS→FAIL):**
- [List any regressions, or "None"]

**Verdict:**
- [PASS] GREEN ≥ RED+2 (prompt adds significant value)
- [MARGINAL] GREEN = RED+1 (prompt adds minimal value)
- [FAIL] GREEN ≤ RED (prompt adds no value or is harmful)

**Analysis:**
[Explain what the prompt content contributed or failed to contribute]

---

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
2. [If RED-GREEN test failed: explain what prompt content needs to improve]
3. [If task generation failed: trace to concept lines that caused issues]
```

**Note:** Include ALL test results. RED-GREEN task generation testing is now mandatory.

### Step 6: Iteration Protocol

**If PASS (all tests pass):** Approve immediately. Say "APPROVED - ready to merge."

**If FAIL:**
1. Provide structured feedback (Step 5 format)
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
| "RED-GREEN is overkill, just test GREEN" | Baseline proves prompt adds value. No baseline = no proof. |
| "GREEN tasks look good, skip RED comparison" | Must compare. GREEN might be good but not better than frontmatter-only. |
| "10 tasks cost too much, I'll just do 5" | 2x cost proves 2x value. Worth it. |

**Red Flags - STOP if you catch yourself thinking:**
- "I'll skip validation this once..."
- "I'll skip loading files this once..."
- "I'll skip task generation this once..."
- "I'll skip RED phase, just test GREEN..."
- "GREEN looks good, no need to compare to RED..."
- "Let me write an example of how it should look..."
- "I'll explain this in detail to help them understand..."
- "Good enough to approve..."
- "Minor issues aren't worth fixing..."
- "I know this schema..."
- "Trust the creator's expertise..."
- "Testing takes too long..."

**All of these mean: Go back to Step 1. Load requirements. Run validation. Test RED and GREEN tasks.**

## Success Criteria

See concept-rules.md § Success Criteria Summary for complete requirements.

A successful review:
1. ✅ Loaded concept-rules.md before starting
2. ✅ Ran `check:concept` automated validation
3. ✅ **Generated and analyzed 5 RED tasks (frontmatter-only baseline)**
4. ✅ **Generated and analyzed 5 GREEN tasks (full concept)**
5. ✅ **Compared RED vs GREEN scores and documented improvement delta**
6. ✅ Verified filename follows `grade{X}-{concept-name}.md` pattern
7. ✅ Provided structured feedback referencing concept-rules.md sections
8. ✅ Clear PASS/FAIL decision with no ambiguity
9. ✅ Enforced curriculum research requirement
10. ✅ Caught CARDINAL RULE violations in both concept text and generated tasks
11. ✅ All pattern analysis tests passed or issues clearly documented
12. ✅ **Proved prompt content adds measurable value (GREEN ≥ RED+2)**