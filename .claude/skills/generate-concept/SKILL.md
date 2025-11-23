---
name: generate-concept
description: Use when creating educational concept files or when LLM-generated tasks show repetitive patterns/copy-paste behavior - ensures curriculum-aligned frontmatter schema, prevents example code duplication through variation principles across all subjects and curricula
---

# Generate Educational Concept Files

## When to Use

Use when:
- Creating new concept files for any subject
- Converting curriculum requirements into Logikids concept format
- Ensuring generated concepts pass backend validation
- Maximizing task variety and creativity

## Prerequisites

**REQUIRED:**
1. Use Skill tool: `Skill(understand-execution-context)` - Understand whether you're main agent or subagent
2. Load `.claude/docs/concept-rules.md` - Complete concept requirements

This skill provides the PROCESS for creating concepts. The rules document provides REQUIREMENTS.

## Process

### 1. Interview User

Ask for:
- Subject
- Specific topic
- Target grade
- **Country/State** (for curriculum alignment)

### 2. Research Official Curriculum (MANDATORY)

- Use WebSearch: `"[country/state] [subject] curriculum [grade]"`
- Find official education ministry/board documents
- Extract: learning objectives, age range, difficulty, standards
- **If not found:** Ask user for alternative location or source

### 3. Extract Metadata

From curriculum research:
- Age range (from grade + education system)
- Difficulty level
- Curriculum standards
- Learning objectives
- Prerequisites

### 4. Create Frontmatter

- Use strict YAML format (see concept-rules.md § Schema Requirements)
- Populate with curriculum-aligned data
- Ensure all required fields present

### 5. Create Frontmatter-Only Draft

**First, create minimal concept with ONLY frontmatter:**
- Complete frontmatter with all required fields
- NO prompt content section yet
- This will be our RED baseline

### 6. Run RED-GREEN Test on Frontmatter-Only (MANDATORY)

**Save frontmatter-only version:**
- Save to `packages/content/subjects/{subject}/official/grade{X}-{id}.md`
- This frontmatter-only version becomes the baseline

**Use Skill tool to run partial test-concept (RED phase only):**

Since full test-concept runs both RED and GREEN, but we only have frontmatter so far, manually run RED phase:

1. Extract parameters from frontmatter (subject, concept-id, grade)
2. Generate 5 RED tasks using frontmatter-only concept
3. Analyze RED tasks for 5 pattern types
4. Record RED score (X/5 checks passed)
5. **Identify RED weaknesses** - this tells you what your prompt content needs to fix

**RED weaknesses guide your prompt:**
- If "Numerical Repetition" failed → emphasize varied number selection
- If "Structure Variety" failed → specify 7-10 different problem structures
- If "Code Duplication" failed → check frontmatter doesn't have example code
- If "Learning Objective Alignment" failed → refine learning objectives or frontmatter description

### 7. Write Creative Prompt Addressing RED Weaknesses

**Now write prompt content to fix RED weaknesses:**

- Apply concept-rules.md § CARDINAL RULE (describe, don't demonstrate)
- Specify 7-10 problem structures if Structure Variety failed
- Emphasize numerical variation if Numerical Repetition failed
- Include age/difficulty scaffolding templates
- Target 400-800 words (see concept-rules.md § Length Requirements)
- Align with curriculum objectives
- **Focus on fixing whatever failed in RED phase**

### 8. Run Full RED-GREEN Test to Prove Improvement (MANDATORY)

**Use Skill tool to run test-concept skill:**

```
Skill(test-concept)
```

**Provide to test-concept:**
- Concept file path: `packages/content/subjects/{subject}/official/grade{X}-{id}.md`

**The test-concept skill will:**
1. Generate 5 RED tasks (frontmatter-only baseline)
2. Analyze RED tasks
3. Generate 5 GREEN tasks (full concept with prompt)
4. Analyze GREEN tasks
5. Compare and provide verdict

**Expected verdict:**
- **PASS**: GREEN ≥ RED+2 (prompt adds significant value, proceed to step 9)
- **MARGINAL**: GREEN = RED+1 (prompt adds minimal value, return to step 7 and strengthen)
- **FAIL**: GREEN ≤ RED (prompt adds no value or is harmful, return to step 7 and rewrite)

**If MARGINAL or FAIL:** Return to step 7, revise prompt content based on test-concept feedback, re-run step 8. Iterate until PASS.

### 9. Save and Validate Schema (MANDATORY)

**Run automated validation:**
```bash
docker compose exec backend-dev bun run check:concept {subject}/{concept-name}
```

Fix any schema issues reported before proceeding.

### 10. Compress for Efficiency

After validation passes:
- Check word count: `wc -w filename.md`
- If >800 words: compress using concept-rules.md § Length Requirements techniques
- Target 400-800 words
- Re-run validation after compression

### 11. Add Translations

- See concept-rules.md § Translation Requirements for format
- List languages: `packages/frontend/public/locales/*/subjects/`
- Add to ALL language files: `packages/frontend/public/locales/*/subjects/{subject}.json`
- Alphabetically sort concept keys

### 12. Submit for Review

- Next step: review-concept skill needs to review the file at [path]
- Review will include automated validation + task generation testing
- **If FAIL:** Fix issues and re-submit for review
- Iterate until PASS ("APPROVED - ready to merge")

(See subagent-execution.md for how to execute this based on your context)

## Red Flags - Stop If You Think:

- "Just one small example won't hurt" → Zero examples means zero
- "I'll skip validation" → Validation is mandatory (step 9)
- "Concept looks good to me" → Submit for review-concept skill (includes task generation testing)
- "I can skip research for this topic" → Research is MANDATORY
- "The variation system doesn't cover X" → Improve variation system, don't duplicate
- **"I'll skip RED phase, just write the prompt" → RED baseline proves prompt value. No RED = no proof.**
- **"GREEN looks good, no need to compare to RED" → Must compare. GREEN might be good but not better than baseline.**
- **"Frontmatter is enough, skip prompt content" → Must prove improvement. No improvement = concept incomplete.**
- **"RED failed badly, I'll just approve anyway" → RED failure shows frontmatter needs fixing or prompt needs strengthening.**

## Success Criteria

See concept-rules.md § Success Criteria Summary for complete list.

Quick checklist:
1. ✅ Loaded concept-rules.md before starting
2. ✅ Conducted official curriculum research
3. ✅ **Created frontmatter-only baseline**
4. ✅ **Generated and analyzed 5 RED tasks (baseline)**
5. ✅ **Identified RED weaknesses**
6. ✅ **Wrote prompt content addressing RED weaknesses**
7. ✅ **Generated and analyzed 5 GREEN tasks (with prompt)**
8. ✅ **Proved improvement: GREEN ≥ RED+2**
9. ✅ Passed check:concept validation
10. ✅ Within 400-800 words (max 1,200)
11. ✅ Approved by review-concept skill