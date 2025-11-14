# Bulk Math Concepts Generation Design

**Date:** 2025-11-14
**Status:** Approved
**Scope:** Generate curriculum-aligned math concepts for grades 1-4

## Requirements

### Curriculum Standards
- **Source:** German KMK federal standards (not state-specific)
- **Grade Coverage:** Elementary school (grades 1-4)
- **Granularity:** Coarse-grained concepts (broad topics)
- **Expected Count:** 15-25 concept files total

### Constraints
- Start fresh (ignore 165 concepts in backup/)
- Use existing `generate-concept` skill for generation
- Use existing `review-concept` skill for validation (automatically invoked by generate-concept)
- All concepts must pass schema validation and CARDINAL RULE compliance

## Architecture: Single Research + Parallel Generation

### Phase 1: Research (Sequential)
**Goal:** Create comprehensive list of elementary math concepts

**Process:**
1. Spawn one general-purpose subagent
2. Research KMK federal curriculum for grades 1-4 (WebSearch/WebFetch)
3. Identify 15-25 coarse-grained concepts across all grades
4. Output structured list to `docs/math-concepts-grade1-4-list.md`

**List Format:**
```markdown
| Concept ID | Title (DE) | Title (EN) | Grade | Scope |
|------------|------------|------------|-------|-------|
| grade1-number-concepts | Zahlbegriffsentwicklung | Number Concept Development | 1 | Understanding numbers 1-20... |
```

**No skill required** - pure research and documentation task.

**Validation Checkpoint:** Review concept list before proceeding to generation.

### Phase 2: Parallel Generation (Concurrent)

**Goal:** Generate all concept.md files with automated review

**Process:**
1. Spawn N agents in parallel (one per concept from researched list)
2. Each agent uses `generate-concept` skill
3. Skill automatically handles:
   - Concept.md generation with proper frontmatter
   - Review-concept validation
   - Iteration until review passes
4. Monitor agent completion reports

**Parallelization:**
- All generation agents spawn in single message (multiple Task tool calls)
- Each works independently on assigned concept
- Wall-clock time: ~5-7 minutes total (vs. sequential: ~60+ minutes)

**Output:** 15-25 concept.md files in `packages/content/subjects/math/official/`

### Phase 3: Post-Generation Validation

**Manual Checks:**
1. Run `bun run validate:prompts` - verify schema compliance
2. Run `bun run check-translations` - ensure i18n coverage
3. Spot-check 2-3 concept files for quality
4. Git commit all new concepts together

**Success Criteria:**
- All concepts generated and reviewed successfully
- All validation checks pass
- No translation gaps
- Ready for production use

## Error Handling

### During Research
- If KMK sources unavailable: Fall back to established German curriculum references
- If concept count too low/high: Adjust granularity iteratively

### During Generation
- Each agent reports independently (success/fail)
- Failed concepts tracked separately
- Manual retry for persistent failures (rare, since generate-concept iterates internally)

### Rollback Plan
- official/ directory currently empty - easy to reset
- backup/ directory untouched as safety net
- Git reset available if needed

## Monitoring and Progress Tracking

**Research Phase:**
- "Researching KMK standards for grades 1-4..."
- "Found X concepts, creating structured list..."
- "Research complete, ready for review"

**Generation Phase:**
- "Spawned N generation agents in parallel..."
- "Concept X: Generated and reviewed successfully ✓"
- "Concept Y: Review iteration 2..."
- "Generation complete: X/N successful, Y failed (if any)"

**Final Summary:**
- Total concepts generated
- Validation results
- Any issues requiring attention
- Ready for commit

## Timeline Estimate

- **Research:** 5-10 minutes
- **Review checkpoint:** 2-3 minutes
- **Parallel generation:** 5-7 minutes (wall-clock)
- **Validation:** 2-3 minutes
- **Total:** ~15-25 minutes end-to-end

## Success Metrics

- All 15-25 concepts generated
- 100% pass rate on review-concept validation
- Schema validation passes
- Translation coverage complete
- Concepts aligned with KMK standards
