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

### 6. **TEST PHASE: Generate Sample Tasks (MANDATORY)**

**Use test-concept skill** to generate 5 real tasks and analyze patterns:

```
Use Task tool to launch test-concept skill with concept file path
```

The test-concept skill will:
- Generate 5 tasks (2 easy, 2 medium, 1 hard)
- Analyze for repetitive patterns
- Return PASS/FAIL with specific issues

**If FAIL:**
1. Review issues identified by test-concept
2. Refine concept (remove examples, broaden variation, etc.)
3. Re-run test-concept
4. Iterate until PASS

**Common fixes:**
- Duplicate solutions → Add "each task must have different answer" with examples
- Repetitive scenarios → List 8-10 diverse contexts
- Code duplication → Remove ALL example code (CARDINAL RULE violation)
- Limited structures → List 7-10 distinct problem types
- Note: Same number appearing repeatedly is FINE as long as solutions differ

### 7. REFACTOR: Compress for Efficiency

After test passes:
- Check word count: `wc -w filename.md`
- If >800 words: compress using concept-rules.md § Length Requirements techniques
- Target 400-800 words
- Re-validate still passes tests

### 8. Save and Validate

- Save to `packages/content/subjects/{subject}/official/grade{X}-{id}.md` (see concept-rules.md § Filename Pattern)
- Run: `docker compose exec backend-dev bun run check:concept {subject}/{concept-name}`
- Fix any schema/filename issues

### 9. Add Translations

- See concept-rules.md § Translation Requirements for format
- List languages: `packages/frontend/public/locales/*/subjects/`
- Add to ALL language files: `packages/frontend/public/locales/*/subjects/{subject}.json`
- Alphabetically sort concept keys

### 10. Review and Iterate

- Use Task tool to launch review-concept skill
- Provide concept file path
- **If FAIL:** Fix issues, re-validate, re-review
- Iterate until PASS ("APPROVED - ready to merge")

## Lessons from Testing (Real-World Findings)

### Persistent AI Biases
- **Favorite numbers**: AI strongly prefers 5, 10, 13, and round numbers (especially 9 for "making 10" strategy)
- **Teen number bias**: 13 appears in 80%+ of tasks if not explicitly warned against
- **Duplicate solutions**: Even with explicit examples, AI may generate identical problems with same solutions (~20% rate)
  - **IMPORTANT**: Reusing numbers is FINE (e.g., 9 in multiple tasks) as long as solutions differ
  - **PROBLEM**: Same calculation → same answer (e.g., 9+6=15 appearing twice)
- **Pattern lock-in**: Once AI picks a structure (e.g., "5+5+3"), it tends to reuse it

### What Works
- ✅ **Explicit objective coverage section** at top of concept (not buried)
- ✅ **Concrete examples** of good vs bad variation (show actual problems and solutions)
- ✅ **Problem type rotation instruction** ("Do NOT repeat same structure")
- ✅ **"Avoid duplicate SOLUTIONS" not "duplicate numbers"** - focus on final answers
- ✅ **2-3 testing iterations** find most issues (diminishing returns after)
- ✅ **Version tracking** in frontmatter documents refinement history

### What Doesn't Work
- ❌ Burying critical instructions deep in long concepts
- ❌ Assuming warnings prevent all duplicates (AI limitation)
- ❌ Over-specifying structures (e.g., "rows of 5 or 10" → AI overuses)
- ❌ Testing more than 3 times (marginal gains, high cost)
- ❌ Expecting perfect adherence to numerical variation (accept ~13% duplicate rate)

### Acceptable Thresholds
Based on real testing:
- **Learning objective coverage**: Aim for 50%+ of objectives (3+/6 is good)
- **Duplicate solutions**: <20% rate acceptable (backend can filter)
- **Number repetition**: ACCEPTABLE - it's fine if same number appears in multiple tasks (e.g., 9 in 5/5 tasks is okay)
  - What matters: solutions must differ (9+4=13, 9-4=5, 9+?=17 all okay)
- **Problem structures**: 3+ distinct types minimum, 5+ optimal

### When to Stop Iterating
Stop refining when:
- Core issue (e.g., poor objective coverage) is solved
- 2-3 iterations show diminishing returns
- Remaining issues are AI limitations (not prompt issues)
- Cost/benefit ratio becomes unfavorable
- **Accept "good enough"** - perfection is unattainable

## Red Flags - Stop If You Think:

- "Just one small example won't hurt" → Zero examples means zero
- "I'll test later" → Testing is mandatory (step 6)
- "This is too simple to need testing" → Patterns emerge in simple concepts too
- "Tests will probably pass" → Actually run them
- "Concept looks good to me" → Your opinion is subjective, tests are objective
- "I can skip research for this topic" → Research is MANDATORY
- "The variation system doesn't cover X" → Improve variation system, don't duplicate
- "One more iteration will fix everything" → Accept good enough after 2-3 rounds

## Success Criteria

See concept-rules.md § Success Criteria Summary for complete list.

Quick checklist:
1. ✅ Loaded concept-rules.md before starting
2. ✅ Conducted official curriculum research
3. ✅ Passed task generation quality tests
4. ✅ Passed check:concept validation
5. ✅ Approved by review-concept skill
6. ✅ Within 400-800 words (max 1,200)