---
name: test-concept
description: Test concept quality using RED-GREEN methodology - generates baseline tasks (frontmatter-only) and improved tasks (full concept) to prove prompt content adds measurable value
---

# RED-GREEN Concept Testing

## Overview

Apply TDD principles to concept validation: establish baseline quality (RED), test with full concept (GREEN), prove improvement.

**Core principle:** Prompt content must show measurable improvement over frontmatter-only baseline, or it adds no value.

## When to Use

Use when:
- Validating new concept files (part of generate-concept workflow)
- Reviewing concept files (part of review-concept workflow)
- Debugging repetitive task generation (does prompt help or hurt?)
- Refining existing concepts (measure impact of changes)

**DO NOT use for:**
- Schema validation (use `check:concept` script)
- Curriculum research verification (use review-concept)

## Prerequisites

**REQUIRED:**
1. Concept file must exist at valid path
2. Backend must be running (`docker compose up backend-dev`)
3. AI provider configured (`packages/backend/config.yaml`)

## The Quality Gate

```
NO CONCEPT APPROVAL WITHOUT PROVING:
RED (baseline) → GREEN (with prompt) shows Δ ≥ +2 checks
```

Schema validation proves structure. RED-GREEN proves quality.

## Process

### Step 1: Extract Test Parameters

**Read the concept file and extract:**
- Subject (from file path: `subjects/{subject}/official/`)
- Concept ID (from frontmatter `id` field)
- Grade (from frontmatter `grade` field)
- Learning objectives (from frontmatter `learning_objectives` array)

### Step 2: Create Frontmatter-Only Version

**Extract only frontmatter for RED baseline:**

```bash
# Get line number of second "---" (closing frontmatter tag)
concept_file_path="{full-path-to-concept.md}"
closing_line=$(grep -n "^---$" "$concept_file_path" | sed -n 2p | cut -d: -f1)

# Extract frontmatter only
head -n "$closing_line" "$concept_file_path" > /tmp/concept-frontmatter-only.md
```

**Temporarily replace concept file with frontmatter-only version:**

```bash
# Backup original
cp "$concept_file_path" "$concept_file_path.backup"

# Replace with frontmatter-only
cp /tmp/concept-frontmatter-only.md "$concept_file_path"
```

### Step 3: RED Phase - Generate Baseline Tasks

**Generate 5 tasks using frontmatter-only concept:**

```bash
subject="{subject}"
concept_id="{concept-id}"
grade="{grade}"

# Task 1: Easy (RED)
docker compose exec backend-dev bun run generate:task \
  --subject="$subject" \
  --concept="$concept_id" \
  --taskType=singleChoice \
  --grade="$grade" \
  --difficulty=easy \
  --language=en \
  --output=/tmp/red-task1.json

# Task 2: Easy (RED)
docker compose exec backend-dev bun run generate:task \
  --subject="$subject" \
  --concept="$concept_id" \
  --taskType=singleChoice \
  --grade="$grade" \
  --difficulty=easy \
  --language=en \
  --output=/tmp/red-task2.json

# Task 3: Medium (RED)
docker compose exec backend-dev bun run generate:task \
  --subject="$subject" \
  --concept="$concept_id" \
  --taskType=singleChoice \
  --grade="$grade" \
  --difficulty=medium \
  --language=en \
  --output=/tmp/red-task3.json

# Task 4: Medium (RED)
docker compose exec backend-dev bun run generate:task \
  --subject="$subject" \
  --concept="$concept_id" \
  --taskType=singleChoice \
  --grade="$grade" \
  --difficulty=medium \
  --language=en \
  --output=/tmp/red-task4.json

# Task 5: Hard (RED)
docker compose exec backend-dev bun run generate:task \
  --subject="$subject" \
  --concept="$concept_id" \
  --taskType=singleChoice \
  --grade="$grade" \
  --difficulty=hard \
  --language=en \
  --output=/tmp/red-task5.json
```

**Read all 5 RED task files** using Read tool.

### Step 4: Analyze RED Tasks

Run these 5 checks on RED tasks:

#### 1. Numerical Repetition Detection

**Extract all numbers** from task descriptions (integers, decimals, fractions).

**Count frequency** of each unique number.

**Verdict:**
- **FAIL** if any number appears in 3+ tasks (≥60% = too repetitive)
- **PASS** otherwise

**Example FAIL:**
- Task 1: "8 slices", Task 2: "8 apples", Task 3: "8 students", Task 4: "8 cookies"
- Number "8" appears 4/5 times = FAIL

#### 2. Language/Phrasing Repetition

**Look for repeated phrases** (5+ consecutive words appearing in multiple tasks).

**Verdict:**
- **FAIL** if same phrase appears in 2+ tasks
- **WARNING** if very similar sentence structures in 3+ tasks
- **PASS** otherwise

**Example FAIL:**
- Task 1: "What fraction of the shape is shaded?"
- Task 2: "What fraction of the shape is shaded?"
- Exact phrase repeated = FAIL

#### 3. Example Code Duplication (CARDINAL RULE)

**Extract LaTeX** (between $ or $$) and **SVG elements** (viewBox, paths, structure).

**Compare** for identical or near-identical code between tasks.

**Verdict:**
- **FAIL** if identical or near-identical code in 2+ tasks
- **PASS** otherwise

**Why FAIL:** This indicates concept violated CARDINAL RULE by providing example code that AI copied.

**Example FAIL:**
- Task 1: `$$\frac{2}{5}$$`
- Task 2: `$$\frac{2}{5}$$`
- Same fraction structure = FAIL (likely copied from concept)

#### 4. Problem Structure Variety

**Classify each task** by structure type:
- Identification (identify fraction from visual)
- Comparison (which is bigger)
- Application (real-world scenario)
- Ordering (arrange from smallest to largest)
- Equivalent (find equal fractions)
- Calculation (compute result)
- Translation (convert between representations)

**Count unique structures** across all 5 tasks.

**Verdict:**
- **FAIL** if same structure appears in 3+ tasks
- **WARNING** if only 2-3 different structures total
- **PASS** if 4+ different structures

**Example FAIL:**
- Tasks 1-4 all "Identification", Task 5 "Comparison"
- Only 2 structures, same structure 4/5 times = FAIL

#### 5. Learning Objective Alignment

**Map each task** to learning objectives from frontmatter.

**Check:**
- Does each task target at least one objective?
- Are all objectives covered across the 5 tasks?

**Verdict:**
- **FAIL** if any task doesn't target at least one objective
- **WARNING** if some objectives never tested
- **PASS** if all tasks target objectives and all objectives covered

### Step 5: Record RED Scores

**Calculate RED score:**
- Count how many checks passed (0-5)
- Record which specific checks failed
- Note specific issues (which numbers repeated, which phrases, etc.)

**RED Score: X/5 checks passed**

### Step 6: Restore Full Concept

**Restore original concept file:**

```bash
# Restore from backup
mv "$concept_file_path.backup" "$concept_file_path"
```

### Step 7: GREEN Phase - Generate Full Concept Tasks

**Generate 5 tasks using FULL concept (frontmatter + prompt content):**

```bash
# Task 1: Easy (GREEN)
docker compose exec backend-dev bun run generate:task \
  --subject="$subject" \
  --concept="$concept_id" \
  --taskType=singleChoice \
  --grade="$grade" \
  --difficulty=easy \
  --language=en \
  --output=/tmp/green-task1.json

# Task 2: Easy (GREEN)
docker compose exec backend-dev bun run generate:task \
  --subject="$subject" \
  --concept="$concept_id" \
  --taskType=singleChoice \
  --grade="$grade" \
  --difficulty=easy \
  --language=en \
  --output=/tmp/green-task2.json

# Task 3: Medium (GREEN)
docker compose exec backend-dev bun run generate:task \
  --subject="$subject" \
  --concept="$concept_id" \
  --taskType=singleChoice \
  --grade="$grade" \
  --difficulty=medium \
  --language=en \
  --output=/tmp/green-task3.json

# Task 4: Medium (GREEN)
docker compose exec backend-dev bun run generate:task \
  --subject="$subject" \
  --concept="$concept_id" \
  --taskType=singleChoice \
  --grade="$grade" \
  --difficulty=medium \
  --language=en \
  --output=/tmp/green-task4.json

# Task 5: Hard (GREEN)
docker compose exec backend-dev bun run generate:task \
  --subject="$subject" \
  --concept="$concept_id" \
  --taskType=singleChoice \
  --grade="$grade" \
  --difficulty=hard \
  --language=en \
  --output=/tmp/green-task5.json
```

**Read all 5 GREEN task files** using Read tool.

### Step 8: Analyze GREEN Tasks

**Run the same 5 checks** as Step 4 on GREEN tasks.

**Record GREEN score: Y/5 checks passed**

### Step 9: Compare RED vs GREEN

**Calculate improvement delta:**
- Checks improved: {GREEN score - RED score}
- Which specific checks went from FAIL→PASS?
- Any regressions (PASS→FAIL)?

**Verdict criteria:**
- **PASS**: GREEN ≥ RED+2 (significant improvement, prompt adds clear value)
- **MARGINAL**: GREEN = RED+1 (minimal improvement, prompt adds some value)
- **FAIL**: GREEN ≤ RED (no improvement or regression, prompt adds no value or is harmful)

### Step 10: Provide Structured Report

Use this format:

```markdown
## RED-GREEN Test Results

**Concept:** {subject}/{concept-id} (Grade {grade})
**Test Date:** {date}

---

### RED Phase (Frontmatter Only - Baseline)

**Tasks Generated:** 5 (2 easy, 2 medium, 1 hard)

**Pattern Analysis:**

1. **Numerical Repetition**: [PASS / FAIL]
   - {Details: which numbers repeated, frequency}

2. **Language Variety**: [PASS / FAIL]
   - {Details: repeated phrases found}

3. **Code Duplication**: [PASS / FAIL]
   - {Details: LaTeX/SVG analysis}

4. **Problem Structure Variety**: [PASS / FAIL]
   - {List structures: "Identification (3), Comparison (1), Application (1)"}

5. **Learning Objective Alignment**: [PASS / FAIL]
   - {Map tasks to objectives}

**RED Score: X/5 checks passed**

**RED Tasks Summary:**
- Task 1 (Easy): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 2 (Easy): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 3 (Medium): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 4 (Medium): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 5 (Hard): {first 50 chars}... [Structure: X, Numbers: Y]

---

### GREEN Phase (Full Concept - With Prompt Content)

**Tasks Generated:** 5 (2 easy, 2 medium, 1 hard)

**Pattern Analysis:**

1. **Numerical Repetition**: [PASS / FAIL]
   - {Details}

2. **Language Variety**: [PASS / FAIL]
   - {Details}

3. **Code Duplication**: [PASS / FAIL]
   - {Details}

4. **Problem Structure Variety**: [PASS / FAIL]
   - {List structures}

5. **Learning Objective Alignment**: [PASS / FAIL]
   - {Map tasks to objectives}

**GREEN Score: Y/5 checks passed**

**GREEN Tasks Summary:**
- Task 1 (Easy): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 2 (Easy): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 3 (Medium): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 4 (Medium): {first 50 chars}... [Structure: X, Numbers: Y]
- Task 5 (Hard): {first 50 chars}... [Structure: X, Numbers: Y]

---

### Improvement Delta

**Score Change:** RED {X}/5 → GREEN {Y}/5 (Δ = {Y-X})

**Checks Improved (FAIL→PASS):**
- {List which checks improved, or "None"}

**Checks Regressed (PASS→FAIL):**
- {List any regressions, or "None"}

**Overall Verdict:** [PASS / MARGINAL / FAIL]

**Explanation:**
{Explain what the prompt content contributed or failed to contribute}

---

### Recommendations

**If PASS:**
"✅ Prompt content adds significant value. Concept ready for next validation step."

**If MARGINAL:**
"⚠️ Prompt content adds minimal value. Consider strengthening:
- {Specific recommendations based on which checks didn't improve}
- {Reference to concept-rules.md sections}"

**If FAIL:**
"❌ Prompt content adds no value or is harmful. Analysis:
- {Which checks failed in both RED and GREEN}
- {Which checks regressed from RED to GREEN}
- {Likely causes: CARDINAL RULE violation, over-prescription, etc.}
- Required action: Rewrite prompt content and re-test."
```

## Edge Cases

### Case 1: RED Already Perfect (5/5)

If frontmatter alone generates perfect tasks, the concept might be too simple.

**Decision:** Prompt content still recommended for consistency, but keep it minimal. Focus on age/difficulty scaffolding only.

### Case 2: Both RED and GREEN Fail Badly (0-1/5)

If both score very low, the problem is likely in **frontmatter** (poor learning objectives, wrong grade level, unclear description).

**Decision:** Fix frontmatter first, then retry RED-GREEN test.

### Case 3: GREEN Worse Than RED (Regression)

If full concept scores LOWER than frontmatter-only, the prompt content is actively harmful.

**Common causes:**
- Providing example code (CARDINAL RULE violation) → AI copies instead of creating
- Too prescriptive → reduces AI creativity
- Contradicting frontmatter → confuses AI

**Decision:** FAIL immediately. Identify harmful section in prompt, rewrite, re-test.

### Case 4: GREEN = RED (No Change)

Prompt content adds no value.

**Causes:**
- Prompt just rephrases frontmatter (redundant)
- Prompt too vague to guide AI
- Frontmatter already sufficient

**Decision:** FAIL. Either strengthen prompt to add value, or simplify concept to frontmatter-only.

## Cost Consideration

- **Current workflow:** 5 tasks per concept review
- **RED-GREEN workflow:** 10 tasks per concept (5 RED + 5 GREEN)
- **Cost:** 2x AI generation cost

**Justification:** Proving value objectively is worth 2x cost. Bad concepts cost more in debugging, user complaints, and refactoring.

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "RED-GREEN is overkill, just test GREEN" | Baseline proves value. No baseline = no proof. |
| "GREEN tasks look good, skip RED comparison" | GREEN might be good but not better than frontmatter-only. |
| "10 tasks cost too much" | 2x cost proves 2x value. Worth it. |
| "I'll just run 3 tasks instead of 5" | Patterns need 5 tasks to emerge reliably. |
| "Both failed, I'll approve anyway" | Both failing means frontmatter needs fixing. |
| "Only Δ=+1 but it looks better" | Subjective judgment not allowed. Δ≥+2 required. |

**Red Flags - STOP if you catch yourself thinking:**
- "I'll skip RED phase..."
- "GREEN looks good, no need to compare..."
- "The concept is simple, skip testing..."
- "I trust this creator, skip validation..."
- "Testing takes too long..."

**All of these mean: Go back to Step 1. Run full RED-GREEN test.**

## Success Criteria

A successful RED-GREEN test:
1. ✅ Generated 5 RED tasks (frontmatter-only)
2. ✅ Analyzed RED tasks for all 5 pattern types
3. ✅ Recorded RED scores objectively
4. ✅ Generated 5 GREEN tasks (full concept)
5. ✅ Analyzed GREEN tasks for all 5 pattern types
6. ✅ Recorded GREEN scores objectively
7. ✅ Calculated improvement delta (Δ)
8. ✅ Applied verdict criteria (PASS/MARGINAL/FAIL)
9. ✅ Provided structured report with evidence
10. ✅ Clear recommendations for next steps

## Important Notes

**This skill tests task generation quality, not:**
- Schema validation (use `check:concept` script)
- Frontmatter structure (use `review-concept` skill)
- Curriculum alignment (use `review-concept` skill)
- Translations (use `review-concept` skill)

**Real AI generation is required:**
- Don't simulate what tasks "would" look like
- Generate actual tasks with actual AI
- Cost is acceptable (10 tasks per concept)

**Pattern detection must be objective:**
- Use frequency thresholds (3/5 = 60% = FAIL)
- Don't rely on "seems repetitive" gut feeling
- Count actual occurrences
- Show evidence in report

**Iteration is expected:**
- First test often shows Δ=0 or Δ=+1
- Refinement is normal
- Keep testing until Δ≥+2
- Track improvements between runs
