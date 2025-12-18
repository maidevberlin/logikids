# Concept Rules

Educational concept files for Logikids.

## How Task Generation Works

Understanding this flow is essential for writing effective concepts:

```
Concept File → PromptBuilder → AI Prompt → Generated Task
```

1. **Random selection**: System picks ONE `learning_objective` and ONE `problem_type` per task
2. **Difficulty lookup**: System uses the matching `difficulty_guidelines` level
3. **Prompt assembly**: Selected values are inserted into the AI prompt as bullet lists

**Critical insight**: Since objectives and problem types are selected randomly, the concept must cover ALL aspects of the topic comprehensively. Biasing toward popular niches means students miss other important areas.

For full technical details, see `.claude/docs/task-generation.md`.

## Validation Requirement

**A concept must pass the check script:**

```
docker compose exec backend-dev bun run check:concepts {subject}/{concept-name}
```

Or locally: `bun run check:concepts {subject}/{concept-name}` in `packages/backend/`

## Schema

See `packages/backend/src/prompts/concept-schema.ts`

---

## Field Impact on Task Generation

### id

**Impact:** Internal identifier for filtering and selection.

Format: `grade{X}-{concept-name}` (must match filename without `.md`)

### name

**Impact:** Inserted into prompts as `[[concept_name]]`. Internal reference for concept identification.

**Student-facing text:** The UI displays the translated name from `packages/frontend/public/locales/{lang}/subjects/{subject}.json` under `concepts.{id}.name`.

**Sync requirement:** If you change this field, update the translation files to match.

### description

**Impact:** Internal reference only. NOT used in task generation.

**Student-facing text:** The UI displays the translated description from `packages/frontend/public/locales/{lang}/subjects/{subject}.json` under `concepts.{id}.description`.

**Sync requirement:** If you change this field, update the translation files to match.

### grade

**Impact:** Primary filter for concept selection.

- **Primary**: Exact grade match (grade 4 student → grade 4 concepts)
- **Fallback**: If no concepts exist for that grade, shows all LOWER grade concepts for review

Must match the curriculum grade level for this content.

### focus

**Impact:** Inserted into prompts as `[[concept_focus]]`. Provides thematic context to the AI.

Brief phrase describing the conceptual area (e.g., "Place value and number sense").

### difficulty

**Impact:** Descriptive label shown to students. Used for filtering concepts in the UI.

The UI always sends its own difficulty parameter for task generation—this field does NOT act as a default.

One of: `easy`, `medium`, `hard`

### learning_objectives (3-7 items)

**Impact:** ONE objective is randomly selected per task and inserted as `[[selected_objective]]`.
**Critical**: Since one objective is chosen randomly with equal probability, a broad range is essential. Students will only encounter each objective proportionally—if 5 objectives exist, each appears in ~20% of tasks. Omitting objectives means students never practice those skills.

**Requirements:**

- 3-7 objectives per concept (fewer = repetitive, more = sparse coverage)
- Research official curriculum documents for your region
- Specific and measurable
- Cover the FULL scope of the concept, not just popular areas
- Ensure students will encounter ALL important skills through repeated practice

### problem_types (5-10 items)

**Impact:** ONE type is randomly selected per task and inserted as `[[selected_problem_type]]`.
**Critical**: Each type defines a DIFFERENT task structure. The AI generates tasks matching the selected type. If you have 10 types but 5 are variations of "calculation", those dominate. Ensure genuine variety.

**Requirements:**

- 1-3 words each
- Distinct structures (not overlapping)
- Cover ALL ways students encounter this concept

**Bad:** "Easy addition", "Hard addition" (difficulty, not structure)
**Good:** "Missing addend", "Sum verification", "Chain calculation" (distinct structures)

### difficulty_guidelines

**Impact:** Indexed by difficulty level (easy/medium/hard), inserted as `[[difficulty_guidelines]]` (bullet list).

**Requirements:**

- Concrete, scalable criteria (not vague labels like "simple" or "hard")
- Clear progression from easy → hard
- Max 3 bullet points per level

### prerequisites

**Impact:** Informational. The UI will display these as navigation links so students can review foundational concepts.

**Formats:**

- `concept-id` — same subject (matches any concept with that ID)
- `subject/concept-id` — cross-subject (explicit subject reference)

Each ID must reference an existing concept. The validation script checks this and fails if any prerequisite does not exist. To find existing concepts, check `packages/content/subjects/{subject}/official/` and `custom/`.

### real_world_context (required, 10-15 items)

**Impact:** ONE context is randomly selected per task and inserted as `[[real_world_context]]`. This is the primary driver for task variety and engagement.

**Requirements:**

- 10-15 items, each describing a distinct scenario
- Each item should be a complete sentence or phrase
- Maximize variety: mix everyday situations, historical periods, fantasy worlds, nature, professions, cultures, and adventures
- Think beyond the obvious - surprise and delight students with unexpected but relatable contexts

### anti_patterns (required, 3-5 items)

**Impact:** Inserted as `[[anti_patterns]]`. Tells the AI what to AVOID when generating tasks.

**Purpose:** Prevent common generation mistakes specific to this concept. Critical for task quality - concepts without anti_patterns often generate tasks with predictable errors.

**Requirements:**

- 3-5 items required
- Each item under 80 characters
- Specific and actionable (not vague warnings)
- Cover common mistakes the AI makes for this concept type

**Types of anti-patterns to include:**

- **Scope errors:** "Avoid numbers larger than 20" (grade-inappropriate difficulty)
- **Format errors:** "Don't use decimal notation" (concept-inappropriate representation)
- **Ambiguity errors:** "Avoid word problems with multiple valid interpretations"
- **Pedagogy errors:** "Don't combine addition and subtraction in the same problem"
- **Context errors:** "Avoid scenarios unfamiliar to 7-year-olds"

**Bad:** "Don't make it too hard" (vague, not actionable)
**Good:** "Avoid fractions with denominators larger than 12" (specific constraint)

### version / version_notes

**Impact:** Tracking only. Not used in task generation.

Increment version when making significant changes. Notes explain what changed.

---

## Prompt Content (Body)

Optional markdown body after frontmatter. Leave empty unless fine-tuning is needed.

**When to use:**

- Quality issues with generated tasks
- Concept-specific constraints the AI misses
- Clarifications not expressible in frontmatter fields

**Limit:** Under 100 words.

**Handlebars variables:** `{{grade}}`, `{{difficulty}}`, `{{concept_name}}`, `{{concept_focus}}`

**Conditionals:** `{{#if (lt grade 4)}}...{{/if}}`, `{{#if (eq difficulty "hard")}}...{{/if}}`

---

## CARDINAL RULE

**No example code. No example answers.**

Describe WHAT to create, not HOW. The AI should generate novel tasks, not copy examples.

---

## Coverage Principle

**Every concept must cover its FULL curriculum scope.**

Since `learning_objectives` and `problem_types` are randomly selected with equal probability:

- 5 objectives = each has 20% chance per task
- 10 problem types = each has 10% chance per task

If you bias toward popular topics, students rarely practice other areas. A well-designed concept ensures students encounter ALL aspects through repeated practice.

**Before finalizing a concept:**

1. Review official curriculum standards
2. List ALL objectives and problem structures
3. Verify no major area is missing
4. Ensure types are genuinely distinct (not overlapping)

---

## Filename

`grade{X}-{concept-name}.md` in `packages/content/subjects/{subject}/official/`

The `id` field must match the filename (without `.md`).

---

## Language

**All concept content must be written in English.**

This includes: `name`, `description`, `learning_objectives`, `problem_types`, `difficulty_guidelines`, `real_world_context`, `anti_patterns`, and any prompt body content.

**Why:** Concepts are base templates processed by the AI. The AI translates to the student's language during task generation. Non-English concepts cause inconsistent translations and prompt confusion.

**Translations for UI:** Come from `packages/frontend/public/locales/{lang}/subjects/{subject}.json`, not from the concept file.

---

## Common Rationalizations

| Thought                                                       | Reality                                                                                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| "The validator shows a WARNING, I'll focus on the FAIL first" | Fix ALL issues in one pass. WARNINGs become problems later. The validator output tells you everything needed to fix in one iteration. |
| "I checked and the prerequisites exist, so they're fine"      | Verify HOW the system checks existence. Don't assume your mental model matches the implementation.                                    |
| "Let me present my findings first before making changes"      | "Review and fix" means do both. Present the summary AFTER fixing. Asking for approval on obvious fixes wastes time.                   |
