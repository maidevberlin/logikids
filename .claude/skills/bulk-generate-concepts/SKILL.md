---
name: bulk-generate-concepts
description: Use when generating multiple curriculum-aligned concept files in parallel (5+ concepts) - researches curriculum, creates concept list, spawns parallel generation agents, orchestrates review loop until all pass
---

# Bulk Generate Concepts

## Process

1. **Clarify scope** - Subject, grades, curriculum standard (e.g., German Rahmenlehrplan)

2. **Research curriculum ONCE** - Use official sources (ministry sites). Extract:
   - Learning objectives per concept
   - Age-appropriate expectations
   - Difficulty progression
   - Key terminology

   Save to `docs/{subject}-curriculum-research.md` with:
   - Concept list (IDs, titles, grades, scope)
   - Extracted curriculum details per concept
   - Source URLs

   Get user approval on concept list.

3. **Spawn parallel agents** - One Task tool call per concept:
   ```
   Create concept: {subject}/{concept-id} (Grade {grade})

   1. Read `.claude/docs/concept-rules.md` first
   2. Use write-concept skill
   3. Reference `docs/{subject}-curriculum-research.md` for curriculum context

   Scope: {one-sentence scope description}
   ```

   **Do NOT paste curriculum content into agent prompts.** Agents read the research doc themselves. Keep prompts minimal.

4. **Verify files exist** - Check that concept files were actually created. Agents may report success without writing files.

5. **Validate** - Run `docker compose exec backend-dev bun run check:concept {subject}/{id}` for each. If failures, resume agents with fixes.

6. **Commit** - Stage all concept files + translations, commit with summary.

7. **Cleanup** - Delete `docs/{subject}-curriculum-research.md` after successful commit.

## Constraints

- Max 8-10 concepts per grade (consolidate if curriculum suggests more)
- Subagents read write-concept skill themselves - don't duplicate rules
- Research happens ONCE in parent, not per-agent (saves tokens)