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

**REQUIRED READING:** Load `.claude/docs/concept-rules.md` for complete requirements.

This skill provides the PROCESS for creating concepts. The rules document provides REQUIREMENTS.

**Load concept-rules.md NOW using Read tool before proceeding.**

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

### 5. Write Creative Prompt (DRAFT)

- Apply concept-rules.md § CARDINAL RULE (describe, don't demonstrate)
- Specify 7-10 problem structures (see concept-rules.md § Required Variation Dimensions)
- Include age/difficulty scaffolding (see concept-rules.md § Required Variation Dimensions)
- Target 400-800 words (see concept-rules.md § Length Requirements)
- Align with curriculum objectives

### 6. Save and Validate (MANDATORY)

**Save concept file:**
- Save to `packages/content/subjects/{subject}/official/grade{X}-{id}.md`
- Filename must match pattern (see concept-rules.md § Filename Pattern)

**Run automated validation:**
```bash
docker compose exec backend-dev bun run check:concept {subject}/{concept-name}
```

Fix any issues reported before proceeding.

### 7. Compress for Efficiency

After validation passes:
- Check word count: `wc -w filename.md`
- If >800 words: compress using concept-rules.md § Length Requirements techniques
- Target 400-800 words
- Re-run validation after compression

### 8. Add Translations

- See concept-rules.md § Translation Requirements for format
- List languages: `packages/frontend/public/locales/*/subjects/`
- Add to ALL language files: `packages/frontend/public/locales/*/subjects/{subject}.json`
- Alphabetically sort concept keys

### 9. Submit for Review

- Use Task tool to launch review-concept skill
- Provide concept file path
- Review will include automated validation + task generation testing
- **If FAIL:** Fix issues and re-submit for review
- Iterate until PASS ("APPROVED - ready to merge")

## Red Flags - Stop If You Think:

- "Just one small example won't hurt" → Zero examples means zero
- "I'll skip validation" → Validation is mandatory (step 6)
- "Concept looks good to me" → Submit for review-concept skill (includes task generation testing)
- "I can skip research for this topic" → Research is MANDATORY
- "The variation system doesn't cover X" → Improve variation system, don't duplicate

## Success Criteria

See concept-rules.md § Success Criteria Summary for complete list.

Quick checklist:
1. ✅ Loaded concept-rules.md before starting
2. ✅ Conducted official curriculum research
3. ✅ Passed task generation quality tests
4. ✅ Passed check:concept validation
5. ✅ Approved by review-concept skill
6. ✅ Within 400-800 words (max 1,200)