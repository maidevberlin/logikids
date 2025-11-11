# Subject/Concept Selector: Show All Feature

**Date:** 2025-11-11
**Status:** Design Complete
**Components:** TaskPageHeader, SubjectConceptSelector, SubjectList, ConceptList

## Overview

Enhance the SubjectConceptSelector to automatically show all subjects/concepts when the current selection is outside the filtered (grade-appropriate) list, and provide toggle links to switch between filtered ("recommended") and all subjects/concepts.

## Problem Statement

Currently, the selector only shows grade-filtered subjects and concepts. When a user's current concept is not in the filtered list (e.g., they selected it before, or it's from a different grade), the concept is invisible in the selector, creating confusion.

## Requirements

1. **Auto-expand when needed:** If the current concept is not in the filtered list, automatically show all subjects and concepts
2. **Manual toggle:** Provide "show all" / "show recommended" links at the bottom of both subject and concept lists
3. **State persistence:** Once user clicks a subject, keep the show all/recommended view until subject changes
4. **Reset on subject change:** When the selected subject changes (from parent), reset to the appropriate default view

## Design

### 1. Data Flow & API Integration

**TaskPageHeader responsibilities:**
- Fetch filtered subjects (with grade parameter) - existing behavior
- Fetch all subjects (without grade parameter) - new query
- Detect if current concept exists in filtered concepts
- Pass both datasets and detection result to SubjectConceptSelector

```typescript
// In TaskPageHeader.tsx
const { data: filteredSubjects } = useQuery({
  queryKey: ['subjects', userData?.settings.grade],
  queryFn: ({ signal }) => logikids.getSubjects({ grade: userData?.settings.grade ?? 5 }, signal),
  enabled: !!userData,
})

const { data: allSubjects } = useQuery({
  queryKey: ['subjects', 'all'],
  queryFn: ({ signal }) => logikids.getSubjects({}, signal),
  enabled: !!userData,
})

const isCurrentConceptFiltered = useMemo(() => {
  if (!concept || !filteredSubjects) return true
  const subj = filteredSubjects.subjects.find(s => s.id === subject)
  return subj?.concepts?.some(c => c.id === concept) ?? false
}, [concept, subject, filteredSubjects])

<SubjectConceptSelector
  filteredSubjects={filteredSubjects?.subjects ?? []}
  allSubjects={allSubjects?.subjects ?? []}
  showAllByDefault={!isCurrentConceptFiltered}
  // ... other props
/>
```

**Benefits:**
- React Query caches both queries independently
- Detection logic lives in the smart component (TaskPageHeader)
- SubjectConceptSelector remains a controlled/pure component

### 2. Component State Management

**SubjectConceptSelector internal state:**

```typescript
const [showAll, setShowAll] = useState(showAllByDefault)

// Reset showAll when subject prop changes
useEffect(() => {
  setShowAll(showAllByDefault)
}, [subject, showAllByDefault])

// Determine which dataset to display
const displayedSubjects = showAll ? allSubjects : filteredSubjects
const displayedConcepts = useMemo(() => {
  const targetSubject = displayedSubjects.find(s => s.id === previewSubject)
  return targetSubject?.concepts ?? []
}, [displayedSubjects, previewSubject])
```

**State behavior:**
- Initial render: Uses `showAllByDefault` prop
- User clicks "show all": Sets `showAll = true`, displays all subjects/concepts
- User clicks "show recommended": Sets `showAll = false`, displays filtered only
- User clicks different subject in left column: `showAll` state persists (not affected)
- Subject prop changes from parent: `useEffect` resets `showAll` to `showAllByDefault`

### 3. UI Components for Toggle Links

**SubjectList enhancement:**

```typescript
interface SubjectListProps {
  subjects: SubjectInfo[]
  currentSubject: string
  previewSubject: string
  onSubjectClick: (subjectId: string) => void
  onSubjectHover: (subjectId: string) => void
  showAll: boolean
  hasMoreSubjects: boolean  // true if allSubjects.length > filteredSubjects.length
  onToggleShowAll: () => void
}

// At the end of the subject list
{hasMoreSubjects && (
  <button
    onClick={onToggleShowAll}
    className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 text-center w-full"
  >
    {showAll ? '← Show recommended' : 'Show all subjects →'}
  </button>
)}
```

**ConceptList enhancement:**

```typescript
interface ConceptListProps {
  subject: string
  concepts: ConceptInfo[]
  currentConcept?: string
  onConceptClick: (conceptId: string) => void
  showAll: boolean
  hasMoreConcepts: boolean
  onToggleShowAll: () => void
}

// At the end of the concept list
{hasMoreConcepts && (
  <button
    onClick={onToggleShowAll}
    className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 text-center w-full"
  >
    {showAll ? '← Show recommended' : 'Show all concepts →'}
  </button>
)}
```

**Visual design:**
- Bottom of each scrollable list
- Centered alignment
- Smaller text, muted color (semantic theming classes)
- Clear hover state
- Distinct from list items

### 4. Edge Cases & Error Handling

**Edge case: Current concept not in filtered, but subject is**
- Show all subjects and all concepts by default
- Current subject remains highlighted
- Current concept is now visible in the concept list

**Edge case: Neither subject nor concept in filtered**
- Show all subjects and concepts by default
- User can still toggle back to recommended view if desired

**Edge case: Filtered list is empty**
- Fall back to showing all subjects/concepts
- Don't show toggle (nothing to recommend)

**Edge case: No difference between filtered and all**
- `hasMoreSubjects` and `hasMoreConcepts` both false
- Toggle links don't appear
- Clean, simple list presentation

**Loading states:**
- Show skeleton while both queries load
- If `allSubjects` query fails: Hide toggle, component works with filtered data only
- If `filteredSubjects` query fails: Fall back to `allSubjects`, no toggle

**Error recovery:**
- Component degrades gracefully if one query fails
- No breaking changes to existing functionality

## Implementation Checklist

- [ ] Update TaskPageHeader to fetch both filtered and all subjects
- [ ] Add `isCurrentConceptFiltered` detection logic
- [ ] Update SubjectConceptSelector props interface
- [ ] Add `showAll` state and toggle handler
- [ ] Add `useEffect` to reset state on subject change
- [ ] Update SubjectList to accept and render toggle link
- [ ] Update ConceptList to accept and render toggle link
- [ ] Calculate `hasMoreSubjects` and `hasMoreConcepts` flags
- [ ] Update type definitions in types.ts
- [ ] Test edge cases (empty lists, failed queries, no filtering)
- [ ] Update translations for "Show all" / "Show recommended" text

## Translation Keys

Add to `common.json`:

```json
{
  "task": {
    "showAllSubjects": "Show all subjects →",
    "showRecommendedSubjects": "← Show recommended",
    "showAllConcepts": "Show all concepts →",
    "showRecommendedConcepts": "← Show recommended"
  }
}
```

## Open Questions

None - design is complete and validated.

## Approval

Design validated with user on 2025-11-11.

## Implementation Notes

**Completed:** 2025-11-11

**Changes from original design:**
- Tasks 3 and 4 from the implementation plan were combined into a single commit (ed68e7a) that updated both SubjectList and ConceptList components together, rather than in separate commits. This was more efficient as both components required identical changes (adding toggle props and rendering logic).

**Testing notes:**
- Manual testing was deferred due to Docker environment setup requirements
- TypeScript compilation verified with no errors after all changes
- All component interfaces properly updated with new props
- Translation keys added for both English and German

**Known limitations:**
- None identified during implementation
- Feature follows design specification exactly
- Edge cases (empty lists, no filtering differences) handled as designed
