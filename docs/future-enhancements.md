# Future Enhancements

Features that are implemented but disabled/limited, waiting for improvements in AI capabilities or library fixes.

---

## Subject-by-Subject Analysis

### Languages (German, English, Latin) ✅

**Status:** Works well
**Why:** Text-based knowledge, no calculations, no spatial reasoning needed

| Feature              | Works | Notes                    |
| -------------------- | ----- | ------------------------ |
| Grammar explanations | ✅    | Plain text               |
| Vocabulary           | ✅    | Tables, lists            |
| Sentence structure   | ✅    | Mermaid trees for syntax |
| Conjugation tables   | ✅    | Markdown tables          |

**No enhancements needed.**

---

### History ✅

**Status:** Works well
**Why:** Text-based, Mermaid supports timelines

| Feature             | Works | Notes                      |
| ------------------- | ----- | -------------------------- |
| Event descriptions  | ✅    | Plain text                 |
| Timelines           | ✅    | Mermaid `timeline` diagram |
| Cause/effect chains | ✅    | Mermaid flowcharts         |
| Period comparisons  | ✅    | Tables                     |

**Nice-to-have:** Historical images (decorative, not critical)

---

### Politics ✅

**Status:** Works well
**Why:** Structural concepts map perfectly to flowcharts

| Feature              | Works | Notes                     |
| -------------------- | ----- | ------------------------- |
| Government structure | ✅    | Mermaid flowcharts        |
| Separation of powers | ✅    | Mermaid diagrams          |
| Legislative process  | ✅    | Mermaid sequence diagrams |
| Comparisons          | ✅    | Tables                    |

**No enhancements needed.**

---

### Math ⚠️

**Status:** Partially works
**Issues:** Geometry visuals, calculation accuracy

| Feature           | Works | Notes                                  |
| ----------------- | ----- | -------------------------------------- |
| Formulas          | ✅    | LaTeX                                  |
| Word problems     | ✅    | Plain text                             |
| Logic/proofs      | ✅    | Mermaid for flow                       |
| Geometry diagrams | ❌    | AI can't generate accurate coordinates |
| Calculations      | ⚠️    | AI sometimes makes arithmetic errors   |

**Needs:**

- Code execution for verified calculations (see below)
- Better geometry support (waiting for AI improvement)

---

### Physics ⚠️

**Status:** Similar to Math
**Issues:** Same calculation and diagram problems

| Feature              | Works | Notes                                       |
| -------------------- | ----- | ------------------------------------------- |
| Formulas             | ✅    | LaTeX                                       |
| Concept explanations | ✅    | Plain text                                  |
| Circuit diagrams     | ⚠️    | Mermaid limited, would need specialized lib |
| Force diagrams       | ❌    | Coordinate-based, AI struggles              |
| Calculations         | ⚠️    | AI arithmetic errors                        |

**Needs:**

- Code execution for calculations
- Specialized circuit diagram library (future)

---

### Biology ⚠️

**Status:** Mixed
**Issues:** Some diagrams need images

| Feature              | Works | Notes              |
| -------------------- | ----- | ------------------ |
| Process descriptions | ✅    | Plain text         |
| Food chains          | ✅    | Mermaid flowcharts |
| Classification trees | ✅    | Mermaid trees      |
| Cell diagrams        | ❌    | Would need images  |
| Anatomy              | ❌    | Would need images  |

**Needs:**

- Image generation or curated image library (complex)

---

### Chemistry ⚠️

**Status:** Limited
**Issues:** Molecular structures need specialized rendering

| Feature              | Works | Notes                          |
| -------------------- | ----- | ------------------------------ |
| Reaction equations   | ✅    | LaTeX                          |
| Reaction processes   | ✅    | Mermaid flowcharts             |
| Periodic table facts | ✅    | Tables, text                   |
| Molecular structures | ❌    | Needs specialized library      |
| 3D molecules         | ❌    | Would need 3Dmol.js or similar |

**Potential libraries:**

- `SmilesDrawer` - 2D molecule rendering from SMILES notation
- `3Dmol.js` - 3D molecule viewer
- `Kekule.js` - Chemical structure editor/viewer
- `rdkit` - Cheminformatics (heavy)

**Challenge:** AI would need to generate valid SMILES or MOL notation

## Visualization Features

### TikZ Support (Disabled)

**Status:** Removed from codebase
**Issue:** Memory leak - `node-tikzjax` uses ~740MB per render, doesn't release memory

**Re-enable when:**

- Client-side TikZJax becomes more lightweight (<5MB)
- Or node-tikzjax fixes memory management
- Or we implement a microservice with strict memory limits

**Code location:** Removed, see git history for `packages/backend/src/common/tikz.ts`

---

### JSXGraph Geometry (Disabled in Prompts)

**Status:** Code implemented, but removed from prompt to prevent AI from using it
**Issue:** AI lacks spatial reasoning - coordinates don't match described geometry
**Example:** "Point P on line AB" but P's coordinates aren't actually on line AB

**Current behavior:**

- Renderer code exists and works
- If AI somehow generates jsxgraph, it will render (but likely incorrectly)

**Re-enable when:**

- AI models improve spatial reasoning (expected 2025-2026)
- Or we implement validation that checks geometric consistency
- Or we use JSXGraph's declarative features (intersection points, etc.)

**To re-enable:** Add back to `packages/backend/prompts/base-prompt.md` Rich Content section

**Code location:** `packages/frontend/src/app/common/MarkdownRenderer/JSXGraphRenderer.tsx`

---

### SVG Diagrams (Disabled in Prompts)

**Status:** Code exists, but removed from prompt to prevent AI from using it
**Issue:** Text overlaps, angles miscalculated, spacing wrong

**Current behavior:**

- Backend SVG conversion still works for any SVG in responses
- Simple shapes would work, but complex diagrams fail

**Re-enable when:**

- AI models improve spatial reasoning
- Or we limit to templated SVGs with parameter substitution

**Code location:** Backend renders SVG, frontend displays via MarkdownRenderer

---

### Mafs Function Plots (Disabled in Prompts)

**Status:** Code implemented, removed from prompt before testing
**Issue:** Same spatial reasoning concerns as JSXGraph

**To re-enable:** Add back to `packages/backend/prompts/base-prompt.md` Rich Content section

**Code location:** `packages/frontend/src/app/common/MarkdownRenderer/MafsRenderer.tsx`

---

### Graphviz/DOT (Disabled in Prompts)

**Status:** Code implemented, removed from prompt before testing
**Note:** Graphviz has auto-layout so it might work better than coordinate-based options

**To re-enable:** Add back to `packages/backend/prompts/base-prompt.md` Rich Content section

**Code location:** `packages/frontend/src/app/common/MarkdownRenderer/GraphvizRenderer.tsx`

---

## Code Execution for Calculations

### Sandboxed Code Execution (Not Implemented)

**Status:** Idea stage - not yet implemented
**Goal:** AI generates executable code for calculations instead of "calculating" itself

**Problem:**

- AI makes arithmetic errors (e.g., "23 × 47 = 1079" when it's 1081)
- AI "hallucinates" numeric results rather than computing them
- No way to verify AI's calculations are correct

---

### Implementation Options

#### Option 1: QuickJS WASM (Recommended for MVP)

**Library:** `quickjs-emscripten` (~500KB)
**Runs:** JavaScript
**Where:** Frontend (browser)

```typescript
import { getQuickJS } from 'quickjs-emscripten'

const QuickJS = await getQuickJS()
const result = QuickJS.evalCode('23 * 47') // → 1081
```

**Pros:**

- Lightweight, fast startup
- True sandbox (no DOM/network access)
- Sync execution

**Cons:**

- JavaScript only (but sufficient for math)

---

#### Option 2: Pyodide (Full Python)

**Library:** `pyodide` (~10MB initial, cached)
**Runs:** Python with numpy, scipy, sympy
**Where:** Frontend (browser) or backend (Node)

```typescript
import { loadPyodide } from 'pyodide'

const pyodide = await loadPyodide()
const result = await pyodide.runPython('23 * 47') // → 1081

// With numpy
await pyodide.loadPackage('numpy')
await pyodide.runPython('import numpy as np; np.mean([1,2,3,4,5])')
```

**Pros:**

- Full Python ecosystem
- numpy/scipy for advanced math
- sympy for symbolic algebra

**Cons:**

- Large initial download
- Async only
- Slower startup

---

#### Option 3: Web Worker Sandbox

**Library:** Native browser API
**Runs:** JavaScript
**Where:** Frontend

```typescript
// worker.js runs in isolated context
const worker = new Worker('calc-worker.js')
worker.postMessage({ code: '23 * 47' })
worker.onmessage = (e) => console.log(e.data) // → 1081
```

**Pros:**

- No dependencies
- Browser-native isolation
- Can terminate runaway code

**Cons:**

- Still has some browser APIs
- Need to manage worker lifecycle

---

#### Option 4: Backend Execution (Docker)

**Runs:** Any language
**Where:** Backend in isolated container

```typescript
// Backend spawns short-lived container
const result = await executeInDocker({
  image: 'python:3.11-slim',
  code: 'print(23 * 47)',
  timeout: 5000,
  memoryLimit: '64m',
})
```

**Pros:**

- Full language support
- True isolation
- Can run heavy computations

**Cons:**

- Infrastructure complexity
- Latency (container startup)
- Cost (compute resources)

---

### Prompt Engineering Required

For any option to work, the AI must be told to generate code instead of calculating:

````markdown
## Calculations

For ANY numeric calculation in a task:

1. Generate the calculation as a `calc` code block
2. The system will execute it and use the result
3. Do NOT calculate yourself - you make arithmetic errors

Example task requiring "23 × 47":

```calc
return 23 * 47
```
````

The system will replace this with the computed result: 1081

```

**Challenge:** AI naturally wants to "think through" calculations. Strong prompt language needed.

---

### Integration Flow

```

AI generates task → System finds `calc` blocks → Execute in sandbox → Inject results → Return to frontend

```

1. AI outputs: `The answer is \`\`\`calc return 23 * 47 \`\`\``
2. Backend parses `calc` blocks
3. Execute each in sandbox
4. Replace block with result: `The answer is 1081`
5. Return processed response

---

### Recommendation

| Phase | Action |
|-------|--------|
| **MVP** | QuickJS WASM - lightweight, sync, sufficient for arithmetic |
| **Later** | Pyodide - if we need numpy/scipy for statistics, calculus |
| **Future** | Docker - if we need heavy computation or multiple languages |

**Estimated effort:** 2-3 days for QuickJS integration + prompt engineering

---

## Reliable Features

These work well with current AI:

| Feature        | Status      | Notes                                  |
| -------------- | ----------- | -------------------------------------- |
| **LaTeX**      | ✅ Reliable | Math formulas render correctly         |
| **Mermaid**    | ✅ Reliable | Flowcharts, trees, sequences work well |
| **Tables**     | ✅ Reliable | Markdown tables render correctly       |
| **Plain text** | ✅ Reliable | Descriptions, explanations             |

---

## Monitoring AI Progress

Check these periodically to assess if AI spatial reasoning has improved:

1. Generate geometry tasks with JSXGraph
2. Verify intersection points actually intersect
3. Verify labeled points lie on described lines
4. Check if angles match stated values

**Last checked:** 2025-12-16 - Still inaccurate

---

## Related Documents

- [TikZ Memory Leak Investigation](plans/2025-12-16-tikz-memory-leak.md)
- [Visualization Stack Update](plans/2025-12-16-visualization-stack-update.md)
```
