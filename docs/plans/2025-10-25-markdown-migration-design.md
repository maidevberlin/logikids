# Markdown Migration Design

**Date:** 2025-10-25
**Status:** Approved
**Author:** Claude Code

## Overview

Migrate from HTML-based task generation to Markdown-based generation across the entire Logikids platform. This change leverages LLMs' natural strength in generating Markdown while adding support for math formulas, tables, code blocks, diagrams, and SVG graphics.

## Goals

1. **Cleaner LLM Output**: Markdown is more natural for LLMs than HTML, leading to better quality and consistency
2. **Easy Tables**: Markdown table syntax is simpler than HTML tables for LLMs to generate
3. **Math Formula Support**: LaTeX syntax ($inline$ and $$block$$) for educational mathematical content
4. **Rich Content Types**: Support code blocks, Mermaid diagrams, and SVG graphics where appropriate

## Requirements

- All text content (tasks, hints, solutions) must be in Markdown format
- Support LaTeX math formulas with $ and $$ delimiters (most natural for LLMs)
- No backward compatibility needed - clean migration
- Subject-specific content type support (not all subjects need all features)

## Architecture

### Two-Layer Approach

**Backend Layer:**
- Update all prompt files to instruct LLM to generate Markdown
- LLM outputs raw Markdown strings with LaTeX math syntax
- Backend returns Markdown in API responses (no changes to API contract)
- No changes to caching logic or service layer

**Frontend Layer:**
- Install rendering libraries: react-markdown, remark-math, rehype-katex, remark-gfm, rehype-raw
- Create `<MarkdownRenderer>` component with plugin support
- Replace all `dangerouslySetInnerHTML` usage with `<MarkdownRenderer>`
- Include KaTeX CSS for math rendering

## Content Types Supported

### Core Content (All Subjects)
- **Basic Markdown**: Headings, paragraphs, lists, bold, italic, links
- **Tables**: GitHub Flavored Markdown syntax

### Subject-Specific Content

| Subject | LaTeX Math | Code Blocks | Mermaid Diagrams | SVG Graphics |
|---------|------------|-------------|------------------|--------------|
| Math | ✓ | - | - | ✓ (geometry) |
| Programming | - | ✓ | ✓ (flowcharts) | - |
| Logic | - | - | ✓ (decision trees) | - |
| Science | ✓ | - | - | ✓ (diagrams) |
| Languages | - | - | - | - |
| Geography | - | - | - | ✓ (maps) |

### Content Type Details

**LaTeX Math:**
- Inline: `$x^2$` renders as $x^2$
- Block: `$$\frac{a}{b}$$` renders as centered formula
- Rendered with KaTeX library

**Code Blocks:**
- Syntax: ` ```python` or ` ```javascript`
- Rendered with react-syntax-highlighter
- Automatic language detection and highlighting

**Mermaid Diagrams:**
- Syntax: ` ```mermaid`
- Supports flowcharts, graphs, sequences, state diagrams
- Rendered with react-mermaid library

**SVG Graphics:**
- Inline `<svg>` elements in Markdown
- Enabled with rehype-raw plugin
- For geometric shapes, simple charts, visual puzzles

## Implementation Details

### Backend Changes

**Prompt File Updates:**

All prompts in `/prompts/` need updated formatting instructions:

**Before:**
```markdown
Format the task as HTML with proper formatting using <p>, <ul>, <li> tags.
```

**After:**
```markdown
Format the task as Markdown. Use LaTeX syntax for math: $x^2$ for inline, $$x^2$$ for block equations. Use Markdown tables when appropriate.
```

**Subject-Specific Guidelines:**

Each subject's `base.md` includes a "Content Guidelines" section tailored to its needs:

*Math subject example:*
```markdown
**Content Guidelines:**
- Use LaTeX for formulas: $x^2$ (inline), $$\frac{a}{b}$$ (block)
- Use tables for comparisons: | Col1 | Col2 |
- Use SVG for geometric diagrams when helpful
```

*Programming subject example:*
```markdown
**Content Guidelines:**
- Use code blocks with language: ```python
- Use Mermaid for flowcharts: ```mermaid
- Use tables for algorithm complexity
```

**Files to Update:**
- `/prompts/task-types/*.md` - All task type prompts
- `/prompts/subjects/*/base.md` - Subject base prompts with content guidelines
- `/prompts/hints/hint.md` - Hint generation prompt

**No Code Changes:**
- Prompt loading system unchanged
- Hot-reload continues to work
- API responses still return strings (now Markdown instead of HTML)

### Frontend Changes

**New Component: MarkdownRenderer**

Create `packages/frontend/src/components/MarkdownRenderer/MarkdownRenderer.tsx`:

```tsx
interface MarkdownRendererProps {
  content: string
  enableMath?: boolean      // LaTeX support (default: true)
  enableMermaid?: boolean   // Diagram support (default: true)
  enableCode?: boolean      // Syntax highlighting (default: true)
}
```

**Dependencies:**
```json
{
  "react-markdown": "^9.0.0",              // Core Markdown renderer
  "remark-math": "^6.0.0",                 // Parse LaTeX syntax
  "rehype-katex": "^7.0.0",                // Render LaTeX with KaTeX
  "remark-gfm": "^4.0.0",                  // Tables, strikethrough, task lists
  "rehype-raw": "^7.0.0",                  // Allow HTML/SVG elements
  "react-syntax-highlighter": "^15.5.0",   // Code highlighting
  "react-mermaid": "^2.0.0",               // Mermaid diagrams
  "katex": "^0.16.0"                       // Math rendering library
}
```

**Usage Pattern:**

Replace:
```tsx
<div dangerouslySetInnerHTML={{ __html: task.question }} />
```

With:
```tsx
<MarkdownRenderer
  content={task.question}
  enableMath={true}
/>
```

**Files to Update:**
- `packages/frontend/src/features/Task/TaskCard/TaskCard.tsx` - Task question display
- `packages/frontend/src/features/Task/Hint/HintSection/HintSection.tsx` - Hint rendering
- `packages/frontend/src/features/Task/TaskAnswer/TaskAnswer.tsx` - Solution display

**Styling:**
- Include KaTeX CSS: `import 'katex/dist/katex.min.css'`
- Add custom styling for Markdown elements (match existing design)
- Ensure code blocks have appropriate theme
- Style Mermaid diagrams consistently

## Migration Execution Plan

### Phase 1: Frontend Setup (Do First)
1. Install npm packages in frontend-dev container
2. Create `<MarkdownRenderer>` component with all plugins
3. Add KaTeX CSS to main stylesheet
4. Test component with sample Markdown content (math, tables, code, diagrams)

### Phase 2: Backend Prompt Updates
1. Update all task type prompts in `/prompts/task-types/*.md`
2. Add content guidelines to subject base prompts
3. Update hint prompt in `/prompts/hints/hint.md`
4. Test sample task generation for each subject

### Phase 3: Frontend Integration
1. Replace `dangerouslySetInnerHTML` in `TaskCard.tsx`
2. Replace in `HintSection.tsx`
3. Replace in `TaskAnswer.tsx`
4. Remove HTML-specific styling/sanitization

### Phase 4: Testing & Refinement
1. Generate test tasks across all subjects and concepts
2. Validate rendering quality (visual regression)
3. Refine prompts if LLM output inconsistent
4. Document subject-specific findings

**Why This Order:**
- Frontend ready before backend changes (no breaking UI)
- Prompt changes are reversible (just edit files)
- Each phase independently testable

## Testing Strategy

### Content Type Testing
- **LaTeX**: Test inline `$x^2$` and block `$$\frac{a}{b}$$` formulas
- **Tables**: Various column counts, alignments, complex data
- **Code Blocks**: Multiple languages with syntax highlighting
- **Mermaid**: Flowcharts, graphs, sequence diagrams, state machines
- **SVG**: Geometric shapes, simple diagrams

### Edge Cases
- Mixed content (text + math + tables + diagrams in one task)
- Special Markdown characters (*, _, [, ], etc.)
- Empty or malformed Markdown from LLM
- Very long content (scrolling, performance)
- Math formulas with complex LaTeX syntax

### Prompt Quality Testing
- Verify LLM generates valid Markdown consistently
- Check LLM uses appropriate content types per subject
- Test across both Ollama and OpenAI providers
- Validate math formula syntax correctness

### Testing Approach
- Manual visual testing during development
- Sample tasks for each subject/concept combination
- Document prompt adjustments if LLM output needs improvement
- No automated tests initially (visual validation sufficient)

## Rollback Plan

If critical issues arise:

1. **Immediate Rollback**: Revert prompt files to HTML instructions
   - `git checkout HEAD~1 prompts/`
   - Hot-reload picks up changes automatically

2. **Frontend Rollback**: Keep component but disable temporarily
   - Add feature flag to switch between Markdown and HTML rendering
   - No code removal needed

3. **Gradual Rollback**: Roll back subject-by-subject if needed
   - Revert specific subject prompts while keeping others
   - Test each rollback independently

## Success Metrics

- LLM generates valid Markdown 95%+ of the time
- Math formulas render correctly in all browsers
- Tables display properly with correct alignment
- Code blocks have syntax highlighting
- Mermaid diagrams render without errors
- Page load performance unchanged or improved
- No increase in LLM generation errors

## Future Enhancements

- **Interactive Diagrams**: Make Mermaid diagrams clickable/interactive
- **Graph Plotting**: Add support for function plotting libraries
- **Chemical Formulas**: mhchem extension for chemistry subjects
- **Music Notation**: ABC notation for music subjects
- **Responsive Tables**: Better mobile rendering for complex tables

## Technical Debt & Considerations

- **Bundle Size**: React-markdown + plugins add ~150KB to frontend bundle
- **Security**: rehype-raw allows HTML/SVG (sanitization via react-markdown is secure)
- **Performance**: Markdown parsing is fast, but complex Mermaid diagrams may be slower
- **Accessibility**: Ensure math formulas have proper aria-labels for screen readers

## References

- [react-markdown documentation](https://github.com/remarkjs/react-markdown)
- [KaTeX documentation](https://katex.org/)
- [Mermaid documentation](https://mermaid.js.org/)
- [GitHub Flavored Markdown spec](https://github.github.com/gfm/)
