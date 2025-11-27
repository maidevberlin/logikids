---
name: write-concept
description: Use when creating or improving educational concept files - two modes: "new" for creating concepts from curriculum research, "improve" for fixing task quality issues with before/after testing
---

# Write Concept

Two modes: creating new concepts or improving existing ones.

## Mode 1: New Concept

### Process
Before you start, you need to understand the task. So ask the user some questions if there are any preferences for the generation (country/age/subject/concept etc.)

1. **Research curriculum (MANDATORY)**
   - WebSearch: `"[country/state] [subject] curriculum [grade]"`
   - Find official education ministry documents
   - Extract: learning objectives, age expectations, difficulty progression
   - This tells you WHAT to put in the frontmatter fields

2. **Read schema**
   - `packages/backend/src/prompts/concept-schema.ts`

3. **Read field guidelines**
   - `.claude/docs/concept-rules.md`

4. **Fill frontmatter following `.claude/docs/concept-rules.md`**
   - Read the rules document for field-specific guidance
   - `version` - start at 1 for new concepts

5. **Validate**
   ```bash
   docker compose exec backend-dev bun run check:concept {subject}/{concept-name}
   ```

6. **Test prompt output**
   ```bash
   docker compose exec backend-dev bun run test:prompt --subject={subject} --concept={concept} --grade={grade} --difficulty={difficulty}
   ```
   Run 2-3 times, verify variety.

7. **Add translations**
   - `packages/frontend/public/locales/*/subjects/{subject}.json`

Done. No prompt content needed.

## Mode 2: Improve Concept

Use when task quality is poor (repetitive, off-target, etc.).

### Process

1. **Baseline test**
   - Generate 5 tasks with current concept
   - Document specific issues

2. **Add/modify prompt content**
   - Keep under 100 words
   - Address specific issues only
   - No examples (CARDINAL RULE)

3. **After test**
   - Generate 5 tasks with updated concept
   - Verify issues are resolved

4. **Validate**
   ```bash
   docker compose exec backend-dev bun run check:concept {subject}/{concept-name}
   ```

Only add prompt content if baseline shows real problems.

## Red Flags

- "I'll skip curriculum research" → You won't know what to put in fields
- "I'll add examples to help the AI" → CARDINAL RULE violation
- "Problem types look similar but different" → Not distinct enough
- "I'll add prompt content just in case" → Only if baseline fails