# Unified Subject-Concept Selector Design

**Date:** 2025-11-04
**Component:** TaskPageHeader - Mobile-Optimized Subject/Concept Selection
**Goal:** Merge separate subject and concept selectors into a single, modern unified component with master-detail interaction pattern

## Problem Statement

The current TaskPageHeader has three separate selector components (Subject, Concept, Difficulty) that take up significant horizontal space. On mobile devices, this creates a cramped interface. The goal is to merge the Subject and Concept selectors into a single unified component that:

1. Appears as ONE cohesive element when closed
2. Opens into a dropdown with side-by-side lists (master-detail pattern)
3. Provides real-time concept list updates when subjects are selected
4. Maintains modern, minimalistic design consistent with the app's UI

## Design Decisions

### Architecture Pattern
**Master-Detail Pattern** - Selected over two-stage selection and smart search approaches because it provides the most interactive and responsive feel. When a user clicks a subject in the left column, the right column immediately updates with that subject's concepts.

### Visual Treatment
**Dropdown Panel** - Selected over modal overlay and bottom sheet because it maintains inline context, is more compact, and provides a clear spatial relationship with the trigger element.

### Layout
**Side-by-Side (2 Columns)** - Subject list on left, concept list on right. This works well on wider mobile screens in landscape and provides desktop-like efficiency while remaining touch-friendly.

### Scope
**Difficulty Stays Separate** - The difficulty selector remains as an independent badge/selector to keep the unified component focused on subject/concept selection only.

## Component Structure

### Visual Design

#### Closed State (Trigger Button)
- Single rounded badge displaying: `[Icon] Math • Patterns` or `[Icon] Math • Random`
- Uses existing subject badge colors (blue for math, purple for logic, etc.)
- Subject icon on the left (Calculator, Brain, Atom, etc.)
- Subject and concept names separated by bullet point `•`
- Hover effect: Subtle opacity change (0.8)
- Entire badge is clickable

#### Open State (Dropdown Panel)
- Dropdown positioned below trigger button
- White background with `shadow-lg` and `rounded-2xl`
- Two-column grid layout:
  - Left column (40%): Subject list with active indicator
  - Right column (60%): Concept list that updates when subject changes
- Vertical divider between columns
- Maximum height with independently scrollable columns (`overflow-y-auto`)
- Container padding: `p-4`, column gap: `gap-4`

#### Styling Details
- Built on shadcn/ui Popover component
- Border radius: `rounded-xl` for list items, `rounded-2xl` for container
- Active states: Background color matching subject theme (e.g., `bg-blue-50` for math)
- List item spacing: `gap-2`
- Typography: `text-sm` on mobile, `text-base` on larger screens

### Interaction Flow

1. **Open Dropdown:** User clicks unified badge → Dropdown opens with current subject highlighted in left column, concepts shown in right column
2. **Browse Subjects:** User clicks/hovers subject in left column → Right column immediately updates with that subject's concepts
3. **Select Concept:** User clicks concept in right column → Selection is made, dropdown closes, navigation occurs (both subject and concept may change)
4. **Close Without Selection:** Click outside dropdown or press Escape → Dropdown closes without changes
5. **Keyboard Navigation:** Arrow keys within columns, Tab to switch between columns, Enter to select, Escape to close

### State Management

**Component State:**
- `isOpen`: Boolean controlling dropdown visibility
- `previewSubject`: String tracking which subject's concepts to display (defaults to current subject, updates on hover/click in left column)

**Props (from parent):**
- `subject`: Current subject (from URL params)
- `concept`: Current concept (from URL params, can be undefined/"random")
- `subjects`: Array of subjects with their concepts (from SubjectsResponse)
- `onSubjectChange`: Callback for subject selection
- `onConceptChange`: Callback for concept selection

**Behavior:**
- Clicking a concept triggers navigation with potentially both subject and concept changing
- If subject changes, concept list updates immediately but no auto-selection occurs
- "Random" option always appears at top of concept list
- Active indicators show current subject (left) and current concept (right) based on props

### Component Architecture

**File Structure:**
```
packages/frontend/src/app/tasks/
├── TaskPageHeader.tsx                          (updated to use new component)
├── UnifiedSubjectConceptSelector/
│   ├── UnifiedSubjectConceptSelector.tsx      (main component)
│   ├── SubjectList.tsx                         (left column, memoized)
│   ├── ConceptList.tsx                         (right column, memoized)
│   └── types.ts                                (shared interfaces)
```

**Props Interface:**
```typescript
interface UnifiedSubjectConceptSelectorProps {
  subject: string
  concept?: string
  subjects: Subject[]  // from SubjectsResponse API
  onSubjectChange: (subject: string) => void
  onConceptChange: (concept: string) => void
}

interface SubjectListProps {
  subjects: Subject[]
  currentSubject: string
  previewSubject: string
  onSubjectClick: (subjectId: string) => void
  onSubjectHover: (subjectId: string) => void
}

interface ConceptListProps {
  subject: string
  concepts: Concept[]
  currentConcept?: string
  onConceptClick: (conceptId: string) => void
}
```

**Integration with TaskPageHeader:**
- Remove existing subject and concept Select components (lines 100-154)
- Replace with `<UnifiedSubjectConceptSelector />`
- Keep difficulty selector separate and unchanged
- Pass through `subjectsData`, current values, and handlers

**Reusable Elements:**
- Reuse `subjectIcons` and `subjectBadgeStyles` maps from existing code
- Use shadcn/ui primitives: Popover, PopoverTrigger, PopoverContent, ScrollArea
- Translation keys follow existing pattern: `subjects.${subject}.label`, concept names from i18n

## Responsive Design

### Breakpoint-Specific Behavior

**Small screens (< 640px):**
- Trigger badge: `min-w-[280px]` or full width
- Dropdown: `w-[calc(100vw-2rem)]` (nearly full viewport width)
- Two columns: Equal split (50/50) with `gap-2`
- Max height: `max-h-[60vh]` to accommodate keyboard
- Font size: `text-sm`
- Padding: `p-3` (reduced)

**Medium screens (640px - 1024px):**
- Trigger badge: `min-w-[320px]`
- Dropdown: `w-[480px]`
- Two columns: 40/60 split (subjects narrower)
- Max height: `max-h-[70vh]`
- Font size: `text-base`
- Padding: `p-4`

**Large screens (> 1024px):**
- Dropdown: `w-[560px]`
- Column gap: `gap-4` (more breathing room)
- Same layout as medium

### Touch Optimization

- Minimum tap target: 44px height for each list item
- List item padding: `px-3 py-2.5`
- Clear visual feedback on tap (background color change)
- Hover states only on hover-capable devices: `@media (hover: hover)`
- Smooth scrolling: `scroll-smooth` class on columns

### Performance Considerations

- Memoize SubjectList and ConceptList components with `React.memo`
- Debounce hover events on subject list (100ms delay)
- Virtualize concept lists if any subject has >50 concepts (unlikely but safe)
- Avoid re-rendering concept list when unrelated props change

### Accessibility

**ARIA Attributes:**
- `role="listbox"` for subject and concept columns
- `role="option"` for individual items
- `aria-selected="true"` for active items
- `aria-label` describing the purpose of each column

**Keyboard Navigation:**
- Arrow Up/Down: Navigate within current column
- Tab/Shift+Tab: Switch between subject and concept columns
- Enter: Select highlighted item
- Escape: Close dropdown without changes

**Focus Management:**
- Focus first subject in left column when dropdown opens
- Restore focus to trigger button when dropdown closes
- Maintain focus visibility with clear focus rings

**Screen Reader Support:**
- Announce when concept list updates: "Showing concepts for [Subject Name]"
- Announce current selection in trigger button: "Math, Patterns selected"

## Implementation Notes

### shadcn/ui Components Required
- Popover (for dropdown container)
- Button (for trigger and list items)
- ScrollArea (for scrollable columns)
- Separator (for vertical divider between columns)

### Tailwind Classes Reference
- Container: `rounded-2xl shadow-lg bg-white p-4`
- Grid layout: `grid grid-cols-2 gap-4`
- Column: `flex flex-col gap-2 overflow-y-auto max-h-[60vh]`
- List item: `px-3 py-2.5 rounded-xl hover:bg-blue-50 cursor-pointer`
- Active state: `bg-blue-100 text-blue-800 font-medium`
- Divider: `w-px bg-gray-200`

### Translation Keys Needed
- `task.selectSubjectConcept` - Aria label for unified selector
- `task.subjects` - Aria label for subject column
- `task.concepts` - Aria label for concept column
- `task.conceptsFor` - Screen reader announcement template: "Showing concepts for {subject}"

### Existing Code to Update
1. **TaskPageHeader.tsx (lines 100-154):** Remove separate Select components
2. **TaskPageHeader.tsx:** Import and render `UnifiedSubjectConceptSelector`
3. **Translation files:** Add new keys to `en/common.json` and `de/common.json`

### Testing Considerations
- Test with 6 subjects (current max) to ensure column scrolling works
- Test with subjects having many concepts (e.g., Math grade 5)
- Test touch interactions on actual mobile devices (not just browser DevTools)
- Test keyboard navigation with screen reader enabled
- Test rapid subject switching to ensure concept list updates smoothly
- Test with "Random" concept selected vs specific concept

## Success Criteria

1. Mobile header is less cramped with unified component
2. Dropdown feels like ONE cohesive UI element
3. Subject switching updates concepts immediately (no lag)
4. Touch targets are comfortable on mobile (44px+)
5. Keyboard navigation works intuitively
6. Screen readers announce changes clearly
7. Visual design matches app's minimalistic aesthetic
8. No performance issues with subject/concept switching
