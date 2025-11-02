# Concept Enhancement Plan

**Date:** 2025-11-02
**Goal:** Systematically enhance all 285 concepts with content/prompts, example_tasks, and real_world_context

## Current State

- **Total Concepts:** 285
- **All Missing:** Content/prompt sections (critical!)
- **Categories:**
  - Category 1 (Nearly Complete): 19 concepts - need content only
  - Category 2 (Partial): 63 concepts - need content + 1 field
  - Category 3 (Minimal): 203 concepts - need content + 2 fields

See: `docs/plans/2025-11-02-concept-inventory.md` for full details

## Strategy: Phased Parallel Execution

### Phase 1: Quick Wins (Priority 1)
**Target:** 19 Category 1 concepts
**Strategy:** 4-5 parallel subagents, each handling one subject's concepts
**Time Estimate:** 2-3 hours

**Subjects:**
- Logic: 4 concepts (deductive, patterns, sequences, analogical)
- Music: 2 concepts (rhythm, melody)
- Physics: 3 concepts (mechanics, waves, matter)
- Math: 10 concepts (various grade5/grade6 concepts)

**Batch Approach:**
1. Batch 1a: Logic + Music (6 concepts) - 2 subagents in parallel
2. Batch 1b: Physics + Math subset (13 concepts) - 3 subagents in parallel

### Phase 2: High-Value Category 2 (Priority 2)
**Target:** Math Category 2 concepts (~49 concepts)
**Strategy:** 8-10 parallel subagents, each handling 5-6 concepts
**Time Estimate:** 6-8 hours

**Why Math first:** Math has good structure already (49/109 in Category 2)

**Batch Approach:**
- Group by grade level (grade3, grade4, grade5, etc.)
- Each subagent handles one grade's concepts
- Run 4-5 subagents in parallel per batch

### Phase 3: German & English (Priority 3)
**Target:** Remaining Category 2 + select Category 3
**Strategy:** Focus on most common/curriculum-aligned concepts first
**Time Estimate:** 10-15 hours

**Approach:**
- German: Focus on official/ concepts first (curriculum-aligned)
- English: Focus on common grammar/vocabulary concepts
- Skip rarely-used custom concepts for now

### Phase 4: Remaining Concepts (Priority 4)
**Target:** Long-tail Category 3 concepts
**Strategy:** On-demand enhancement as needed
**Time Estimate:** Ongoing

## Subagent Task Template

Each subagent receives:
```
Subject: {subject}
Concepts to enhance: [{concept1}, {concept2}, ...]

For each concept:
1. Read existing frontmatter
2. Add content section with:
   - Concept-specific prompt variations
   - Problem structure variations
   - Number range variations
   - Context variations
3. Add example_tasks (if missing)
4. Add real_world_context (if missing)

Guidelines:
- Follow subject's base.md content guidelines
- Create 5-8 distinct problem variations
- Use {{placeholders}} for dynamic values
- Keep appropriate for grade/age level
- Ensure variety in scenarios/contexts
```

## Quality Gates

- ✅ Each concept has content section
- ✅ Content includes 5+ distinct variations
- ✅ example_tasks array has 3+ examples
- ✅ real_world_context is meaningful
- ✅ Appropriate for grade/age/difficulty level
- ✅ Follows subject content guidelines (LaTeX, Markdown, etc.)

## Success Metrics

- **Phase 1:** All 19 Category 1 concepts complete
- **Phase 2:** All Math concepts enhanced
- **Phase 3:** German/English core concepts enhanced
- **Phase 4:** 90%+ concepts have content

## Rollback Plan

- Each phase works on separate concept files
- Git commit after each successful batch
- Can revert individual files if needed

## Next Steps

1. ✅ Create this plan
2. Execute Phase 1, Batch 1a (Logic + Music)
3. Review quality
4. Execute Phase 1, Batch 1b (Physics + Math subset)
5. Review before proceeding to Phase 2
