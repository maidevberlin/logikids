---
name: bulk-generate-concepts
description: Use when generating multiple curriculum-aligned concept files in parallel (5+ concepts) - researches curriculum, creates concept list, spawns parallel generation agents with built-in review
---

# Bulk Generate Concepts

Generate multiple curriculum-aligned educational concept files efficiently using parallel agents with automated review loops.

**Core principle:** Research once → Plan comprehensively → Generate in parallel → Validate together

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
| 2. Generate | Parallel creation with review | Parse list → Spawn N parallel agents (Skill: generate-concept) | N concept.md files | 5-7m |
| 3. Validate | Production readiness | Count → Schema check → Translations → Spot-check | Validation report | 2-3m |
| 4. Commit | Git history | Stage → Commit with details → Verify | Commit hash | 1m |

**Total:** 15-25 minutes for 20-30 concepts (vs 60-90 minutes sequential)

## Prerequisites

- Subject directory exists in `packages/content/subjects/`
- **REQUIRED SUB-SKILL:** generate-concept (provides built-in review)
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

**Goal:** Generate all concept.md files in parallel with built-in review

**Steps:**

1. **Parse concept list:**
   - Extract: concept ID, titles, grade, scope, learning objectives
   - Prepare one prompt per concept

2. **Spawn agents in parallel:**
   - For each concept: Invoke Skill tool with 'generate-concept'
   - Provide: Subject, Concept ID, Titles (DE/EN), Grade, Curriculum, Scope, Learning Objectives
   - generate-concept handles: frontmatter generation, review spawning, iteration
   - Create ONE message with multiple Skill tool calls (all execute concurrently)

3. **Monitor and handle failures:**
   - Track completion status
   - Analyze failures (common: translations, CARDINAL RULE violations)
   - Fix systematic issues, regenerate with specific guidance

**Expected time:** 5-7 minutes wall-clock for 20-30 concepts

### Phase 3: Post-Generation Validation

**Goal:** Verify all concepts meet production standards

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