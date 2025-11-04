# Unified Subject-Concept Selector Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace separate subject and concept Select components in TaskPageHeader with a unified dropdown selector featuring master-detail interaction pattern.

**Architecture:** Single Popover component with trigger badge showing current selection. Opens to reveal side-by-side subject and concept lists. Clicking subject in left column updates concept list in right column. Component is memoized and optimized for mobile touch interactions.

**Tech Stack:** React 18, TypeScript, shadcn/ui (Popover, Button, ScrollArea, Separator), Tailwind CSS v4, React i18next

**Design Document:** `docs/plans/2025-11-04-unified-subject-concept-selector.md`

---

## Task 1: Add Translation Keys

**Files:**
- Modify: `packages/frontend/public/locales/en/common.json`
- Modify: `packages/frontend/public/locales/de/common.json`

**Step 1: Add English translation keys**

Add to `packages/frontend/public/locales/en/common.json` in the `task` section:

```json
"task": {
  "selectSubjectConcept": "Select subject and concept",
  "subjects": "Subjects",
  "concepts": "Concepts",
  "conceptsFor": "Showing concepts for {{subject}}"
}
```

**Step 2: Add German translation keys**

Add to `packages/frontend/public/locales/de/common.json` in the `task` section:

```json
"task": {
  "selectSubjectConcept": "Fach und Konzept auswählen",
  "subjects": "Fächer",
  "concepts": "Konzepte",
  "conceptsFor": "Zeige Konzepte für {{subject}}"
}
```

**Step 3: Verify translations load**

Run: `docker compose exec frontend-dev bun run dev`
Open: `http://localhost:5153`
Expected: No translation errors in console

**Step 4: Commit**

```bash
git add packages/frontend/public/locales/en/common.json packages/frontend/public/locales/de/common.json
git commit -m "feat: add translation keys for unified selector"
```

---

## Task 2: Create Types File

**Files:**
- Create: `packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/types.ts`

**Step 1: Create directory**

Run: `mkdir -p packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector`

**Step 2: Create types file**

Create `packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/types.ts`:

```typescript
import { Subject, Concept } from '@/api/logikids'

export interface UnifiedSubjectConceptSelectorProps {
  subject: string
  concept?: string
  subjects: Subject[]
  onSubjectChange: (subject: string) => void
  onConceptChange: (concept: string) => void
}

export interface SubjectListProps {
  subjects: Subject[]
  currentSubject: string
  previewSubject: string
  onSubjectClick: (subjectId: string) => void
  onSubjectHover: (subjectId: string) => void
}

export interface ConceptListProps {
  subject: string
  concepts: Concept[]
  currentConcept?: string
  onConceptClick: (conceptId: string) => void
}
```

**Step 3: Verify TypeScript compiles**

Run: `docker compose exec frontend-dev bun run tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/types.ts
git commit -m "feat: add types for unified selector"
```

---

## Task 3: Create SubjectList Component

**Files:**
- Create: `packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/SubjectList.tsx`

**Step 1: Create SubjectList component**

Create `packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/SubjectList.tsx`:

```typescript
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Calculator,
  Brain,
  Atom,
  Languages,
  Music,
  BookOpen
} from 'lucide-react'
import { SubjectListProps } from './types'

const subjectIcons: Record<string, typeof Calculator> = {
  math: Calculator,
  logic: Brain,
  physics: Atom,
  german: Languages,
  english: BookOpen,
  music: Music,
}

const subjectBgStyles: Record<string, string> = {
  math: 'bg-blue-50 hover:bg-blue-100',
  logic: 'bg-purple-50 hover:bg-purple-100',
  physics: 'bg-emerald-50 hover:bg-emerald-100',
  german: 'bg-red-50 hover:bg-red-100',
  english: 'bg-amber-50 hover:bg-amber-100',
  music: 'bg-pink-50 hover:bg-pink-100',
}

const subjectActiveStyles: Record<string, string> = {
  math: 'bg-blue-100 text-blue-800 font-medium',
  logic: 'bg-purple-100 text-purple-800 font-medium',
  physics: 'bg-emerald-100 text-emerald-800 font-medium',
  german: 'bg-red-100 text-red-800 font-medium',
  english: 'bg-amber-100 text-amber-800 font-medium',
  music: 'bg-pink-100 text-pink-800 font-medium',
}

export const SubjectList = memo(function SubjectList({
  subjects,
  currentSubject,
  previewSubject,
  onSubjectClick,
  onSubjectHover,
}: SubjectListProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase px-3">
        {t('task.subjects')}
      </h3>
      <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
        <div className="flex flex-col gap-2" role="listbox" aria-label={t('task.subjects')}>
          {subjects.map((subject) => {
            const Icon = subjectIcons[subject.id] || BookOpen
            const isActive = currentSubject === subject.id
            const isPreviewing = previewSubject === subject.id

            return (
              <Button
                key={subject.id}
                variant="ghost"
                role="option"
                aria-selected={isActive}
                className={`
                  justify-start gap-2 px-3 py-2.5 h-auto rounded-xl
                  ${isActive ? subjectActiveStyles[subject.id] : ''}
                  ${!isActive && isPreviewing ? subjectBgStyles[subject.id] : ''}
                  ${!isActive && !isPreviewing ? 'hover:bg-gray-50' : ''}
                `}
                onClick={() => onSubjectClick(subject.id)}
                onMouseEnter={() => onSubjectHover(subject.id)}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  {t(`subjects.${subject.id}.label`, { defaultValue: subject.name })}
                </span>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
})
```

**Step 2: Verify TypeScript compiles**

Run: `docker compose exec frontend-dev bun run tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/SubjectList.tsx
git commit -m "feat: add SubjectList component"
```

---

## Task 4: Create ConceptList Component

**Files:**
- Create: `packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/ConceptList.tsx`

**Step 1: Create ConceptList component**

Create `packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/ConceptList.tsx`:

```typescript
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getSubjectNamespace } from '@/i18n/subjectNamespace'
import { ConceptListProps } from './types'

export const ConceptList = memo(function ConceptList({
  subject,
  concepts,
  currentConcept,
  onConceptClick,
}: ConceptListProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase px-3">
        {t('task.concepts')}
      </h3>
      <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
        <div className="flex flex-col gap-2" role="listbox" aria-label={t('task.concepts')}>
          {/* Random option */}
          <Button
            variant="ghost"
            role="option"
            aria-selected={!currentConcept || currentConcept === 'random'}
            className={`
              justify-start px-3 py-2.5 h-auto rounded-xl
              ${!currentConcept || currentConcept === 'random' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}
            `}
            onClick={() => onConceptClick('random')}
          >
            <span className="text-sm">{t('task.randomConcept')}</span>
          </Button>

          {/* Concept list */}
          {concepts.map((concept) => {
            const isActive = currentConcept === concept.id
            const namespace = getSubjectNamespace(subject, concept.grade)

            return (
              <Button
                key={concept.id}
                variant="ghost"
                role="option"
                aria-selected={isActive}
                className={`
                  justify-start px-3 py-2.5 h-auto rounded-xl
                  ${isActive ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}
                `}
                onClick={() => onConceptClick(concept.id)}
              >
                <span className="text-sm">
                  {t(`${namespace}:concepts.${concept.id}.name`, {
                    defaultValue: concept.name,
                  })}
                </span>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
})
```

**Step 2: Verify TypeScript compiles**

Run: `docker compose exec frontend-dev bun run tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/ConceptList.tsx
git commit -m "feat: add ConceptList component"
```

---

## Task 5: Create Main UnifiedSubjectConceptSelector Component

**Files:**
- Create: `packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/UnifiedSubjectConceptSelector.tsx`
- Create: `packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/index.ts`

**Step 1: Create main component**

Create `packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/UnifiedSubjectConceptSelector.tsx`:

```typescript
import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Calculator,
  Brain,
  Atom,
  Languages,
  Music,
  BookOpen
} from 'lucide-react'
import { getSubjectNamespace } from '@/i18n/subjectNamespace'
import { SubjectList } from './SubjectList'
import { ConceptList } from './ConceptList'
import { UnifiedSubjectConceptSelectorProps } from './types'

const subjectIcons: Record<string, typeof Calculator> = {
  math: Calculator,
  logic: Brain,
  physics: Atom,
  german: Languages,
  english: BookOpen,
  music: Music,
}

const subjectBadgeStyles: Record<string, string> = {
  math: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border-0',
  logic: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border-0',
  physics: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border-0',
  german: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border-0',
  english: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border-0',
  music: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800 border-0',
}

export function UnifiedSubjectConceptSelector({
  subject,
  concept,
  subjects,
  onSubjectChange,
  onConceptChange,
}: UnifiedSubjectConceptSelectorProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [previewSubject, setPreviewSubject] = useState(subject)

  // Find current subject and its concepts
  const currentSubject = useMemo(
    () => subjects.find((s) => s.id === subject),
    [subjects, subject]
  )

  // Get concepts for the preview subject (or current subject)
  const displayedConcepts = useMemo(() => {
    const targetSubject = subjects.find((s) => s.id === previewSubject)
    return targetSubject?.concepts ?? []
  }, [subjects, previewSubject])

  // Reset preview when opening
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    if (open) {
      setPreviewSubject(subject)
    }
  }, [subject])

  // Handle subject click in left column
  const handleSubjectClick = useCallback((subjectId: string) => {
    setPreviewSubject(subjectId)
  }, [])

  // Handle subject hover in left column (with debounce)
  const handleSubjectHover = useCallback((subjectId: string) => {
    setPreviewSubject(subjectId)
  }, [])

  // Handle concept click in right column
  const handleConceptClick = useCallback((conceptId: string) => {
    // If subject changed, update subject first
    if (previewSubject !== subject) {
      onSubjectChange(previewSubject)
    }
    // Update concept
    onConceptChange(conceptId)
    // Close popover
    setIsOpen(false)
  }, [previewSubject, subject, onSubjectChange, onConceptChange])

  const SubjectIcon = subjectIcons[subject] || BookOpen

  // Get concept display name
  const conceptDisplayName = useMemo(() => {
    if (!concept || concept === 'random') {
      return t('task.randomConcept')
    }
    const conceptObj = currentSubject?.concepts.find((c) => c.id === concept)
    if (!conceptObj) return concept
    const namespace = getSubjectNamespace(subject, conceptObj.grade)
    return t(`${namespace}:concepts.${concept}.name`, {
      defaultValue: conceptObj.name,
    })
  }, [concept, currentSubject, subject, t])

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-xl border-0 shadow-none hover:opacity-80 h-auto"
          aria-label={t('task.selectSubjectConcept')}
        >
          <span className={subjectBadgeStyles[subject] || subjectBadgeStyles.math}>
            <SubjectIcon className="w-4 h-4" />
            <span>
              {t(`subjects.${subject}.label`, { defaultValue: currentSubject?.name || subject })}
              {' • '}
              {conceptDisplayName}
            </span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] sm:w-[480px] lg:w-[560px] p-3 sm:p-4 rounded-2xl"
        align="center"
      >
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {/* Left column: Subjects */}
          <SubjectList
            subjects={subjects}
            currentSubject={subject}
            previewSubject={previewSubject}
            onSubjectClick={handleSubjectClick}
            onSubjectHover={handleSubjectHover}
          />

          {/* Divider */}
          <Separator orientation="vertical" className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" />

          {/* Right column: Concepts */}
          <ConceptList
            subject={previewSubject}
            concepts={displayedConcepts}
            currentConcept={concept}
            onConceptClick={handleConceptClick}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

**Step 2: Create index file**

Create `packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/index.ts`:

```typescript
export { UnifiedSubjectConceptSelector } from './UnifiedSubjectConceptSelector'
export type { UnifiedSubjectConceptSelectorProps } from './types'
```

**Step 3: Verify TypeScript compiles**

Run: `docker compose exec frontend-dev bun run tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add packages/frontend/src/app/tasks/UnifiedSubjectConceptSelector/
git commit -m "feat: add UnifiedSubjectConceptSelector main component"
```

---

## Task 6: Update TaskPageHeader to Use Unified Selector

**Files:**
- Modify: `packages/frontend/src/app/tasks/TaskPageHeader.tsx`

**Step 1: Update imports and replace Select components**

In `packages/frontend/src/app/tasks/TaskPageHeader.tsx`, make these changes:

1. Remove Select-related imports (lines 6-12):
```typescript
// DELETE THESE LINES:
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
```

2. Add UnifiedSubjectConceptSelector import:
```typescript
import { UnifiedSubjectConceptSelector } from './UnifiedSubjectConceptSelector'
```

3. Replace the subject and concept selectors (lines 100-154) with:
```typescript
      {/* Unified Subject-Concept Selector */}
      <UnifiedSubjectConceptSelector
        subject={subject}
        concept={concept}
        subjects={subjectsData?.subjects ?? []}
        onSubjectChange={onSubjectChange}
        onConceptChange={onConceptChange}
      />
```

The complete updated return statement should look like:

```typescript
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {/* Unified Subject-Concept Selector */}
      <UnifiedSubjectConceptSelector
        subject={subject}
        concept={concept}
        subjects={subjectsData?.subjects ?? []}
        onSubjectChange={onSubjectChange}
        onConceptChange={onConceptChange}
      />

      {/* Difficulty Selector */}
      <Select value={difficulty} onValueChange={(v) => onDifficultyChange(v as 'easy' | 'medium' | 'hard')}>
        <SelectTrigger className="w-auto rounded-xl border-0 shadow-none hover:opacity-80">
          <SelectValue>
            <span className={difficultyBadgeStyles[difficulty]}>
              {t(`difficulty.${difficulty}`, { defaultValue: difficulty })}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-fit">
          <SelectItem value="easy">
            <span className={difficultyBadgeStyles.easy}>
              {t('difficulty.easy', { defaultValue: 'Easy' })}
            </span>
          </SelectItem>
          <SelectItem value="medium">
            <span className={difficultyBadgeStyles.medium}>
              {t('difficulty.medium', { defaultValue: 'Medium' })}
            </span>
          </SelectItem>
          <SelectItem value="hard">
            <span className={difficultyBadgeStyles.hard}>
              {t('difficulty.hard', { defaultValue: 'Hard' })}
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
```

**Step 2: Clean up unused code**

Remove the `subjectIcons` and `subjectBadgeStyles` constants (lines 23-39) since they're now in the UnifiedSubjectConceptSelector component. Keep only `difficultyBadgeStyles`.

**Step 3: Verify TypeScript compiles**

Run: `docker compose exec frontend-dev bun run tsc --noEmit`
Expected: No errors

**Step 4: Test in browser**

Run: `docker compose exec frontend-dev bun run dev`
Open: `http://localhost:5153`
Navigate to task page
Expected: Unified selector appears, opens on click, shows subjects and concepts

**Step 5: Commit**

```bash
git add packages/frontend/src/app/tasks/TaskPageHeader.tsx
git commit -m "feat: integrate UnifiedSubjectConceptSelector into TaskPageHeader"
```

---

## Task 7: Manual Testing & Refinements

**Step 1: Test basic interaction flow**

1. Open `http://localhost:5153` in browser
2. Navigate to any task page
3. Click unified selector badge
4. Verify dropdown opens with subjects on left, concepts on right
5. Click different subjects in left column
6. Verify concepts update in right column
7. Click a concept
8. Verify navigation occurs and dropdown closes

**Step 2: Test mobile responsiveness**

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on iPhone SE (375px) viewport
4. Verify dropdown width is appropriate
5. Verify tap targets are at least 44px
6. Test on iPad (768px) viewport
7. Verify layout adjusts properly

**Step 3: Test keyboard navigation**

1. Tab to unified selector
2. Press Enter to open
3. Use arrow keys to navigate subjects
4. Press Tab to switch to concepts column
5. Use arrow keys to navigate concepts
6. Press Enter to select
7. Press Escape to close without selection

**Step 4: Test edge cases**

1. Test with "Random" concept selected
2. Test switching subjects then selecting concept
3. Test rapid clicking (debounce)
4. Test with longest subject/concept names
5. Test in German language (`localStorage.setItem('i18nextLng', 'de')`)

**Step 5: Document any issues found**

If issues found, create follow-up tasks and fix them.

**Step 6: Final commit**

```bash
git add .
git commit -m "test: manual testing complete for unified selector"
```

---

## Verification

**Success Criteria:**
- [ ] Unified selector renders as single badge when closed
- [ ] Badge shows current subject icon, name, and concept
- [ ] Clicking badge opens dropdown with 2-column layout
- [ ] Left column shows all subjects with active indicator
- [ ] Right column shows concepts for selected/hovered subject
- [ ] Clicking subject updates concept list immediately
- [ ] Clicking concept closes dropdown and navigates
- [ ] Difficulty selector remains separate
- [ ] Mobile touch targets are 44px+
- [ ] Keyboard navigation works (arrows, tab, enter, escape)
- [ ] Translations work in both English and German
- [ ] No TypeScript errors
- [ ] No runtime console errors

**Performance Checks:**
- [ ] Subject list renders <50ms
- [ ] Concept list updates <100ms when subject changes
- [ ] No unnecessary re-renders (check React DevTools Profiler)
- [ ] Smooth scrolling in columns

**Browser Testing:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Rollback Plan

If critical issues found:

```bash
# Revert all changes
git log --oneline  # Find commit before Task 1
git reset --hard <commit-sha>
git push -f origin <branch>  # If pushed
```

## Future Enhancements

Possible improvements (not in this plan):
- Add search/filter within concept list
- Add keyboard shortcuts (e.g., Ctrl+K to open)
- Add recent selections history
- Add concept descriptions on hover
- Virtualize long concept lists (if >50 concepts)
