# Subject/Concept Selector: Show All Feature - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable users to toggle between grade-filtered and all subjects/concepts, automatically expanding when current selection is outside filtered list.

**Architecture:** TaskPageHeader fetches both filtered (by grade) and all subjects. It detects if current concept exists in filtered list and passes both datasets to SubjectConceptSelector. SubjectConceptSelector manages local state to toggle between views. SubjectList and ConceptList components display toggle links when there are more items available.

**Tech Stack:** React 18, TypeScript, React Query, i18next, Tailwind CSS

---

## Task 1: Update Type Definitions

**Files:**
- Modify: `packages/frontend/src/app/tasks/SubjectConceptSelector/types.ts`

**Step 1: Add new props to UnifiedSubjectConceptSelectorProps**

Update the interface to accept both filtered and all subjects, plus a flag for default state:

```typescript
import { SubjectInfo, ConceptInfo } from '@/api/logikids'

export interface UnifiedSubjectConceptSelectorProps {
  subject: string
  concept?: string
  filteredSubjects: SubjectInfo[]
  allSubjects: SubjectInfo[]
  showAllByDefault: boolean
  onConceptChange: (concept: string, subject: string) => void
}

export interface SubjectListProps {
  subjects: SubjectInfo[]
  currentSubject: string
  previewSubject: string
  onSubjectClick: (subjectId: string) => void
  onSubjectHover: (subjectId: string) => void
  showAll: boolean
  hasMoreSubjects: boolean
  onToggleShowAll: () => void
}

export interface ConceptListProps {
  subject: string
  concepts: ConceptInfo[]
  currentConcept?: string
  onConceptClick: (conceptId: string) => void
  showAll: boolean
  hasMoreConcepts: boolean
  onToggleShowAll: () => void
}
```

**Step 2: Verify TypeScript compiles**

Run: `cd packages/frontend && npx tsc --noEmit`
Expected: No errors (components not updated yet, so expect errors about missing props - that's fine)

**Step 3: Commit**

```bash
git add packages/frontend/src/app/tasks/SubjectConceptSelector/types.ts
git commit -m "feat: update type definitions for show all feature

Add filteredSubjects, allSubjects, and showAllByDefault props to selector.
Add showAll, hasMoreSubjects/Concepts, and onToggleShowAll to list components.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Add Translation Keys

**Files:**
- Modify: `packages/frontend/public/locales/en/common.json`
- Modify: `packages/frontend/public/locales/de/common.json`

**Step 1: Add English translations**

In the `"task"` section (around line 108), add these new keys:

```json
"task": {
  "title": "Task",
  "difficulty": "Difficulty",
  "randomConcept": "Random",
  "getHint": "Show Hint",
  "getAnotherHint": "Show Another Hint",
  "skip": "Skip Task",
  "solutionExplanation": "Solution Explanation",
  "checkAnswer": "Check Answer",
  "nextTask": "Next Task",
  "tryAgain": "Try Again",
  "yes": "Yes",
  "no": "No",
  "selectSubjectConcept": "Select subject and concept",
  "subjects": "Subjects",
  "concepts": "Concepts",
  "conceptsFor": "Showing concepts for {{subject}}",
  "viewAll": "View All",
  "showAllSubjects": "Show all →",
  "showRecommended": "← Show recommended",
  "fillInBlanks_one": "Fill in blank #{{count}}",
```

**Step 2: Add German translations**

Find the same `"task"` section in `de/common.json` and add:

```json
"showAllSubjects": "Alle anzeigen →",
"showRecommended": "← Empfohlene anzeigen",
```

**Step 3: Commit**

```bash
git add packages/frontend/public/locales/en/common.json packages/frontend/public/locales/de/common.json
git commit -m "feat: add translations for show all toggle

Add English and German translations for 'show all' and 'show recommended' toggles.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Update SubjectList Component

**Files:**
- Modify: `packages/frontend/src/app/tasks/SubjectConceptSelector/SubjectList.tsx:10-74`

**Step 1: Update component to accept new props**

Replace the entire component (lines 10-74):

```typescript
export const SubjectList = memo(function SubjectList({
  subjects,
  currentSubject: _currentSubject,
  previewSubject,
  onSubjectClick,
  onSubjectHover,
  showAll,
  hasMoreSubjects,
  onToggleShowAll,
}: SubjectListProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-2">
      {/* Header with navigation */}
      <div className="flex items-center justify-between px-1 pb-2 border-b border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t('task.subjects')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs hover:bg-muted"
          onClick={() => navigate('/subjects')}
        >
          <Grid2x2 className="w-3.5 h-3.5 mr-1" />
          {t('task.viewAll', { defaultValue: 'View All' })}
        </Button>
      </div>

      <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
        <div className="flex flex-col gap-2" role="listbox" aria-label={t('task.subjects')}>
          {subjects.map((subject) => {
            const theme = getSubjectTheme(subject.id)
            const Icon = theme.icon
            const isActive = previewSubject === subject.id

            // Build dynamic class names based on state
            let stateClasses = ''
            if (isActive) {
              stateClasses = `${theme.colors.active} font-medium`
            } else {
              stateClasses = 'hover:bg-muted'
            }

            return (
              <Button
                key={subject.id}
                variant="ghost"
                role="option"
                aria-selected={isActive}
                className={`justify-start gap-2 px-3 py-2.5 h-auto rounded-xl ${stateClasses}`}
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

          {/* Toggle link */}
          {hasMoreSubjects && (
            <button
              onClick={onToggleShowAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 text-center w-full"
            >
              {showAll ? t('task.showRecommended') : t('task.showAllSubjects')}
            </button>
          )}
        </div>
      </ScrollArea>
    </div>
  )
})
```

**Step 2: Verify TypeScript compiles**

Run: `cd packages/frontend && npx tsc --noEmit`
Expected: Errors about SubjectConceptSelector not passing new props (expected at this stage)

**Step 3: Commit**

```bash
git add packages/frontend/src/app/tasks/SubjectConceptSelector/SubjectList.tsx
git commit -m "feat: add show all toggle to SubjectList

Add toggle button at bottom of subject list to switch between
filtered and all subjects.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Update ConceptList Component

**Files:**
- Modify: `packages/frontend/src/app/tasks/SubjectConceptSelector/ConceptList.tsx:10-82`

**Step 1: Update component to accept new props**

Replace the entire component (lines 10-82):

```typescript
export const ConceptList = memo(function ConceptList({
  subject,
  concepts,
  currentConcept,
  onConceptClick,
  showAll,
  hasMoreConcepts,
  onToggleShowAll,
}: ConceptListProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-2">
      {/* Header with navigation */}
      <div className="flex items-center justify-between px-1 pb-2 border-b border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t('task.concepts')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs hover:bg-muted"
          onClick={() => navigate(`/subjects/${subject}`)}
        >
          <List className="w-3.5 h-3.5 mr-1" />
          {t('task.viewAll', { defaultValue: 'View All' })}
        </Button>
      </div>

      <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
        <div className="flex flex-col gap-2" role="listbox" aria-label={t('task.concepts')}>
          {/* Random option */}
          <Button
            variant="ghost"
            role="option"
            aria-selected={!currentConcept || currentConcept === 'random'}
            className={`
              justify-start px-3 py-2.5 h-auto rounded-xl
              ${!currentConcept || currentConcept === 'random' ? 'bg-muted font-medium' : 'hover:bg-muted'}
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
                  ${isActive ? 'bg-muted font-medium' : 'hover:bg-muted'}
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

          {/* Toggle link */}
          {hasMoreConcepts && (
            <button
              onClick={onToggleShowAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 text-center w-full"
            >
              {showAll ? t('task.showRecommended') : t('task.showAllSubjects')}
            </button>
          )}
        </div>
      </ScrollArea>
    </div>
  )
})
```

**Step 2: Verify TypeScript compiles**

Run: `cd packages/frontend && npx tsc --noEmit`
Expected: Still errors about SubjectConceptSelector (expected)

**Step 3: Commit**

```bash
git add packages/frontend/src/app/tasks/SubjectConceptSelector/ConceptList.tsx
git commit -m "feat: add show all toggle to ConceptList

Add toggle button at bottom of concept list to switch between
filtered and all concepts.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: Update SubjectConceptSelector Component

**Files:**
- Modify: `packages/frontend/src/app/tasks/SubjectConceptSelector/SubjectConceptSelector.tsx:1-132`

**Step 1: Import useState and useEffect**

Update imports (line 1):

```typescript
import { useState, useMemo, useCallback, useEffect } from 'react'
```

**Step 2: Update component props and add state management**

Replace the component function (lines 16-63):

```typescript
export function SubjectConceptSelector({
  subject,
  concept,
  filteredSubjects,
  allSubjects,
  showAllByDefault,
  onConceptChange,
}: UnifiedSubjectConceptSelectorProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [previewSubject, setPreviewSubject] = useState(subject)
  const [showAll, setShowAll] = useState(showAllByDefault)

  // Reset showAll when subject prop changes
  useEffect(() => {
    setShowAll(showAllByDefault)
  }, [subject, showAllByDefault])

  // Determine which dataset to display
  const displayedSubjects = showAll ? allSubjects : filteredSubjects

  // Find current subject and its concepts
  const currentSubject = useMemo(
    () => filteredSubjects.find((s) => s.id === subject),
    [filteredSubjects, subject]
  )

  // Get concepts for the preview subject
  const displayedConcepts = useMemo(() => {
    const targetSubject = displayedSubjects.find((s) => s.id === previewSubject)
    return targetSubject?.concepts ?? []
  }, [displayedSubjects, previewSubject])

  // Calculate if there are more items available
  const hasMoreSubjects = allSubjects.length > filteredSubjects.length
  const hasMoreConcepts = useMemo(() => {
    const filteredSubj = filteredSubjects.find((s) => s.id === previewSubject)
    const allSubj = allSubjects.find((s) => s.id === previewSubject)
    return (allSubj?.concepts?.length ?? 0) > (filteredSubj?.concepts?.length ?? 0)
  }, [filteredSubjects, allSubjects, previewSubject])

  // Toggle handler
  const handleToggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev)
  }, [])

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

  // Handle subject hover in left column - no-op, only click changes preview
  const handleSubjectHover = useCallback((_subjectId: string) => {
    // Do nothing - concepts only change on click
  }, [])

  // Handle concept click in right column
  const handleConceptClick = useCallback((conceptId: string) => {
    // Pass both concept and subject (use preview subject if it changed)
    const targetSubject = previewSubject !== subject ? previewSubject : subject
    onConceptChange(conceptId, targetSubject)
    // Close popover
    setIsOpen(false)
  }, [previewSubject, subject, onConceptChange])
```

**Step 3: Update the JSX to pass new props**

Replace the JSX (lines 110-127):

```typescript
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {/* Left column: Subjects */}
          <SubjectList
            subjects={displayedSubjects}
            currentSubject={subject}
            previewSubject={previewSubject}
            onSubjectClick={handleSubjectClick}
            onSubjectHover={handleSubjectHover}
            showAll={showAll}
            hasMoreSubjects={hasMoreSubjects}
            onToggleShowAll={handleToggleShowAll}
          />

          {/* Divider */}
          <Separator orientation="vertical" className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" />

          {/* Right column: Concepts */}
          <ConceptList
            subject={previewSubject}
            concepts={displayedConcepts}
            currentConcept={concept}
            onConceptClick={handleConceptClick}
            showAll={showAll}
            hasMoreConcepts={hasMoreConcepts}
            onToggleShowAll={handleToggleShowAll}
          />
        </div>
```

**Step 4: Verify TypeScript compiles**

Run: `cd packages/frontend && npx tsc --noEmit`
Expected: Errors about TaskPageHeader not passing new props (expected)

**Step 5: Commit**

```bash
git add packages/frontend/src/app/tasks/SubjectConceptSelector/SubjectConceptSelector.tsx
git commit -m "feat: implement show all state management in SubjectConceptSelector

Add state to track showAll mode, toggle handler, and logic to determine
which dataset to display. Pass new props to SubjectList and ConceptList.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: Update TaskPageHeader Component

**Files:**
- Modify: `packages/frontend/src/app/tasks/TaskPageHeader.tsx:1-48`

**Step 1: Add second query for all subjects**

Update the component (lines 13-46):

```typescript
export function TaskPageHeader({
  subject,
  concept,
  onConceptChange,
}: TaskPageHeaderProps) {
  const { data: userData } = useUserData()

  // Fetch filtered subjects (by grade)
  const { data: filteredSubjects, isLoading: isLoadingFiltered } = useQuery<SubjectsResponse>({
    queryKey: ['subjects', userData?.settings.grade],
    queryFn: ({ signal }) =>
      logikids.getSubjects(
        {
          grade: userData?.settings.grade ?? 5,
        },
        signal
      ),
    enabled: !!userData,
  })

  // Fetch all subjects (no grade filter)
  const { data: allSubjects, isLoading: isLoadingAll } = useQuery<SubjectsResponse>({
    queryKey: ['subjects', 'all'],
    queryFn: ({ signal }) => logikids.getSubjects({}, signal),
    enabled: !!userData,
  })

  // Detect if current concept is in filtered list
  const showAllByDefault = useMemo(() => {
    if (!concept || !filteredSubjects) return false
    const subj = filteredSubjects.subjects.find((s) => s.id === subject)
    const conceptExists = subj?.concepts?.some((c) => c.id === concept) ?? false
    return !conceptExists
  }, [concept, subject, filteredSubjects])

  if (isLoadingFiltered || isLoadingAll) {
    return <Skeleton className="h-10 w-48" />
  }

  return (
    <SubjectConceptSelector
      subject={subject}
      concept={concept}
      filteredSubjects={filteredSubjects?.subjects ?? []}
      allSubjects={allSubjects?.subjects ?? []}
      showAllByDefault={showAllByDefault}
      onConceptChange={onConceptChange}
    />
  )
}
```

**Step 2: Add useMemo import**

Update imports (line 1):

```typescript
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useUserData } from '@/app/account'
import { logikids, SubjectsResponse } from '@/api/logikids'
import { Skeleton } from '@/components/ui/skeleton'
import { SubjectConceptSelector } from './SubjectConceptSelector'
```

**Step 3: Verify TypeScript compiles**

Run: `cd packages/frontend && npx tsc --noEmit`
Expected: No errors (all types should match now)

**Step 4: Commit**

```bash
git add packages/frontend/src/app/tasks/TaskPageHeader.tsx
git commit -m "feat: fetch both filtered and all subjects in TaskPageHeader

Add second query to fetch all subjects without grade filter.
Detect if current concept is in filtered list and pass showAllByDefault flag.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: Manual Testing

**Files:**
- N/A (testing only)

**Step 1: Start Docker development environment**

Run: `docker compose up frontend-dev backend-dev`
Expected: Frontend available at http://localhost:5153

**Step 2: Test default filtered view**

1. Navigate to a task page with a concept that matches your grade
2. Open the subject/concept selector
3. Verify you see only grade-appropriate subjects and concepts
4. Verify "Show all →" link appears at bottom of both lists (if there are more items)

**Step 3: Test clicking "Show all"**

1. Click "Show all →" at the bottom of the subject list
2. Verify all subjects are now visible
3. Verify the link changes to "← Show recommended"
4. Click a different subject
5. Verify the concept list updates
6. Verify "Show all →" appears at bottom of concept list

**Step 4: Test toggling back to recommended**

1. Click "← Show recommended" at the bottom of subject list
2. Verify only grade-appropriate subjects are shown
3. Verify the link changes back to "Show all →"

**Step 5: Test auto-expand when concept not in filtered list**

This requires manually navigating to a concept outside your grade range. If you can't easily test this, skip and document as "needs manual verification with multi-grade data."

**Step 6: Test edge cases**

1. Verify toggle doesn't appear if filtered and all lists are the same length
2. Verify state resets when closing and reopening the popover
3. Verify selecting a concept closes the popover

**Step 7: Verify translations**

1. Switch language to German (if user account supports it)
2. Verify toggle text appears in German
3. Switch back to English

**Step 8: Document any issues**

Create a file `docs/plans/2025-11-11-subject-selector-testing-notes.md` with:
- What was tested
- Any bugs found
- Any edge cases that need attention

No commit needed for this step.

---

## Task 8: Code Review and Cleanup

**Files:**
- All modified files

**Step 1: Review all changes**

Run: `git diff main..HEAD`
Review the diff for:
- Unused imports
- Console.log statements
- Commented-out code
- TODOs or FIXMEs

**Step 2: Run TypeScript compiler**

Run: `cd packages/frontend && npx tsc --noEmit`
Expected: No errors

**Step 3: Check for linting issues**

If the project has a linter configured, run it.
Otherwise, manually review code for:
- Consistent naming
- Proper semantic Tailwind classes (text-foreground, bg-card, etc.)
- No hardcoded colors that should be semantic

**Step 4: Final commit if any cleanup needed**

```bash
git add .
git commit -m "chore: code cleanup for subject selector show all feature

Remove unused imports and ensure consistent code style.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com)"
```

---

## Task 9: Update Design Document

**Files:**
- Modify: `docs/plans/2025-11-11-subject-concept-selector-show-all.md`

**Step 1: Add implementation notes section**

At the end of the design document, add:

```markdown
## Implementation Notes

**Completed:** 2025-11-11

**Changes from original design:**
- None / [List any deviations from the design]

**Testing notes:**
- [Summary of manual testing performed]
- [Any edge cases discovered]

**Known limitations:**
- [Any identified limitations or future work needed]
```

**Step 2: Commit**

```bash
git add docs/plans/2025-11-11-subject-concept-selector-show-all.md
git commit -m "docs: add implementation notes to design document

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Verification Checklist

Before considering this feature complete, verify:

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] All files committed to git
- [ ] English and German translations added
- [ ] Toggle appears when there are more items available
- [ ] Toggle doesn't appear when filtered and all lists are identical
- [ ] Clicking toggle switches between filtered and all views
- [ ] Toggle text changes between "Show all" and "Show recommended"
- [ ] State resets when subject prop changes
- [ ] Selecting a concept closes the popover
- [ ] Manual testing completed and documented

---

## Next Steps

After implementation, consider:

1. **User testing:** Observe users interacting with the toggle to ensure it's intuitive
2. **Analytics:** Track how often users click "Show all" to understand usage patterns
3. **Accessibility:** Test with screen readers to ensure toggle is accessible
4. **Performance:** Monitor React Query cache to ensure both queries aren't causing issues

---

## Related Skills

- **@superpowers:executing-plans** - REQUIRED to execute this plan task by task
- **@superpowers:verification-before-completion** - Use before marking complete
- **@superpowers:finishing-a-development-branch** - Use when ready to merge
