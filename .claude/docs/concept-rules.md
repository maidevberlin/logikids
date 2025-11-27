# Concept Rules

Educational concept files for Logikids.

## Validation Requirement

**A concept must pass the check script:**

```
docker compose exec backend-dev bun run check:concept {subject}/{concept-name}
```

## Schema

See `packages/backend/src/prompts/concept-schema.ts`

## Field Content Guidelines

### ages

The usability range: from ideal age to upper age where content is still valuable.

- First number = ideal age (typically matches grade + 5)
- Second number = upper age where content is useful for practice/review
- Grade determines optimal age; `ages` determines who CAN see this content

**Good:** `[9, 12]` for grade 4 content (useful for 5th/6th graders too)
**Bad:** `[9, 10]` (too narrow - only considers "on-grade" students)

### learning_objectives

Curriculum-aligned objectives. Research official curriculum documents.

**Good:** Specific, measurable, from official standards
**Bad:** Vague, made-up, not grade-appropriate

### problem_types (5-10 items)

Distinct problem structures. Each type = different kind of task.

**Good:** "Direct calculation", "Missing element", "Comparison", "Error identification"
**Bad:** "Easy problems", "More problems", "Basic tasks" (overlapping/vague)

Keep each type to 1-3 words. System selects ONE randomly per task.

### age_guidelines

Keys are age thresholds meaning "from this age onward". System finds highest threshold ≤ student age.

**Threshold rules:**
- **1-2 year span:** Single threshold only (minimum age). No separate entries.
- **3+ year span:** Multiple thresholds allowed, but only where pedagogically meaningful.

**Verbosity limit:** Max 3 bullet points per threshold.

### difficulty_guidelines

Three levels: easy, medium, hard. Must scale meaningfully.

**Verbosity limit:** Max 3 bullet points per level.

**Good:** Concrete criteria that scale (e.g., "single concept" → "combining concepts" → "multi-step with constraints")
**Bad:** "Simple" → "Medium difficulty" → "Hard" (no specifics)

### real_world_context

Where students encounter this topic in daily life. Helps generate relevant task scenarios.

**Good:** Specific, relatable situations students actually experience
**Bad:** Generic or empty

## Prompt Content

Optional. Leave empty unless you need to fine-tune task generation.

If quality issues arise, add minimal prompt content (under 100 words) to address specific problems.

## CARDINAL RULE

No example code. No example answers. Describe what to create, not how.

## Filename

`grade{X}-{concept-name}.md` in `packages/content/subjects/{subject}/official/`