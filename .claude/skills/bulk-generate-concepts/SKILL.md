---
name: bulk-generate-concepts
description: Use when generating multiple curriculum-aligned concept files in parallel (5+ concepts) - researches curriculum, creates concept list, spawns parallel generation agents, orchestrates review loop until all pass
---

# Bulk Generate Concepts

Generate multiple curriculum-aligned educational concept files efficiently using parallel agents with orchestrated review loops.

**Core principle:** Research once → Plan comprehensively → Generate in parallel → Review in parallel → Iterate until perfect → Commit

**Announce at start:** "I'm using the bulk-generate-concepts skill to generate multiple concepts efficiently."

## When to Use This Skill

**Use this skill when:**
- Generating 5+ concept files for a subject
- Need comprehensive curriculum coverage
- Want parallel execution with quality gates
- Starting a new subject area or grade level range

**Don't use when:**
- Generating 1-4 concepts (use generate-concept directly)
- Concepts are unrelated to curriculum
- No clear grade/subject scope

## Quick Reference

| Phase | Goal | Key Actions | Output | Time |
|-------|------|-------------|--------|------|
| 1. Research | Authoritative concept list | Ask scope → Spawn research agent → User validates | `docs/[subject]-concepts-list.md` | 5-10m |
| 2. Generate | Parallel creation | Parse list → Spawn N parallel Task agents | N concept.md files | 5-7m |
| 2.5. Review Loop | Quality assurance | Spawn review agents → Collect failures → Regenerate → Repeat until 100% pass | All concepts pass | 3-10m |
| 3. Validate | Production readiness | Count → Schema check → Translations → Spot-check | Validation report | 2-3m |
| 4. Commit | Git history | Stage → Commit with details → Verify | Commit hash | 1m |

**Total:** 15-30 minutes for 20-30 concepts (vs 60-90 minutes sequential)

## Prerequisites

- Subject directory exists in `packages/content/subjects/`
- **REQUIRED SKILLS:**
  - generate-concept (creates concept files)
  - review-concept (validates concept files)
- User has specified: subject, grade range, curriculum standard

## The Process

### Phase 1: Research Curriculum Standards

**Goal:** Create comprehensive, authoritative concept list

**Steps:**

1. **Clarify scope** using AskUserQuestion:
   - Which curriculum standard? (e.g., German KMK, Common Core, IB)
   - Which grades? (e.g., 1-4, 5-8, 9-13)
   - Granularity? (fine-grained vs coarse-grained)

2. **Spawn research agent:**
   ```
   Use Task tool (general-purpose):
   - Research [curriculum] standards for [subject] grades [X-Y]
   - CRITICAL: Use ONLY official curriculum sources:
     * Berlin grades 1-10: https://www.berlin.de/sen/bildung/unterricht/faecher-rahmenlehrplaene/rahmenlehrplaene/klasse-1-10/
     * Berlin grades 11-13: https://www.berlin.de/sen/bildung/unterricht/faecher-rahmenlehrplaene/rahmenlehrplaene/oberstufe/
     * Ministry of education websites
     * Official state/national curriculum documents
     * NO blogs, commercial sites, TeachersPayTeachers, or unofficial educational resources
   - GRANULARITY CONSTRAINT: MAX 8-10 concepts per grade
     * If curriculum suggests more: consolidate related topics
     * Prefer coarse-grained over fine-grained
     * Example: "Arithmetic to 10" not separate "Addition to 10", "Subtraction to 10"
   - Create structured list with:
     * Concept ID (slug format)
     * Title (native language + English)
     * Grade level
     * Scope description
     * Learning objectives (2-4 per concept)
   - Save to docs/[subject]-concepts-grade[X-Y]-list.md
   - Document all official sources used (with exact URLs)
   ```

3. **Review concept list:**
   - Verify ALL sources official, MAX 8-10 concepts/grade, balanced distribution
   - Present to user: "Review concept list. Proceed with generation or modify?"
   - Wait for approval

**Output:** `docs/[subject]-concepts-grade[X-Y]-list.md`

### Phase 2: Parallel Concept Generation

**Goal:** Generate all concept.md files in parallel (WITHOUT review - review comes in Phase 2.5)

**Steps:**

1. **Parse concept list:**
   - Extract: concept ID, titles, grade, scope, learning objectives
   - Prepare one prompt per concept

2. **Spawn Task agents in parallel:**
   - Use Task tool (subagent_type='general-purpose', model='haiku')
   - Create ONE message with multiple Task tool calls (executes concurrently)
   - For each concept, provide prompt:
     ```
     Use the generate-concept skill to create concept file:
     - Subject: [subject]
     - Concept ID: [id]
     - Title (DE): [german_title]
     - Title (EN): [english_title]
     - Grade: [grade]
     - Curriculum: [curriculum_name]
     - Scope: [scope_description]
     - Learning Objectives: [objectives_list]

     Follow the generate-concept skill instructions exactly.
     CRITICAL: You CANNOT spawn review agents (no recursion). Just generate the concept file.
     ```
   - **DO NOT** ask agents to review themselves (they can't spawn sub-agents)
   - Track which concepts are being generated (use TodoWrite)

3. **Wait for completion:**
   - All agents run concurrently
   - Collect results as they complete
   - Note any immediate failures (file not created, errors reported)

**Expected time:** 5-7 minutes wall-clock for 20-30 concepts

**Output:** All concept.md files created (quality unknown until Phase 2.5)

### Phase 2.5: Review Loop (CRITICAL QUALITY GATE)

**Goal:** Achieve 100% concept pass rate through iterative review and regeneration

**Why this phase exists:** Subagents cannot spawn sub-agents (no recursion), so we orchestrate reviews from the main context.

**Steps:**

1. **Spawn review agents in parallel:**
   - Use Task tool (subagent_type='general-purpose', model='haiku')
   - Create ONE message with multiple Task tool calls (3-5 reviews per batch)
   - For each concept to review:
     ```
     Use the review-concept skill to review:
     packages/content/subjects/[subject]/official/[concept-id].md

     This is a [grade] [subject] concept that was just generated.
     Follow the review-concept skill instructions to validate schema,
     CARDINAL RULE compliance, and curriculum alignment.
     ```
   - **Batching strategy:**
     - First iteration: Review 3-5 random samples
     - If >50% fail: Review ALL concepts (issues are systematic)
     - If <50% fail: Review remaining concepts in batches

2. **Collect review results:**
   - Track PASS/FAIL for each concept
   - Extract specific issues (CARDINAL RULE violations, missing translations, schema errors)
   - Identify systematic patterns (e.g., all concepts have LaTeX formulas)

3. **Analyze failures:**
   - **CARDINAL RULE violations** (LaTeX formulas, numerical examples):
     ```
     Issue: Lines 35, 120 contain $\frac{3}{4}$ formulas
     Fix: Regenerate with "CRITICAL: NO LaTeX, NO specific numbers. Describe principles only."
     ```
   - **Translation missing:**
     ```
     Issue: Concept not in de/subjects/[subject].json
     Fix: Manually add translation entries (agents can't reliably edit JSON arrays)
     ```
   - **Too many problem structures** (>10):
     ```
     Issue: 12 structures found, should be 5-10
     Fix: Regenerate with "CRITICAL: Provide exactly 8 problem structures, consolidated."
     ```
   - **Schema errors:**
     ```
     Issue: Invalid YAML frontmatter
     Fix: Regenerate with corrected frontmatter template
     ```

4. **Regenerate failed concepts:**
   - Create NEW Task agents ONLY for failed concepts
   - Include specific guidance based on failure analysis
   - Use same prompt format as Phase 2, with added CRITICAL instructions
   - Example:
     ```
     Use the generate-concept skill to REGENERATE concept file:
     [... same parameters as Phase 2 ...]

     CRITICAL FIXES FOR THIS REGENERATION:
     - NO LaTeX formulas (like $\frac{a}{b}$), describe in words
     - NO specific numerical examples (like "2+2=4"), use principles
     - Exactly 8 problem structures, not 12
     - Ensure translations are added to BOTH language files
     ```

5. **Iterate until 100% pass:**
   - After regeneration completes, spawn review agents for those concepts
   - Repeat steps 2-4 until ALL concepts pass
   - **Maximum 3 iterations** - if still failing, manually intervene

6. **Track progress:**
   - Use TodoWrite to track review status
   - Update after each iteration: "Review iteration N: X/Y passed"

**Expected iterations:**
- Iteration 1: 60-80% pass (common issues: CARDINAL RULE, translations)
- Iteration 2: 90-95% pass (edge cases fixed)
- Iteration 3: 100% pass (rarely needed if iteration 2 was thorough)

**Expected time:** 3-10 minutes depending on failure rate

**Output:** All concepts validated as production-ready

### Phase 3: Post-Generation Validation

**Goal:** Final verification that all concepts meet production standards

1. **Run validations:**
   - Count files: `ls -1 packages/content/subjects/[subject]/official/ | wc -l`
   - Schema: `cd packages/backend && bun run validate:prompts`
   - Translations: `bun run check-translations`
   - Spot-check: Read 2-3 random files for quality

2. **Validation report:**
   ```
   Total concepts: X (matches expected)
   Schema/Translations: PASS/FAIL
   Quality: Good/Needs review
   Ready for commit: YES/NO
   ```

### Phase 4: Commit Concepts

1. **Stage files:**
   ```bash
   git add packages/content/subjects/[subject]/official/*.md \
           docs/[subject]-concepts-grade[X-Y]-list.md \
           packages/frontend/public/locales/*/subjects/[subject].json
   ```

2. **Commit:**
   ```bash
   git commit -m "Add [subject] concepts for grades [X-Y] ([curriculum])

   - Generated [N] concepts, [granularity] coverage
   - Grade distribution: [breakdown]

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

3. **Report:** `git log -1 --stat` and inform user of completion

## Common Issues and Fixes

### Translations Overwritten
Agent added translations but files show missing entries → Re-add after agents complete, alphabetically sort

### CARDINAL RULE Violations
Review fails "contains specific numerical examples" → Regenerate with "CRITICAL: variation PRINCIPLES only, NO specific values"

### Missing Curriculum Research
Review fails "curriculum research not documented" → Regenerate with "Document official sources with URLs"

### Concept Count Too High
>8-10 concepts per grade → Reject, spawn new agent with consolidation (e.g., "Addition to 10" + "Subtraction to 10" → "Arithmetic to 10")

### Unofficial Sources Used
Research uses blogs/commercial sites → Reject immediately, use ONLY: berlin.de/sen/bildung, official ministry sites, curriculum documents

## Success Criteria

- [ ] All N concepts generated
- [ ] 100% pass rate on review-concept validation
- [ ] Schema validation passes
- [ ] Translation coverage complete
- [ ] Concepts aligned with curriculum standards
- [ ] All files committed to git
- [ ] No errors or warnings