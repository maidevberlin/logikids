# Concept Rules

Educational concept files for Logikids.

## How Task Generation Works

Understanding this flow is essential for writing effective concepts:

```
Concept File → PromptBuilder → AI Prompt → Generated Task
```

1. **Random selection**: System picks ONE `learning_objective` and ONE `problem_type` per task
2. **Age resolution**: System finds highest `age_guidelines` threshold ≤ student age
3. **Difficulty lookup**: System uses the matching `difficulty_guidelines` level
4. **Prompt assembly**: Selected values are inserted into the AI prompt as bullet lists

**Age parameter**: Student age is sent by the frontend (not calculated). Backend validates that age aligns with grade (±2 years).

**Critical insight**: Since objectives and problem types are selected randomly, the concept must cover ALL aspects of the topic comprehensively. Biasing toward popular niches means students miss other important areas.

For full technical details, see `.claude/docs/task-generation.md`.

## Validation Requirement

**A concept must pass the check script:**

```
docker compose exec backend-dev bun run check:concept {subject}/{concept-name}
```

Or locally: `bun run check:concept {subject}/{concept-name}` in `packages/backend/`

## Schema

See `packages/backend/src/prompts/concept-schema.ts`

---

## Field Impact on Task Generation

### id

**Impact:** Internal identifier for filtering and selection.

Format: `grade{X}-{concept-name}` (must match filename without `.md`)

### name

**Impact:** Displayed to students when selecting concepts. Inserted into prompts as `[[concept_name]]`.

Keep it clear and descriptive.

### description

**Impact:** Shown in concept selection UI. Helps students understand what they'll practice.

One sentence summarizing the concept scope.

### grade

**Impact:** Primary filter for concept selection.

- **Primary**: Exact grade match (grade 4 student → grade 4 concepts)
- **Fallback**: If no concepts exist for that grade, shows all LOWER grade concepts for review

Must match the curriculum grade level for this content.

### ages

**Impact:** Access control. Students outside this range cannot see the concept.

- **First number**: Minimum age for this concept
- **Second number**: Maximum age (where review/practice is still useful)
- **Wider is better**: Allows older students to practice fundamentals

### focus

**Impact:** Inserted into prompts as `[[concept_focus]]`. Provides thematic context to the AI.

Brief phrase describing the conceptual area (e.g., "Place value and number sense").

### difficulty

**Impact:** Descriptive label shown to students. Used for filtering concepts in the UI.

The UI always sends its own difficulty parameter for task generation—this field does NOT act as a default.

One of: `easy`, `medium`, `hard`

### learning_objectives

**Impact:** ONE objective is randomly selected per task and inserted as `[[selected_objective]]`.
**Critical**: Since one objective is chosen randomly with equal probability, a broad range is essential. Students will only encounter each objective proportionally—if 5 objectives exist, each appears in ~20% of tasks. Omitting objectives means students never practice those skills.

**Requirements:**
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

### age_guidelines

**Impact:** System finds highest threshold ≤ student age, then inserts those guidelines as `[[age_guidelines]]` (bullet list).

**Resolution:** Keys are age thresholds. System selects guidelines from the highest threshold ≤ student age.

**Threshold rules:**
- **1-2 year span:** Single threshold only (minimum age)
- **3+ year span:** Multiple thresholds where pedagogically meaningful

**Verbosity limit:** Max 3 bullet points per threshold. These go directly into AI prompts.

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

### real_world_context

**Impact:** Inserted as `[[real_world_context]]`. Helps AI generate relatable scenarios.

Cover diverse situations where students encounter this concept—not just one narrow example.

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

**Handlebars variables:** `{{age}}`, `{{grade}}`, `{{difficulty}}`, `{{concept_name}}`, `{{concept_focus}}`

**Conditionals:** `{{#if (lt age 10)}}...{{/if}}`, `{{#if (eq difficulty "hard")}}...{{/if}}`

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