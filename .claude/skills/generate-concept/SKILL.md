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

## Overview

Create concept markdown files that:
1. ✅ Pass Zod schema validation
2. ✅ Avoid example code (prevents copy-paste behavior)
3. ✅ Maximize task variety
4. ✅ Provide clear age/difficulty scaffolding
5. ✅ Stay within 400-800 words (max 1,200)

## PART A: Frontmatter Schema

**Required fields** (from `packages/backend/src/prompts/schemas.ts:conceptFrontmatterSchema`):
- `id` (string): kebab-case (e.g., `quadratic-functions`)
- `name` (string): Human-readable title
- `description` (string): 1-2 sentences, max 200 chars
- `grade` (integer): 1-13 (German system)
- `ages` (array): Exactly 2 integers `[min, max]`, both 6-18, min ≤ max
- `focus` (string): Learning area (e.g., "Algebra and Functions")
- `difficulty` (enum): `easy`, `medium`, or `hard`
- `learning_objectives` (array): ≥1 string

**Optional fields:**
- `prerequisites` (array): concept IDs
- `real_world_context` (string)
- `curriculum_research` (object)

**Schema is STRICT** - rejects unrecognized fields. Translations go in `packages/frontend/public/locales/{lang}/subjects/{subject}.json`.

## PART B: Creative Prompt Guidelines

### CARDINAL RULE: NO EXAMPLE CODE

**ABSOLUTELY FORBIDDEN:**
- ❌ Example SVG code
- ❌ Example LaTeX formulas (except minimal syntax reference)
- ❌ Complete code blocks
- ❌ Specific numerical examples

**WHY:** LLMs copy examples literally, reducing creativity.

**Instead:** Describe WHAT to create, not HOW.
- SVG: "Show parabola with vertex marked" (not code)
- LaTeX: "Use inline for variables, block for equations" (not formulas)
- Numbers: "Vary magnitude, type, range" (not specific values)

### Required Variation Dimensions

Specify variation across:

1. **Problem Structure (7-10 types)**: Direct calculation, reverse calculation, comparison, optimization, real-world application, graphical interpretation, error analysis
2. **Numerical Values (principles)**: Multiple magnitudes, diverse scales, randomized combinations (NO specific examples)
3. **Age Scaffolding**:
   - Younger ({{age}} < 13): Qualitative, simple
   - Middle (13-15): Quantitative, formulas
   - Older (≥16): Multi-step, derivations
4. **Difficulty Scaling**:
   - Easy: Direct application
   - Medium: Multi-step reasoning
   - Hard: Complex, derivations

**Note:** Context variety handled by backend `prompts/variations/` - don't duplicate.

### Anti-Patterns

Avoid:
- Formulaic language ("Calculate X using Y" repeatedly)
- Copying example numbers from curriculum
- Over-explaining pedagogy
- Including code "students need to see"

## PART C: Length & Token Efficiency

**Every concept loads EVERY task generation.**

**Word count targets:**
- **Optimal**: 400-800 words
- **Maximum**: 1,200 words

**Compression techniques:**
- Bullet lists, not paragraphs
- Trust AI intelligence (no over-explaining)
- Remove meta-commentary
- Combine related sections

**Validator enforces:** `check:concept` auto-checks length (400-800 = pass, 801-1,200 = warning, other = fail).

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

- Use strict YAML format (Part A)
- Populate with curriculum-aligned data
- Ensure all required fields present

### 5. Write Creative Prompt (DRAFT)

- Apply Part B guidelines (describe, don't demonstrate)
- Specify 7-10 problem structures
- Include age/difficulty scaffolding
- Target 400-800 words
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
- Repetitive numbers → Remove specific values, describe principles
- Repetitive scenarios → List 8-10 diverse contexts
- Code duplication → Remove ALL example code (CARDINAL RULE violation)
- Limited structures → List 7-10 distinct problem types

### 7. REFACTOR: Compress for Efficiency

After test passes:
- Check word count: `wc -w filename.md`
- If >800 words: compress using Part C techniques
- Target 400-800 words
- Re-validate still passes tests

### 8. Save and Validate

- Save to `packages/content/subjects/{subject}/official/grade{X}-{id}.md`
- Run: `docker compose exec backend-dev bun run check:concept {subject}/{concept-name}`
- Fix any schema/filename issues

### 9. Add Translations

- List languages: `packages/frontend/public/locales/*/subjects/`
- Add to ALL language files: `packages/frontend/public/locales/*/subjects/{subject}.json`
- Format:
  ```json
  "concepts": {
    "{id}": {
      "name": "Translated name",
      "description": "Translated description"
    }
  }
  ```
- Alphabetically sort concept keys

### 10. Review and Iterate

- Use Task tool to launch review-concept skill
- Provide concept file path
- **If FAIL:** Fix issues, re-validate, re-review
- Iterate until PASS ("APPROVED - ready to merge")

## Red Flags - Stop If You Think:

- "Just one small example won't hurt" → Zero examples means zero
- "I'll test later" → Testing is mandatory (step 6)
- "This is too simple to need testing" → Patterns emerge in simple concepts too
- "Tests will probably pass" → Actually run them
- "Concept looks good to me" → Your opinion is subjective, tests are objective
- "I can skip research for this topic" → Research is MANDATORY
- "The variation system doesn't cover X" → Improve variation system, don't duplicate

## Success Criteria

A successful concept:
1. ✅ Passes test-concept (no repetitive patterns in generated tasks)
2. ✅ Passes check:concept validation (schema, CARDINAL RULE, structure count, word count)
3. ✅ Based on official curriculum research
4. ✅ Describes numerical variation principles (no fixed examples)
5. ✅ Approved by review-concept subagent
6. ✅ Within 400-800 words (max 1,200)