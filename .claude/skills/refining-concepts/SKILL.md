---
name: refining-concepts
description: Use when testing or refining educational concept files to improve AI task generation quality - maintains living knowledge base of known issues, auto-prunes stale patterns as AI models improve, ensures systematic refinement workflow instead of ad-hoc edits
---

# Refining Educational Concepts

## Overview

Educational concept files generate AI tasks for students. This skill provides a systematic workflow for testing concepts, tracking known issues, and refining prompts to improve task quality.

**Core principle:** Track issues as structured data, not accumulated markdown. AI models improve over time - issue tracking must adapt by pruning patterns that no longer appear.

## When to Use

**Use this skill when:**
- Testing a new educational concept file
- Refining a concept after finding quality issues
- Batch-testing multiple concepts systematically
- Updating issue tracking based on test results

**Don't use for:**
- Initial concept creation (use `generate-concept` skill)
- Schema validation only (use `review-concept` skill)
- Single task generation testing

## The Issue Tracking System

**Location:** `/Users/maik/Projects/logikids/docs/plans/concept-issues.json`

**Purpose:** Maintains current list of known issues with metadata for auto-pruning stale patterns.

**Structure:**
```json
{
  "issue_id": {
    "description": "Brief description of the issue",
    "category": "numerical_repetition|objective_coverage|visual_repetition|structural_repetition",
    "last_seen": "2025-01-23",
    "occurrences": 5,
    "total_tests_since_last_seen": 0,
    "fix_template": "Specific fix to apply in concept file",
    "examples": ["Example of issue appearing"]
  }
}
```

## Systematic Refinement Workflow

**CRITICAL: Process ONE concept at a time through ALL 6 steps.**

Even when batch testing, complete steps 1-6 for concept A, then start step 1 for concept B. No shortcuts.

### Step 1: Load Current Issue Knowledge

**BEFORE testing any concept:**

```bash
# Read the current issue tracking data
cat /Users/maik/Projects/logikids/docs/plans/concept-issues.json
```

Review active issues (occurrences > 0) to know what to look for.

### Step 2: Test the Concept

Use existing test-concept skill:

```bash
npm run check-concept packages/content/subjects/math/official/[concept-name].md
```

Or invoke `Skill(test-concept)` for detailed analysis.

### Step 3: Compare Results to Known Issues

For each known issue in the tracking data:
- **Issue appeared?** → Mark as "seen" in this test
- **Issue didn't appear?** → Mark as "not seen" in this test

For any new issues discovered:
- Add to tracking data with initial occurrence count

### Step 4: Update Issue Tracking Data

**If issue appeared:**
```json
{
  "issue_id": {
    "last_seen": "2025-01-23",  // Update to today
    "occurrences": 6,            // Increment
    "total_tests_since_last_seen": 0  // Reset counter
  }
}
```

**If issue didn't appear:**
```json
{
  "issue_id": {
    "total_tests_since_last_seen": 3  // Increment
  }
}
```

**Pruning rule:** When `total_tests_since_last_seen >= 10`, remove the issue entirely.

**Why 10?** Balances responsiveness (removes stale patterns) with stability (doesn't remove temporarily missing issues).

### Step 5: Apply Fixes (If Issues Found)

For each active issue that appeared:
1. Read the `fix_template` from tracking data
2. Apply fix to concept file
3. Re-test (1 iteration only)
4. Accept "good enough" if improvement seen

**Don't:**
- Apply fixes for issues that didn't appear
- Iterate more than 2-3 times (diminishing returns)
- Batch fixes without testing each

### Step 6: Update Progress Tracker

Update `/Users/maik/Projects/logikids/docs/plans/math-concepts-testing-plan.md`:

**In Progress Tracker section:**
```markdown
- [x] `concept-name.md` - Description ✅ **REFINED v2** (2025-01-23)
```

**In Session Log section (CONCISE entry only):**
```markdown
### 2025-01-23
- ✅ `concept-name.md` → v2 (issues found: numerical_repetition, objective_coverage)
```

**DO NOT:**
- Add detailed test results to Session Log
- Duplicate information already in issue tracking JSON
- Accumulate case-by-case details

**Lessons Learned section:** Only update if you discover a NEW general pattern not already documented.

## Quality Metrics

**Acceptable thresholds (from existing knowledge):**
- 60%+ learning objective coverage
- <20% numerical repetition
- 4+ problem structure variations
- Cost: ~$0.60 per concept test
- Time: ~3 minutes per test

**Accept "good enough"** after 2-3 refinement iterations.

## Red Flags - You're Doing It Wrong

**STOP if you catch yourself:**
- Adding detailed test results to markdown documents
- Creating new session log sections for each test
- Skipping the issue tracking JSON update
- Skipping the progress tracker update (Step 6)
- Applying fixes without checking current issue data
- Iterating 4+ times on a single concept
- Testing without first loading issue knowledge
- Batch processing files in parallel (read all 5 concepts at once)
- Jumping between concepts before completing all 6 steps

**All of these mean:** Go back to Step 1 and follow the workflow ONE concept at a time.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll update JSON later" | Later never happens. Update immediately. |
| "I'll update progress tracker at the end" | Step 6 is mandatory. Complete ALL 6 steps per concept. |
| "Batch processing is more efficient" | Parallel operations corrupt tracking. ONE concept at a time. |
| "This issue is different" | Check JSON first. Might already be tracked. |
| "Just a quick fix" | Load issue data first. Might not need this fix anymore. |
| "Detailed logs help" | Structured data helps. Narrative logs don't scale to 50+ concepts. |
| "Issue tracking is overhead" | 30 seconds now saves 30 minutes across 50 concepts. |
| "45 more to test, need to move fast" | Moving fast = following workflow. Shortcuts create rework. |

## Quick Reference

| Task | Command/Action |
|------|----------------|
| Load issues | `cat docs/plans/concept-issues.json` |
| Test concept | `npm run check-concept path/to/concept.md` |
| Update issue (seen) | Increment occurrences, update last_seen, reset counter |
| Update issue (not seen) | Increment total_tests_since_last_seen |
| Prune stale issue | Remove if total_tests_since_last_seen >= 10 |
| Update progress | Check box in Progress Tracker, add concise Session Log |

## Integration with Existing Skills

**This skill coordinates with:**
- `test-concept`: Generates tasks to detect issues
- `review-concept`: Validates schema and curriculum alignment
- `generate-concept`: Creates initial concept files

**Workflow order:**
1. `generate-concept` → Create concept
2. `review-concept` → Validate schema
3. `refining-concepts` → Test and improve (this skill)
4. Deploy concept for production use