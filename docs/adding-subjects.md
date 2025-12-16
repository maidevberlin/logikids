# Adding a New Subject

Guide for adding a new subject to Logikids.

## Overview

Subjects are auto-discovered from the filesystem. No backend code changes needed - just create the content and configure the frontend.

## Quick Checklist

### Create (5 files/directories)

1. `packages/content/subjects/{subject}/base.md`
2. `packages/content/subjects/{subject}/official/*.md` (concept files)
3. `packages/frontend/src/app/common/loadingContent/{subject}.ts`
4. `packages/frontend/public/locales/en/subjects/{subject}.json`
5. `packages/frontend/public/locales/de/subjects/{subject}.json`

### Update (10 files)

1. `packages/frontend/src/app/subjects/subjectTheme.ts` - colors & icon
2. `packages/frontend/src/app/subjects/SubjectsPage.tsx` - display order
3. `packages/frontend/src/app/common/useSubjectTranslations.ts` - namespace
4. `packages/frontend/src/app/common/loadingContent/index.ts` - import & register
5. `packages/frontend/src/app/common/loadingContent/types.ts` - type definitions
6. `packages/frontend/src/app/common/loadingContent/shared.ts` - encouragement
7. `packages/frontend/public/locales/en/common.json` - subject label
8. `packages/frontend/public/locales/de/common.json` - subject label
9. `packages/frontend/public/locales/en/loading.json` - tips, facts, previews
10. `packages/frontend/public/locales/de/loading.json` - tips, facts, previews

---

## Step 1: Content Structure

### base.md

Create `packages/content/subjects/{subject}/base.md`:

```markdown
---
id: { subject }
name: Subject Name
description: Brief description of the subject
---

# Content Generation Guidelines

Instructions for AI when generating tasks for this subject...
```

### Concept Files

Create concept files in `packages/content/subjects/{subject}/official/`:

See `docs/concept-rules.md` for concept file format.

---

## Step 2: Subject Theme

Update `packages/frontend/src/app/subjects/subjectTheme.ts`:

```typescript
import { NewIcon } from 'lucide-react'

export const subjectThemes = {
  // ... existing subjects
  newsubject: {
    icon: NewIcon,
    colors: {
      bg: 'bg-emerald-500',
      hover: 'hover:bg-emerald-600',
      text: 'text-emerald-500',
      bgLight: 'bg-emerald-50',
      hoverLight: 'hover:bg-emerald-100',
      badge: 'bg-emerald-100 text-emerald-800',
      active: 'bg-emerald-100 text-emerald-800',
      glass: 'bg-emerald-500/75',
      glassBorder: 'border-emerald-300',
    },
  },
}
```

---

## Step 3: Subject Order

Update `packages/frontend/src/app/subjects/SubjectsPage.tsx`:

```typescript
const SUBJECT_ORDER = ['math', 'german', 'english', 'physics', 'logic', 'music', 'newsubject']
```

---

## Step 4: Translation Namespace

Update `packages/frontend/src/app/common/useSubjectTranslations.ts`:

```typescript
const SUBJECT_NAMESPACES = [
  'subjects/math',
  // ... existing
  'subjects/newsubject',
] as const
```

---

## Step 5: Loading Content

### Create subject loading file

Create `packages/frontend/src/app/common/loadingContent/{subject}.ts`:

```typescript
import { SubjectLoadingContent } from './types'

export const newsubjectContent: SubjectLoadingContent = {
  tips: [
    'tips.newsubject.0',
    'tips.newsubject.1',
    'tips.newsubject.2',
    'tips.newsubject.3',
    'tips.newsubject.4',
    'tips.newsubject.5',
    'tips.newsubject.6',
  ],
  facts: [
    'facts.newsubject.0',
    'facts.newsubject.1',
    'facts.newsubject.2',
    'facts.newsubject.3',
    'facts.newsubject.4',
    'facts.newsubject.5',
    'facts.newsubject.6',
  ],
  previews: ['previews.newsubject.0', 'previews.newsubject.1', 'previews.newsubject.2'],
}
```

### Update index.ts

In `packages/frontend/src/app/common/loadingContent/index.ts`:

```typescript
import { newsubjectContent } from './newsubject'

export const loadingContent: LoadingContent = {
  // ... existing
  newsubject: newsubjectContent,
  encouragement,
}
```

### Update types.ts

In `packages/frontend/src/app/common/loadingContent/types.ts`:

```typescript
export interface LoadingContent {
  // ... existing
  newsubject: SubjectLoadingContent
  encouragement: Record<string, string[]>
}

export type SubjectId = 'math' | 'physics' | 'logic' | 'music' | 'german' | 'english' | 'newsubject'
```

### Update shared.ts (encouragement)

In `packages/frontend/src/app/common/loadingContent/shared.ts`:

```typescript
export const encouragement: Record<string, string[]> = {
  // ... existing
  newsubject: [
    'encouragement.newsubject.0',
    'encouragement.newsubject.1',
    'encouragement.newsubject.2',
    'encouragement.newsubject.3',
    'encouragement.newsubject.4',
    'encouragement.newsubject.5',
  ],
  fallback: [
    /* ... */
  ],
}
```

---

## Step 6: Translations

### common.json (both en/de)

Add to `subjects` object:

```json
"newsubject": {
  "label": "Subject Name",
  "description": "Brief description",
  "concepts": {
    "grade5-example": "Example Concept"
  }
}
```

### loading.json (both en/de)

Add arrays for tips, facts, previews, and encouragement:

```json
"tips": {
  "newsubject": [
    "Tip 1 text",
    "Tip 2 text"
  ]
},
"facts": {
  "newsubject": [
    "Fact 1 text",
    "Fact 2 text"
  ]
},
"previews": {
  "newsubject": [
    "Preview 1 text",
    "Preview 2 text"
  ]
},
"encouragement": {
  "newsubject": [
    "Real-life connection 1",
    "Real-life connection 2"
  ]
}
```

### subjects/{subject}.json (both en/de)

Create new file with subject-specific translations:

```json
{
  "concepts": {
    "grade5-example": {
      "name": "Example Concept"
    }
  }
}
```

---

## Content Guidelines

### Tips (5-7)

Learning strategies specific to the subject. Actionable advice students can apply.

### Facts (5-7)

Interesting trivia that makes the subject engaging. "Did you know?" style.

### Previews (2-3)

Brief excitement-builders about what they'll learn.

### Encouragement (6)

**Real-life connections.** Show how the subject applies to everyday life.

Bad: "You're doing great!"
Good: "Fractions help you split pizza fairly"

---

## No Backend Changes Needed

The `SubjectRegistry` auto-discovers subjects from the filesystem:

```
packages/content/subjects/
├── math/
├── physics/
├── newsubject/   ← Just create this
```

No database changes, no router changes, no controller changes.
