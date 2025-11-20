---
name: review-concept
description: Use when reviewing educational concept files for Logikids - enforces schema validation, CARDINAL RULE compliance, and curriculum research verification before approval
---

# Review Educational Concept Files

## Overview

Review concept markdown files against generate-concept skill rules. Reference authoritative sources (schema, validation tools) instead of assumptions.

**Core principle:** Validate against actual sources, not invented requirements.

## When to Use

Use when:
- Reviewing concept files before merge/approval
- Part of two-agent creation workflow (one creates, one reviews)
- Checking existing concepts for compliance
- Quality gate before publishing educational content

## Prerequisites

**REQUIRED BACKGROUND:** Read `.claude/skills/generate-concept/SKILL.md` for complete requirements. This skill REFERENCES those rules, doesn't duplicate them.

## The Iron Law

```
NO REVIEW WITHOUT LOADING REQUIREMENTS AND RUNNING VALIDATION FIRST
```

**Steps 1-2 are ABSOLUTELY MANDATORY. No exceptions.**

Skip them? Delete your review. Start over.

## Review Process

### Step 1: Load Requirements (MANDATORY)

**Use Read tool to load these files NOW:**
- `.claude/skills/generate-concept/SKILL.md` - Complete requirements
- `packages/backend/src/prompts/schemas.ts:conceptFrontmatterSchema` - Actual schema

**DO NOT review from memory.**

If you didn't use Read tool to load both files, you are violating this skill. Stop and load them now.

### Step 2: Run Validation (MANDATORY)

**Use Bash tool to run automated checker:**
```bash
docker compose exec backend-dev bun run check:concept {subject}/{concept-name}
```

Example:
```bash
docker compose exec backend-dev bun run check:concept math/grade5-fractions
```

This runs comprehensive validation covering schema, filename, CARDINAL RULE, structure count, templates, and translations.

**Include the output in your review.**

If you didn't run this command, you are violating this skill. Stop and run it now.

### Step 3: Review Validation Output

The `check:concept` command (Step 2) automatically validates:
- ✅ Schema (frontmatter fields and types)
- ✅ Filename pattern (grade{X}-{name}.md)
- ✅ CARDINAL RULE (no code examples - including in problem descriptions)
- ✅ Problem structure count (5-10 required)
- ✅ Template variables ({{age}}, {{difficulty}} - these are CORRECT syntax)
- ✅ Word count (400-800 optimal, max 1,200)
- ✅ Translations (all languages, proper format)

**Your manual review focuses on:**
- [ ] Curriculum research documented (not checked by validator)
- [ ] Numerical variation principles (not specific values)
- [ ] Content quality and alignment with curriculum

### Step 4: Provide Structured Feedback

Use this format:

```markdown
## Review: [PASS / FAIL]

### Automated Validation
[Paste check:concept output here]

### Manual Review

**Curriculum Research:**
- Status: [PASS / FAIL]
- Evidence: [Found / Missing]
- Fix if needed: [Must research official curriculum - see generate-concept step 2]

**Numerical Variation:**
- Status: [PASS / FAIL]
- Issues: [Specific values that should be principles instead]

**Content Quality:**
- Status: [PASS / FAIL]
- Issues: [Specific problems with alignment, clarity, etc.]

### Recommendation
[APPROVE / REQUEST CHANGES / REJECT]

### Required Actions (if any)
1. [Specific action with reference to generate-concept rules]
```

**Note:** Only include issues NOT caught by automated validation. Don't repeat what the validator already reported.

### Step 5: Iteration Protocol

**If PASS:** Approve immediately. Say "APPROVED - ready to merge."

**If FAIL:**
1. Provide structured feedback (Step 4 format)
2. Reference specific generate-concept rules (e.g., "violates CARDINAL RULE, lines 70-87")
3. Wait for creator to fix
4. Re-review from Step 2

**Do NOT:**
- Rewrite the concept yourself (no example rewrites, no "should look like this" sections)
- Write verbose explanations of what's wrong (point to generate-concept lines instead)
- Provide vague feedback ("add more variety", "needs work")
- Approve with minor issues ("good enough")
- Give multiple paragraphs per issue (keep feedback concise)

## Common Mistakes

### ❌ Schema Hallucination
Inventing requirements like `ageRange`, `camelCase`, `keywords`, `concepts` field.

**Fix:** Always validate against actual schema source, not assumptions.

### ❌ Misunderstanding Concept Purpose
Asking for "detailed educational content" or "2-3 paragraphs explaining fundamentals".

**Fix:** Concepts are CREATIVE PROMPTS, not textbooks. See generate-concept lines 16-24.

### ❌ Template Variable Confusion
Flagging `{{age}}` or `{{difficulty}}` as problems.

**Fix:** These are REQUIRED syntax for age/difficulty scaffolding. See generate-concept lines 100-108.

### ❌ Skipping Validation
Reviewing without running `check:concept`.

**Fix:** Run validation FIRST, every time.

### ❌ Vague Feedback
"Needs more variety", "too short", "add more content".

**Fix:** Cite specific rule with line number (e.g., "Need 5-10 problem structures, currently has 3. See generate-concept line 92").

### ❌ Providing Verbose Rewrites
Writing example sections like "Here's how the Problem Variations section should look:" followed by 30 lines of rewritten content.

**Fix:** Point to generate-concept rules. Don't write the concept for them. Creator should read the rules and fix it themselves.

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
| "I remember generate-concept rules" | Skills evolve. Load current version every time. |
| "Word count is just over 800, close enough" | Length limits are strict. Over 800 = needs compression unless truly complex topic. |
| "The extra content adds value" | After 800 words, additional content dilutes focus. Compress or reject. |

**Red Flags - STOP if you catch yourself thinking:**
- "I'll skip validation this once..."
- "I'll skip loading files this once..."
- "Let me write an example of how it should look..."
- "I'll explain this in detail to help them understand..."
- "Good enough to approve..."
- "Minor issues aren't worth fixing..."
- "I know this schema..."
- "Trust the creator's expertise..."

**All of these mean: Go back to Step 1. Load requirements. Run validation.**

## Success Criteria

A successful review:
1. ✅ Ran `check:concept` before providing feedback (includes automated word count check)
2. ✅ Loaded generate-concept skill to check current rules
3. ✅ Verified filename follows `grade{X}-{concept-name}.md` pattern
4. ✅ Provided structured feedback with specific line numbers
5. ✅ Referenced generate-concept rules, not invented requirements
6. ✅ Clear PASS/FAIL decision, not ambiguous "looks good but..."
7. ✅ Enforced curriculum research requirement
8. ✅ Caught CARDINAL RULE violations (example code including in problem descriptions)