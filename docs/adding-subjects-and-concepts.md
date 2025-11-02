# Adding Subjects and Concepts - Quick Reference

Complete checklist of files to update when adding subjects/concepts to Logikids.

---

## Adding a New Subject

### 1. Backend Content (`packages/content/subjects/`)

**Create directory structure:**
```
{subject-id}/
├── base.md              # Subject metadata + base prompt
├── official/*.md        # Curriculum-aligned concepts
└── custom/*.md          # Custom concepts (optional)
```

**`base.md` frontmatter (required):**
```yaml
---
id: subject-id
name: Subject Name
description: Brief description
---
Base prompt template...
```

**Concept file frontmatter (required):**
```yaml
---
id: concept-id
name: Concept Name
description: One-line description
grade: 5                    # 1-13
ages: [10, 11]             # [min, max]
difficulty: medium          # easy|medium|hard
focus: Main learning area
learning_objectives:
  - Objective 1
  - Objective 2
prerequisites: []           # Optional: concept IDs required before this
example_tasks:              # Required: 3+ concrete example problems
  - "Example problem 1"
  - "Example problem 2"
  - "Example problem 3"
real_world_context: "Brief description of real-world applications"  # Required
---

# Concept Name Tasks

Brief introduction explaining what types of tasks to create.

**CRITICAL: Include 5-8+ distinct variations** to prevent repetitive task generation:

**Vary the problem structure:**
- Structure variation 1 with specific example
- Structure variation 2 with specific example
- Structure variation 3 with specific example
...

**Vary the content/context:**
- Context 1 (e.g., specific scenario)
- Context 2 (e.g., different scenario)
...

**Vary the complexity:**
- For younger ages ({{age}} < X): simpler scenarios
- For older ages ({{age}} >= X): more complex scenarios
...

Use appropriate formatting per subject (LaTeX for math/physics, tables, SVG diagrams, etc.)
```

**Why variations are critical:**
Without detailed variation instructions in the content section, the AI will generate repetitive tasks with identical problem structures. The content section teaches the AI *how* to create diverse problems, not just *what* concept to cover. Each concept should specify:
- Different problem types/structures
- Different contexts and scenarios
- Number ranges appropriate for age/difficulty
- Various question formats
- Real-world applications

### 2. Frontend Translations

**`packages/frontend/public/locales/en/common.json`** - Add to `subjects`:
```json
"subject-id": {
  "label": "Subject Name",
  "description": "Brief description"
}
```

**`packages/frontend/public/locales/de/common.json`** - Same structure, German text

**`packages/frontend/public/locales/en/subjects/{subject-id}.json`** - Create:
```json
{
  "concepts": {
    "concept-id": {
      "name": "Concept Name",
      "description": "Category"
    }
  }
}
```

**For large subjects (>30 concepts):** Split into:
- `{subject-id}-elementary.json` (grades 1-4)
- `{subject-id}-middle.json` (grades 5-8)
- `{subject-id}-high.json` (grades 9-13)

**`packages/frontend/public/locales/de/subjects/...`** - Same structure, German translations

### 3. Frontend Configuration

**`packages/frontend/src/i18n/config.ts`** - Add to `ns` array:
```typescript
'subjects/your-subject-id',
// OR for split subjects:
'subjects/your-subject-id-elementary',
'subjects/your-subject-id-middle',
'subjects/your-subject-id-high',
```

**`packages/frontend/src/i18n/subjectNamespace.ts`** - If split subject, add to array:
```typescript
const SPLIT_SUBJECTS = ['math', 'german', 'english', 'your-subject-id'];
```

**`packages/frontend/src/app/subjects/SubjectCard.tsx`** - Add icon and color:

1. Import icon (line ~5):
```typescript
import { YourIcon } from 'lucide-react'
```

2. Add to `subjectIcons` (line ~14):
```typescript
'subject-id': YourIcon,
```

3. Add to `subjectColors` (line ~23):
```typescript
'subject-id': 'bg-{color}-500 hover:bg-{color}-600',
```

Available colors: `blue`, `purple`, `emerald`, `red`, `amber`, `pink`, `green`, `indigo`, `teal`, `orange`, `cyan`, `lime`, `sky`, `violet`, `fuchsia`, `rose`

Find icons: https://lucide.dev

### 4. Optional

**`packages/frontend/src/assets/{subject-id}.webp`** - Background image (1200x800px)

---

## Adding Concepts to Existing Subject

### 1. Backend
- Create `packages/content/subjects/{subject-id}/official/{concept-id}.md`
- Use concept frontmatter template from above

### 2. Frontend
Determine translation file based on grade:
- Small subject → `subjects/{subject-id}.json`
- Split subject (grades 1-4) → `subjects/{subject-id}-elementary.json`
- Split subject (grades 5-8) → `subjects/{subject-id}-middle.json`
- Split subject (grades 9-13) → `subjects/{subject-id}-high.json`

Add to both `en/` and `de/` files:
```json
"new-concept-id": {
  "name": "Concept Name",
  "description": "Category"
}
```

### 3. Restart Backend (dev only)
```bash
docker compose restart backend-dev
```

---

## Complete Checklist - New Subject

### Backend
- [ ] `packages/content/subjects/{subject-id}/base.md`
- [ ] At least one concept in `official/` or `custom/`
- [ ] All frontmatter fields valid

### Frontend Translations
- [ ] `public/locales/en/common.json` - subjects.{subject-id}
- [ ] `public/locales/de/common.json` - subjects.{subject-id}
- [ ] `public/locales/en/subjects/{subject}.json` (or split files)
- [ ] `public/locales/de/subjects/{subject}.json` (or split files)
- [ ] German translations for name + description

### Frontend Configuration
- [ ] `src/i18n/config.ts` - Add namespace(s)
- [ ] `src/i18n/subjectNamespace.ts` - If split subject
- [ ] `src/app/subjects/SubjectCard.tsx` - Import icon
- [ ] `src/app/subjects/SubjectCard.tsx` - Add to subjectIcons
- [ ] `src/app/subjects/SubjectCard.tsx` - Add to subjectColors

### Optional
- [ ] `src/assets/{subject-id}.webp` - Background image

### Verification
- [ ] Backend starts without errors
- [ ] Subject appears: `curl http://localhost:5175/api/task/subjects`
- [ ] Subject card appears on frontend
- [ ] Both languages work
- [ ] Can generate tasks

---

## Troubleshooting

**Backend validation error:**
- Read error message - shows exactly what's wrong
- Check YAML syntax in frontmatter
- Verify `ages` is `[min, max]` with 2 elements
- Verify `difficulty` is `easy`, `medium`, or `hard`

**Hot-reload not working (macOS):**
- Known Docker limitation
- Solution: `docker compose restart backend-dev`

**Subject doesn't appear:**
- Check `common.json` has subject in both en/de
- Check namespace in `i18n/config.ts`
- Check icon + color in `SubjectCard.tsx`
- Hard refresh browser (Cmd+Shift+R)

**Translations missing:**
- Verify files exist in both `en/` and `de/`
- Check concept IDs match exactly (case-sensitive)
- Check JSON syntax is valid

---

## Notes

- Backend auto-discovers subjects/concepts from markdown files
- No backend code changes needed for new concepts
- Frontend requires icon/color in `SubjectCard.tsx` for each subject
- Only translate `name` and `description` - other fields fall back to English
- See existing subjects (`logic`, `math`, `physics`) for examples
- For AI-assisted concept generation, see `docs/concept-generation-prompt.md`
