---
name: generate-concept
description: Use when creating educational concept files or when LLM-generated tasks show repetitive patterns/copy-paste behavior - ensures curriculum-aligned frontmatter schema, prevents example code duplication through variation principles across all subjects and curricula
---

# Generate Educational Concept Files

## When to Use This Skill

Use this skill when:
- Creating new concept files for any subject (e.g., math, physics, biology, chemistry, languages, history, music, etc.)
- Converting curriculum requirements into Logikids concept format
- Ensuring generated concepts pass backend validation
- Maximizing task variety and creativity in AI-generated content

## Overview

This skill enforces strict rules for generating concept markdown files that:
1. ✅ Pass Zod schema validation in the backend
2. ✅ Avoid example code that leads to copy-paste behavior
3. ✅ Maximize task variety across multiple dimensions
4. ✅ Provide clear scaffolding for different ages and difficulty levels
5. ✅ Are completely phrased in english, so the app can translate it properly

## PART A: STRICT FRONTMATTER RULES

The frontmatter MUST be valid YAML enclosed in `---` delimiters and pass backend validation (`packages/backend/src/prompts/schemas.ts:conceptFrontmatterSchema`).

### Required Fields (MUST be present)

- **`id`** (string): kebab-case (e.g., `quadratic-functions`). No spaces, uppercase, or special chars except hyphens.
- **`name`** (string): Human-readable title (e.g., `"Quadratic Functions"`).
- **`description`** (string): Concise summary, 1-2 sentences, max 200 chars.
- **`grade`** (integer): 1-13 (German system). No decimals, strings, or out-of-range values.
- **`ages`** (tuple): Exactly 2 integers `[min, max]`, both 6-18. Min ≤ max, not single value.
- **`focus`** (string): Short phrase for learning area (e.g., `"Vectors and analytical geometry"`).
- **`difficulty`** (enum): EXACTLY one of: `easy`, `medium`, `hard`.
- **`learning_objectives`** (array): List with ≥1 string.

### Optional Fields (MAY be present)

- `prerequisites`: array of concept IDs (kebab-case strings)
- `real_world_context`: string describing applications

### Frontmatter Template

```yaml
---
id: concept-kebab-case-id
name: Concept Human Readable Name
description: Brief one-line description of the concept scope
grade: 9
ages:
  - 14
  - 16
focus: Main learning area or topic category
difficulty: medium
learning_objectives:
  - First learning objective
  - Second learning objective
  - Third learning objective
prerequisites:
  - prerequisite-concept-id
real_world_context: Real-world applications and contexts
---
```

## PART B: CREATIVE PROMPT GUIDELINES

### CARDINAL RULE: NO EXAMPLE CODE

**ABSOLUTELY FORBIDDEN:**
- ❌ Example SVG code snippets
- ❌ Example LaTeX formulas (except minimal syntax reference)
- ❌ Complete code blocks that can be copy-pasted
- ❌ Specific numerical examples that encourage reuse

**WHY:** LLMs copy examples literally, reducing creativity and producing identical tasks.

### What to Include Instead

**For SVG/Diagrams:** Describe what to show (e.g., "parabola curve with vertex marked, axis of symmetry as dashed line"), NOT code snippets.

**For LaTeX/Math:** Describe when to use formulas (e.g., "inline for variable relationships, block for main equations"), NOT actual formulas like `$$\frac{-b}{2a}$$`.

**For Numerical Values:** Describe variation principles (e.g., "multiple orders of magnitude, diverse scales, randomized"), NOT specific values like "2 kg, 20°C".

### Required Variation Dimensions

Every concept MUST specify variation across:

#### 1. Problem Structure (5-10 types)
Specify different ways to test the concept: direct calculation, reverse calculation (find unknown), comparison between scenarios, optimization, real-world applications, graphical interpretation.

#### 2. Numerical Values (variation principles)
Describe how to vary (don't list examples): multiple orders of magnitude, diverse scales (very small to very large), randomized combinations. Focus on PRINCIPLE not specific values.

**Note:** Context variety is handled by the backend variation system (`prompts/variations/`). Do NOT duplicate.

#### 3. Age-Based Complexity
- **Younger** ({{age}} < 13): Qualitative, simple calculations
- **Middle** ({{age}} 13-15): Quantitative, formulas
- **Older** ({{age}} >= 16): Multi-step, derivations

#### 4. Difficulty Scaling
- **Easy**: Direct application, given formulas
- **Medium**: Multi-step, some reasoning
- **Hard**: Complex problems, derivations

### Anti-Patterns to AVOID

#### ❌ Formulaic Language
Repetitive phrasing like "Calculate X using formula Y" in every task description

#### ❌ Copying Example Numbers
Reusing specific values from frontmatter examples instead of generating new variations

## Rationalization Prevention

This skill enforces discipline across ALL subjects. Common excuses for violating these rules:

| Excuse | Reality |
|--------|---------|
| "Just one small example won't hurt" | One example becomes the template LLM copies. Zero examples means zero. |
| "This formula/term/concept is standard, showing it is fine" | Standard formulas get copied most often. Describe usage, not the formula. |
| "The numbers are just illustrative" | Illustrative numbers become the only numbers used. Describe ranges instead. |
| "Students need to see what good [answer/diagram/code] looks like" | That's what the LLM generates. Concept shows WHAT to generate, not HOW. |
| "Curriculum research takes too long, I'll add it later" | Later never happens. Research is MANDATORY before writing. |
| "I can't find official curriculum, so I'll use my knowledge" | Ask user for clarification or alternative location. Don't guess. |
| "This is different because [subject-specific reason]" | Rules apply to ALL subjects equally (sciences, languages, arts, social studies, etc.). |
| "The variation system doesn't cover [context X]" | If missing, improve variation system. Don't duplicate in concepts. |

**Red Flags - STOP if you catch yourself thinking:**
- "I'll just include one quick example..."
- "This specific value is commonly used, so..."
- "Students won't understand without seeing..."
- "This formula is too important not to show..."
- "I can skip research for this simple topic..."

**All of these mean: Step back. Re-read CARDINAL RULE and Process section.**

### Content Structure

A complete concept includes:

1. **Opening Context** - What task generator should create
2. **Problem Type Variations** - 5-10 distinct structures
3. **Age Scaffolding** - Clear `{{age}}` differentiation
4. **Difficulty Scaling** - Explicit `{{difficulty}}` levels
5. **Format Guidance** - When to use tables/diagrams
6. **Numerical Variety** - Describe principles, not examples

## Process

When generating a concept:

1. **Interview User for Context**
   - Subject (any curriculum subject: sciences, languages, mathematics, social studies, arts, etc.)
   - Specific topic within subject
   - Target grade level
   - **Country/State** (for curriculum alignment - see authoritative sources in step 2)

2. **Research Official Curriculum Standards** (MANDATORY)
   - Use WebSearch to find official education plan for the location
   - Search for: `"[country/state] [subject] curriculum [grade level]"`
   - Examples:
     - "Germany physics curriculum grade 9"
     - "North Rhine-Westphalia mathematics standards grade 6"
     - "UK national curriculum science key stage 3"
   - Example authoritative sources:
     - Berlin grades 1-10: https://www.berlin.de/sen/bildung/unterricht/faecher-rahmenlehrplaene/rahmenlehrplaene/klasse-1-10/
     - Berlin grades 11-13: https://www.berlin.de/sen/bildung/unterricht/faecher-rahmenlehrplaene/rahmenlehrplaene/oberstufe/
     - Ministry of education websites
     - Official standards documents
   - Extract specific learning objectives for the topic
   - **If no official curriculum found:** STOP and ask user for:
     - Alternative location/state
     - Different search terms
     - Private/alternative curriculum reference

3. **Extract Metadata from Curriculum**
   - **Age range** (from grade level and education system)
   - **Difficulty level** (from curriculum complexity indicators)
   - **Curriculum standards** (MANDATORY - specific standards/competencies)
   - Learning objectives (from official documents)
   - Prerequisites (from curriculum progression)

4. **Create Frontmatter**
   - Use strict YAML format from Part A
   - Populate with curriculum-aligned data
   - Ensure `grade`, `ages`, `difficulty` match research
   - Include curriculum standards in `real_world_context` or `learning_objectives`

5. **Write Creative Prompt**
   - Apply Part B guidelines (describe, don't demonstrate)
   - Specify variation across 4 dimensions (structure, numbers, age, difficulty)
   - Include anti-patterns to avoid
   - Align with curriculum objectives

6. **Quality Check**
   - [ ] Frontmatter valid YAML with all required fields
   - [ ] Curriculum standards researched and documented
   - [ ] No SVG/LaTeX code examples
   - [ ] 5-10 problem structures described
   - [ ] Clear age scaffolding with `{{age}}`
   - [ ] Clear difficulty scaling with `{{difficulty}}`
   - [ ] Numerical variation principles described (no fixed values)
   - [ ] Aligned with official curriculum

7. **Save and Validate**
   - Save to `packages/content/subjects/{subject}/official/{id}.md`
   - Run `bun run validate:prompts` to check schema

8. **Add Translations**
   - List all language directories: `packages/frontend/public/locales/*/subjects/`
   - Read existing translation structure from any language file to understand format
   - Add concept entry to **ALL** language files: `packages/frontend/public/locales/*/subjects/{subject}.json`
   - Entry format (use concept `id` from frontmatter as key):
     ```json
     "concepts": {
       "{id}": {
         "name": "Concept Name (translated to language)",
         "description": "Concept description (translated to language)"
       }
     }
     ```
   - Translate `name` and `description` to the appropriate language for each file (en → English, de → German, etc.)
   - Preserve existing JSON structure and formatting
   - Alphabetically sort concept keys within the file

9. **Review and Iterate**
   - **Dispatch review subagent**: Use Task tool to launch review-concept skill
     - Provide concept file path to reviewer
     - Wait for review feedback
   - **If FAIL**: Fix issues identified by reviewer, re-validate, and re-submit for review
   - **Iterate until PASS**: Continue fixing and re-reviewing until approved
   - Only proceed when reviewer says "APPROVED - ready to merge"

## Key Reminders

- **Frontmatter = STRICT** (machine-parsable schema)
- **Content = CREATIVE** (maximize variety)
- **Never provide code examples** (describe what to create)
- **Vary across 4 dimensions** (structure, numbers, age, difficulty)
- **Context variety** handled by backend variation system (don't duplicate)
- **Curriculum research** is MANDATORY (not optional)
- **Think like curriculum designer** (educational progression)
- **Validate before committing** (backend schema check)

## Success Criteria

A successful concept:
1. ✅ Passes `bun run validate:prompts`
2. ✅ Based on official curriculum standards research
3. ✅ Contains zero code examples
4. ✅ Specifies 5-10 problem structures
5. ✅ Describes numerical variation principles (no fixed examples)
6. ✅ Has clear age/difficulty scaffolding
7. ✅ Provides variation guidance for all parameters
8. ✅ Translations added to all language files with proper translations
9. ✅ Approved by review-concept subagent (no outstanding issues)