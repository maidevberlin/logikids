# Educational Concept Rules - Single Source of Truth

This document defines all rules and requirements for educational concept files in Logikids. Referenced by `generate-concept` and `review-concept` skills.

## Overview

Educational concepts are **creative prompts for AI task generation**, not textbooks. They must:
1. ✅ Pass Zod schema validation
2. ✅ Avoid example code (CARDINAL RULE)
3. ✅ Maximize task variety through minimal, principle-based guidance
4. ✅ Provide clear age/difficulty scaffolding
5. ✅ **Stay within 150-250 words** (minimal prompts are optimal)

## Schema Requirements

**Location**: `packages/backend/src/prompts/schemas.ts:conceptFrontmatterSchema`

### Required Fields

- `id` (string): kebab-case (e.g., `quadratic-functions`)
- `name` (string): Human-readable title
- `description` (string): 1-2 sentences, max 200 chars
- `grade` (integer): 1-13 (German system)
- `ages` (array): Exactly 2 integers `[min, max]`, both 6-18, min ≤ max
- `focus` (string): Learning area (e.g., "Algebra and Functions")
- `difficulty` (enum): `easy`, `medium`, or `hard`
- `learning_objectives` (array): ≥1 string

### Optional Fields

- `prerequisites` (array): concept IDs
- `real_world_context` (string)
- `curriculum_research` (object)
- `version` (integer): Track refinement iterations (start at 1, increment on refinements)
- `version_notes` (string): Document what changed and testing results

### Important Notes

- Schema is **STRICT** - rejects unrecognized fields
- Translations go in `packages/frontend/public/locales/{lang}/subjects/{subject}.json`
- Template variables `{{age}}` and `{{difficulty}}` are **REQUIRED** syntax for scaffolding

## CARDINAL RULE: No Example Code

**ABSOLUTELY FORBIDDEN:**
- ❌ Example SVG code
- ❌ Example LaTeX formulas (except minimal syntax reference)
- ❌ Complete code blocks
- ❌ Specific numerical examples in problem descriptions

**WHY:** LLMs copy examples literally, reducing creativity and causing task duplication.

**Instead:** Describe WHAT to create, not HOW.
- SVG: "Show parabola with vertex marked" (not code)
- LaTeX: "Use inline for variables, block for equations" (not formulas)
- Numbers: "Vary magnitude, type, range" (not specific values)

## Required Variation Dimensions

Specify variation across:

### 1. Problem Structure (7-10 types required)

Examples:
- Direct calculation
- Reverse calculation
- Comparison
- Optimization
- Real-world application
- Graphical interpretation
- Error analysis
- Pattern recognition
- Ordering/sequencing
- Equivalent forms

**Minimum**: 5 distinct structures
**Optimal**: 7-10 structures
**FAIL**: 3 or fewer structures

### 2. Numerical Values (principles, not examples)

- Multiple magnitudes (small/large)
- Diverse scales
- Randomized combinations
- **NO specific examples** in concept text

### 3. Age Scaffolding

Must include conditional guidance based on `{{age}}`:
- Younger ({{age}} < 13): Qualitative, simple, visual
- Middle (13-15): Quantitative, formulas, concrete
- Older (≥16): Multi-step, derivations, abstract

### 4. Difficulty Scaling

Must include conditional guidance based on `{{difficulty}}`:
- Easy: Direct application, one-step
- Medium: Multi-step reasoning, connections
- Hard: Complex, derivations, proofs

**Note:** Context variety (real-world scenarios) handled by backend `prompts/variations/` - don't duplicate.

## Length Requirements

**Every concept loads on EVERY task generation** - efficiency matters.

### UPDATED GUIDANCE (2025-11-23): Minimal Prompts Are Optimal

**Empirical finding:** Testing shows that **minimal prompts (150-200 words) produce BETTER quality than detailed prompts (600-800 words).**

**Evidence:** Three-way comparison (docs/task-comparison/) found minimal prompts achieve 110% of detailed prompt quality because:
- Less specification = more AI creativity
- Principle-based > procedural instructions
- Concise focus forces essentials only
- Avoids "pattern lock-in" from over-specification

**New word count targets:**
- **Optimal**: 150-250 words (prompt section only, excluding frontmatter)
- **Acceptable**: 250-400 words for complex topics
- **Warning**: 400-600 words (likely over-specified)
- **Fail**: Over 600 words (constrains AI creativity)

**Minimal prompt structure:**
```markdown
## Problem Types (use variety)
[List 7-10 problem structures in 1-2 words each]

## Age/Difficulty Guidelines
**For {{age}} < 13:** [2-3 concise bullets]
**For {{age}} >= 13:** [2-3 concise bullets]

**{{difficulty}} == easy:** [1-2 bullets]
**{{difficulty}} == medium:** [1-2 bullets]
**{{difficulty}} == hard:** [1-2 bullets]

## Key Principles
[3-5 core quality principles as bullets]
```

**Compression techniques:**
- Use numbered/bulleted lists exclusively
- 1-2 words per problem structure (e.g., "Error analysis" not "Create tasks where students identify errors")
- Trust AI to interpret principles creatively
- Remove ALL examples and elaborations
- Focus on "what makes good tasks" not "create these specific types"

**Validator**: `check:concept` auto-checks word count.

## Filename Pattern

Must follow: `grade{X}-{concept-name}.md`

Examples:
- ✅ `grade5-fractions.md`
- ✅ `grade1-number-concept-development.md`
- ❌ `fractions.md` (missing grade prefix)
- ❌ `grade-5-fractions.md` (wrong format)

## Curriculum Research Requirement

**MANDATORY**: All concepts must be based on official curriculum research.

**Requirements:**
- Must be based on official education ministry/board documents
- Must extract: learning objectives, age range, difficulty, standards
- Should document in frontmatter `curriculum_research` field (optional but recommended)

**Quality gate**: Review process checks for documented curriculum alignment.

## Task Generation Quality Tests

Concepts must generate high-quality, varied tasks. Testing validates:

### 1. Numerical Repetition

- **FAIL**: Same number appears in 3+ tasks (60% threshold)
- **PASS**: Numbers vary across tasks
- **Note**: Same number in multiple tasks is acceptable IF solutions differ
  - ✅ OK: 9+4=13, 9-4=5, 9+?=17 (same number, different solutions)
  - ❌ FAIL: 9+6=15, 9+6=15 (duplicate solution)

### 2. Language Variety

- **FAIL**: Exact phrase (5+ words) repeated in 2+ tasks
- **WARNING**: Very similar structures in 3+ tasks
- **PASS**: Varied phrasing across tasks

### 3. Code Duplication (CARDINAL RULE enforcement)

- **FAIL**: Identical/near-identical LaTeX or SVG in 2+ tasks
- Indicates concept violated CARDINAL RULE by providing example code
- **PASS**: Varied code structures OR no code duplication

### 4. Problem Structure Variety

- **FAIL**: Same structure in 3+ tasks (60% threshold)
- **WARNING**: Only 2-3 unique structures across 5 tasks
- **PASS**: 4-5+ different structures

### 5. Learning Objective Alignment

- **FAIL**: Any task doesn't target at least one stated learning objective
- **WARNING**: Some objectives never tested across sample tasks
- **PASS**: All tasks target objectives, all objectives covered

## Anti-Patterns to Avoid

- ❌ Formulaic language ("Calculate X using Y" repeatedly)
- ❌ Copying example numbers from curriculum
- ❌ Over-explaining pedagogy
- ❌ Including code "students need to see"
- ❌ Burying critical instructions deep in text
- ❌ **Over-specifying structures (causes AI lock-in)** ← CRITICAL: Detailed prompts reduce creativity
- ❌ Providing verbose examples instead of principles
- ❌ Writing prompts over 250 words (unless truly complex topic)
- ❌ Explaining HOW to create tasks instead of WHAT makes good tasks
- ❌ Including multiple examples per structure (AI will copy them)

## Known AI Biases

From real-world testing, AI tends to:

- **Favorite numbers**: Strongly prefers 5, 10, 13, round numbers
- **Teen number bias**: 13 appears in 80%+ of tasks if not warned
- **Duplicate solutions**: ~20% rate even with explicit warnings
- **Pattern lock-in**: Reuses first structure chosen
- **Number repetition**: ACCEPTABLE - focus is on solution variety, not number variety

## Acceptable Quality Thresholds

Based on real testing:

- **Learning objective coverage**: 50%+ objectives covered (3/6 is good)
- **Duplicate solutions**: <20% rate acceptable (backend can filter)
- **Number repetition**: ACCEPTABLE - solutions must differ, numbers can repeat
- **Problem structures**: 3+ distinct types minimum, 5+ optimal

## When to Stop Iterating

Stop refining when:
- Core issues (e.g., poor objective coverage) are solved
- 2-3 iterations show diminishing returns
- Remaining issues are AI limitations (not prompt issues)
- Cost/benefit ratio becomes unfavorable
- **Accept "good enough"** - perfection is unattainable

## Validation Tools

### Automated Validation

**Command**: `docker compose exec backend-dev bun run check:concept {subject}/{concept-name}`

**Checks**:
- ✅ Schema (frontmatter fields and types)
- ✅ Filename pattern
- ✅ CARDINAL RULE (no code examples in problem descriptions)
- ✅ Problem structure count (7-10 required)
- ✅ Template variables (`{{age}}`, `{{difficulty}}`)
- ✅ Word count (150-250 optimal, warning at 300+, fail at 400+)
- ✅ Translations (all languages, proper format)

### Task Generation Testing

**Requirements**:
- Generate 5 tasks (2 easy, 2 medium, 1 hard)
- Analyze for all 5 pattern types listed above
- Must PASS all tests before approval

## Translation Requirements

**Location**: `packages/frontend/public/locales/{lang}/subjects/{subject}.json`

**Format**:
```json
"concepts": {
  "{id}": {
    "name": "Translated name",
    "description": "Translated description"
  }
}
```

**Requirements**:
- Add to ALL language files
- Alphabetically sort concept keys
- Keep descriptions under 200 chars

## Success Criteria Summary

A valid concept must:

1. ✅ Pass `check:concept` validation (schema, CARDINAL RULE, structure count, word count)
2. ✅ Pass task generation quality tests (no repetitive patterns)
3. ✅ Based on official curriculum research
4. ✅ Describe variation principles (no fixed examples)
5. ✅ **Within 150-250 words (max 400)** - minimal prompts proven optimal
6. ✅ Include translations in all language files
7. ✅ Generate varied, creative tasks aligned with learning objectives
