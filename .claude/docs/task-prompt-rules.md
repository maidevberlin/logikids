# Task Prompt Architecture Rules - Single Source of Truth

This document defines all rules and requirements for task prompt composition in Logikids. Referenced by `review-task-prompt` skill and other agents working with prompts.

## Overview

Task prompts are composed from multiple levels in a hierarchy. Each level has a specific purpose and must not duplicate content from other levels. The full prompt is assembled by concatenating:

1. Base prompt (generic task creation rules)
2. Variations template (context and enrichment)
3. Subject template (subject-specific rules)
4. Task type template (task format rules)
5. Concept (concept-specific guidance)

**Goal:** Maximize clarity, minimize redundancy, optimize token efficiency.

## Hierarchy and Separation of Concerns

### Base Prompt Level (`prompts/base-prompt.md`)

**Purpose:** Generic task creation rules applicable to ALL subjects

**Should contain:**
- Task vs solution separation
- Format guidelines (LaTeX, SVG, markdown syntax)
- Generic learning objective rotation instruction
  - Example: "Rotate through all listed learning objectives"
  - Example: "Do not focus on only one or two objectives"
- Generic problem structure variety instruction
  - Example: "Use diverse problem types"
  - Example: "Do not repeat the same structure"
- Output format requirements (JSON schema compliance)

**Must NOT contain:**
- Subject-specific content (e.g., "for math problems...")
- Concept-specific guidance
- Context/scenario instructions (belongs in variations)
- Numerical variation rules (belongs in subject level)

### Variations Level (`prompts/variations/*.md`)

**Purpose:** Context, scenarios, and language enrichment

**Should contain:**
- Scenario context types (real-world applications)
- Language style variations (formal, conversational, narrative)
- Enrichment dimensions:
  - Character-based (personalization)
  - Temporal (time-based contexts)
  - Cultural (diverse backgrounds)
- Phrasing variety instructions

**Must NOT contain:**
- Content-specific rules (math, physics, etc.)
- Task format rules
- Learning objective instructions (belongs at base level)
- Concept-specific scenarios (belongs in concept)

### Subject Level (`prompts/subjects/{subject}/base.md`)

**Purpose:** Subject-specific task variation principles

**Should contain:**
- Subject-specific content types
  - Math: Numerical variation principles, equation types
  - Physics: Diagram types, unit systems
  - Music: Notation systems, sound types
- Subject-specific task structures
- Subject-specific scaffolding (for math: magnitude ranges, for physics: complexity levels)

**Must NOT contain:**
- Generic task rules (belongs at base level)
- Concept-specific guidance
- Task type formatting (belongs in task type level)
- Context/scenarios (belongs in variations)

### Task Type Level (`prompts/task-types/{type}.md`)

**Purpose:** Task format schema and option creation guidelines

**Should contain:**
- Task type JSON schema
- Option/distractor creation rules
- Correct answer selection logic
- Task-type-specific quality criteria
  - Single choice: distractor quality, option count
  - Multiple select: minimum correct answers
  - Fill-in-blank: acceptable answer variations
  - Ordering: sequence validation

**Must NOT contain:**
- Subject-specific rules
- Learning objective instructions
- Problem structure variety (belongs at base level)

### Concept Level (`packages/content/subjects/{subject}/official/*.md`)

**Purpose:** ONLY concept-specific guidance

**Should contain:**
- What makes THIS concept unique
- Specific problem types for THIS concept
- Common misconceptions for THIS concept
- Age/difficulty scaffolding for THIS concept
- Prerequisites specific to THIS concept

**Must NOT contain:**
- Generic instructions ("create varied tasks" → base level)
- Subject-wide rules ("for math, vary numbers" → subject level)
- Task format rules → task type level
- General context types → variations level
- Learning objective rotation instructions → base level

## Quality Criteria

### 1. Learning Objective Coverage

**Requirement:** Base prompt must include clear instruction on HOW to use learning objectives.

**Good examples:**
- "Rotate through ALL learning objectives listed below"
- "Ensure each task targets a different objective when possible"
- "Do not focus on only one or two objectives - cover the full range"

**Bad examples:**
- Only listing objectives without instruction on coverage (❌ FAIL)
- Instruction only in concept file (⚠️ WARNING - should be at base level)
- No mention of objectives at all (❌ FAIL)

**Location:** Base prompt level (applies to all subjects and concepts)

### 2. Repetition Detection

**Requirement:** No instruction blocks >50 words should appear in multiple levels.

**Common repetitions to avoid:**
- Numerical variation principles appearing in both subject template AND concept
- Problem structure rotation appearing in both base prompt AND concept
- Language variety appearing in both variations AND concept
- Learning objective coverage appearing in both base AND concept

**Detection criteria:**
- ❌ **FAIL**: 50+ word blocks repeated between levels
- ⚠️ **WARNING**: Similar instructions (paraphrased) at multiple levels
- ✅ **PASS**: Each level has distinct, non-overlapping content

**Fix:** Move instruction to the HIGHEST applicable level (base > subject > concept)

### 3. Instruction Hierarchy Compliance

**Rule:** Instructions must be placed at the HIGHEST level where they apply.

**Decision tree:**
- Applies to ALL subjects? → Base prompt
- Applies to ALL tasks in this subject? → Subject template
- Applies to ALL instances of this task type? → Task type template
- Applies ONLY to this concept? → Concept file

**Examples:**
- ✅ "Vary numerical values" in math subject template (applies to all math)
- ❌ "Vary numerical values" in addition concept (should be at subject level)
- ✅ "Rotate through learning objectives" in base prompt (applies to all subjects)
- ❌ "Rotate through learning objectives" in concept (should be at base level)

**Detection criteria:**
- ❌ **FAIL**: Generic instructions at concept level
- ⚠️ **WARNING**: Subject-specific instructions at concept level (unless truly concept-unique)
- ✅ **PASS**: Clear separation - each instruction at appropriate level

### 4. Token Efficiency

**Requirement:** Minimize token usage while maintaining clarity.

**Word count targets:**

**Concept files:**
- **Optimal**: 400-800 words
- **Warning**: 801-1,200 words (consider compression)
- **Fail**: >1,200 words (must compress)

**Total composed prompt:**
- **Optimal**: <3,000 words
- **Acceptable**: 3,000-4,000 words
- **Warning**: 4,000-5,000 words
- **Fail**: >5,000 words

**Efficiency techniques:**
- Remove redundant instructions (check all levels)
- Use bullet lists instead of paragraphs
- Avoid meta-commentary ("This is important because...")
- Combine related instructions
- Trust AI intelligence (don't over-explain)

### 5. Task Generation Quality

**Requirement:** Composed prompt must generate varied, high-quality tasks.

**Test criteria** (from concept-rules.md § Task Generation Quality Tests):

1. **Numerical Repetition**: Same number in <60% of tasks
2. **Language Variety**: No exact phrase (5+ words) repeated
3. **Code Duplication**: No identical LaTeX/SVG in 2+ tasks
4. **Problem Structure Variety**: 3+ different structures in 5 tasks
5. **Learning Objective Alignment**: All tasks target stated objectives

**Testing requirement:** Must generate 5 tasks (2 easy, 2 medium, 1 hard) and analyze for patterns.

## Validation Process

### Structural Analysis Checklist

**A1. Learning Objective Instructions**
- [ ] Objectives listed in prompt
- [ ] Instruction on HOW to cover objectives
- [ ] Instruction at base/subject level (not concept)

**A2. Repetition Detection**
- [ ] No 50+ word blocks repeated across levels
- [ ] Instructions appear at single appropriate level
- [ ] Each level has distinct content

**A3. Instruction Hierarchy**
- [ ] Generic rules at base level only
- [ ] Subject rules at subject level only
- [ ] Concept contains only concept-unique guidance

**A4. Token Efficiency**
- [ ] Concept: 400-800 words optimal
- [ ] Total prompt: <4,000 words acceptable
- [ ] No redundant instructions

### Task Generation Testing

**Command:**
```bash
bun run test:prompt --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=easy --language={language}
```

**Outputs:** Full composed prompt for manual review

**Then generate and analyze 5 real tasks** (see concept-rules.md § Task Generation Quality Tests)

## Pass/Fail Criteria

### PASS Requirements

**Structural:**
- ✅ 0 FAIL issues
- ✅ ≤1 WARNING issue

**Task Generation:**
- ✅ Passes all 5 quality tests
- ✅ ≥50% learning objective coverage

### REFINE Requirements

**Structural issues:**
- 1-2 FAIL issues OR
- 2+ WARNING issues

**Task generation:**
- Fails 1-2 quality tests OR
- <50% learning objective coverage

### FAIL Requirements

**Structural:**
- 3+ FAIL issues

**Task generation:**
- Fails 3+ quality tests AND
- <40% learning objective coverage

## Root Cause Tracing

When issues are found, trace to the specific file and location:

**Issue identification:**
1. What is the symptom? (repetition, missing instruction, poor task quality)
2. Which level should handle this? (base, variations, subject, task type, concept)
3. Where is it currently? (search all levels)
4. What's the exact fix? (add, remove, or move instruction)

**Fix documentation:**
```markdown
**Issue:** {description}
**Current location:** {file:line}
**Should be:** {correct file}
**Action:** {add/remove/move}
**Exact change:**
```
{code snippet}
```
```

## Common Anti-Patterns

### ❌ "Kitchen Sink" Concepts
Concept files containing generic instructions that apply to all concepts.

**Example violations:**
- "Create varied tasks" (generic → belongs at base)
- "Use diverse scenarios" (generic → belongs in variations)
- "Rotate through objectives" (generic → belongs at base)

**Fix:** Move to appropriate higher level

### ❌ Redundant Hierarchy
Same instruction appearing at multiple levels (base + subject + concept).

**Example:**
- Base: "Vary problem structures"
- Subject: "For math, vary calculation types"
- Concept: "Use different addition problem types"

**Problem:** All three say the same thing with increasing specificity, but first two are redundant.

**Fix:** Keep ONLY concept-specific version, remove others

### ❌ Orphaned Instructions
Instructions with no clear purpose or recipient.

**Example:**
- "Make tasks interesting" (vague, no actionable guidance)
- "Follow best practices" (not specific)

**Fix:** Either make specific or remove

### ❌ Meta-Commentary
Explaining WHY instructions exist instead of just stating them.

**Example:**
- "It's important to vary numbers because students need diverse practice" (wordy)
- Better: "Vary numerical values: magnitude, scale, combinations"

**Fix:** Remove explanation, keep instruction

## Success Criteria Summary

A well-structured prompt system must:

1. ✅ Clear hierarchy - each level serves distinct purpose
2. ✅ No repetition - instructions appear at single appropriate level
3. ✅ Learning objectives - instruction on coverage at base level
4. ✅ Token efficient - concepts 400-800 words, total <4,000 words
5. ✅ Quality tasks - passes all 5 generation tests
6. ✅ Objective coverage - ≥50% of learning objectives tested
7. ✅ Traceable - issues can be traced to specific file:line

## Tools and Commands

### Generate Full Composed Prompt
```bash
bun run test:prompt --subject={subject} --concept={concept-id} --taskType={taskType} --grade={grade} --difficulty=easy --language={language}
```

### Check Word Counts
```bash
wc -w prompts/base-prompt.md
wc -w prompts/variations/*.md
wc -w prompts/subjects/{subject}/base.md
wc -w packages/content/subjects/{subject}/official/{concept}.md
```

### Generate Test Tasks
See concept-rules.md § Task Generation Quality Tests for full process.