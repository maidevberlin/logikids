# Concept Check CLI Tool Design

**Date:** 2025-11-20
**Purpose:** Automated pre-review validation tool for educational concept files

## Overview

Create `concept-check.ts` CLI tool that automates mechanical validation checks from the review-concept skill. This is a comprehensive pre-review tool that shows all issues at once, allowing concept creators to fix problems before human review.

## Goals

- Automate all mechanical checks from review-concept skill
- Provide clear, actionable feedback with line numbers
- Match the structured feedback format expected by reviewers
- Serve as quality gate before human review

## Non-Goals

- Curriculum research verification (requires human judgment)
- Auto-fixing issues (guidance only)
- Interactive step-by-step wizard
- CI/CD integration (future enhancement)

## Architecture

### Command Structure

```bash
# From repo root
bun run check-concept packages/content/subjects/math/official/grade5-fractions.md

# From backend directory
cd packages/backend
bun run src/cli/concept-check.ts ../../packages/content/subjects/math/official/grade5-fractions.md
```

### Checker Modules

Each checker is responsible for one validation concern:

1. **SchemaChecker** - Validates YAML frontmatter against `conceptFrontmatterSchema`
2. **FilenameChecker** - Verifies `grade{X}-{name}.md` pattern matches frontmatter grade
3. **ContentChecker** - Scans markdown for code examples (CARDINAL RULE)
4. **StructureChecker** - Counts problem structure sections (needs 5-10)
5. **TemplateChecker** - Verifies `{{age}}` and `{{difficulty}}` usage
6. **TranslationChecker** - Validates translation files exist for all languages

### Checker Result Structure

```typescript
interface CheckResult {
  status: 'pass' | 'fail' | 'warning';
  issues: Array<{
    line?: number;
    message: string;
    fix: string;
    reference?: string; // e.g., "generate-concept lines 70-87"
  }>;
}
```

## Implementation Details

### SchemaChecker

- Import `conceptFrontmatterSchema` from `src/prompts/schemas.ts`
- Parse YAML frontmatter using `gray-matter` library
- Use Zod's `.safeParse()` to validate
- Format field-specific errors clearly

### FilenameChecker

- Extract grade from frontmatter
- Pattern: `grade{X}-{kebab-case-name}.md`
- Verify X equals grade field value
- Check concept name is kebab-case (lowercase, hyphens only)

### ContentChecker (CARDINAL RULE)

Scan markdown content for forbidden patterns:
- SVG tags: `<svg`, `</svg>`
- LaTeX delimiters: `$$`, `\[`, `\]`
- Code blocks with math
- Numerical examples: `/\d+\s*[+\-*/=]\s*\d+/`

Report line numbers for each violation.

### StructureChecker

- Count distinct problem structure descriptions
- Look for markdown headers or bullets under problem variation sections
- Required: 5-10 structures
- Heuristic-based (may need tuning)

### TemplateChecker

- Search for `{{age}}` and `{{difficulty}}` template variables
- Verify presence in scaffolding descriptions
- Warning (not critical) if missing

### TranslationChecker

- Extract concept ID and subject from frontmatter
- Load `packages/frontend/public/locales/{lang}/subjects/{subject}.json`
- Verify `concepts.{id}.name` and `concepts.{id}.description` exist
- Check alphabetical sorting (warning only)
- Report missing languages

## Output Format

```
🔍 Checking concept: grade5-fractions.md

═══════════════════════════════════════════════════════
SCHEMA VALIDATION
═══════════════════════════════════════════════════════
✅ PASS - All required fields present and valid

═══════════════════════════════════════════════════════
FILENAME CONVENTION
═══════════════════════════════════════════════════════
✅ PASS
  Actual: grade5-fractions.md
  Expected: grade{5}-*.md
  Grade field: 5

═══════════════════════════════════════════════════════
CARDINAL RULE - No Example Code
═══════════════════════════════════════════════════════
❌ FAIL - Found 2 violations
  Line 45: SVG code snippet detected
  Line 67: Numerical example "3/4 + 1/2 = 5/4"
  Fix: Remove all code examples. Describe problem structures instead.
  See: generate-concept SKILL.md lines 70-87

═══════════════════════════════════════════════════════
PROBLEM STRUCTURE VARIETY
═══════════════════════════════════════════════════════
⚠️  WARNING
  Found: 3 problem structures
  Required: 5-10
  Fix: Add 2-7 more distinct problem structure descriptions
  See: generate-concept SKILL.md lines 92-93

═══════════════════════════════════════════════════════
TRANSLATIONS
═══════════════════════════════════════════════════════
❌ FAIL - 1 language missing
  ✅ de: Found in subjects/math.json
  ❌ en: Missing key "concepts.fractions"
  Fix: Add translations to packages/frontend/public/locales/en/subjects/math.json

═══════════════════════════════════════════════════════
FINAL RESULT: ❌ FAIL (2 critical issues, 1 warning)
═══════════════════════════════════════════════════════
```

### Color Coding

- ✅ Green: PASS
- ❌ Red: FAIL (critical)
- ⚠️  Yellow: WARNING (non-blocking)

### Exit Codes

- 0: All checks pass
- 1: At least one critical failure
- Warnings don't affect exit code

## Error Handling

- File not found: Clear error with suggested path format
- Invalid YAML: Show parsing error with line number
- Missing translation files: List existing languages
- Malformed frontmatter: Specific Zod validation errors
- Non-concept files: Skip base.md gracefully

## Dependencies

All already in backend package.json:
- `gray-matter`: YAML frontmatter parsing
- `zod`: Schema validation
- Built-in `fs`, `path`: File operations

No new dependencies needed.

## Integration

### Package.json Script

```json
{
  "scripts": {
    "check-concept": "cd packages/backend && bun run src/cli/concept-check.ts"
  }
}
```

### File Location

- Script: `packages/backend/src/cli/concept-check.ts`
- Working directory: `packages/backend/`
- Paths: Relative to repo root

### Usage Workflow

```bash
# Create concept file
vim packages/content/subjects/math/official/grade5-fractions.md

# Check it
bun run check-concept packages/content/subjects/math/official/grade5-fractions.md

# Fix issues, re-check
bun run check-concept packages/content/subjects/math/official/grade5-fractions.md

# When all checks pass, request human review
```

## Future Enhancements

- Batch checking: `bun run check-concept subjects/math/official/*.md`
- Pre-commit hook integration
- CI/CD pipeline integration
- Auto-fix mode for simple issues (filename, translation sorting)
- JSON output mode for programmatic use

## Success Criteria

1. ✅ Catches all mechanical issues from review-concept skill
2. ✅ Output format matches review-concept expectations
3. ✅ Clear actionable feedback with line numbers
4. ✅ Zero false positives on existing valid concepts
5. ✅ Runs in under 1 second per concept
6. ✅ Can be used by concept creators before requesting review
