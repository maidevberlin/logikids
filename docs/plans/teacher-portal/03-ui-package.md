# Phase 3: UI Package

## Goal

Extract shared components from current frontend into a reusable `packages/ui` package that both frontend-student and frontend-teacher can import.

## Prerequisites

- Phase 1 (Backend Restructure) completed
- Phase 2 (Teacher Auth) completed

## Package Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Modal/
│   │   ├── Card/
│   │   ├── Spinner/
│   │   ├── MarkdownRenderer/
│   │   │   ├── MarkdownRenderer.tsx
│   │   │   ├── plugins/           # Remark/rehype plugins
│   │   │   └── index.ts
│   │   └── index.ts               # Re-exports all components
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── theme.css              # CSS variables, colors, spacing
│   │   ├── reset.css              # CSS reset
│   │   └── index.css              # Combines all
│   │
│   ├── utils/
│   │   ├── cn.ts                  # classnames utility
│   │   └── index.ts
│   │
│   └── index.ts                   # Main entry point
│
├── package.json
├── tsconfig.json
└── vite.config.ts                 # Build as library
```

## Components to Extract

Analyze current frontend and identify shared components:

### Definitely Shared

| Component        | Current Location               | Notes                             |
| ---------------- | ------------------------------ | --------------------------------- |
| Button           | `app/common/Button/`           | Primary, secondary, icon variants |
| Input            | `app/common/Input/`            | Text input with label             |
| Select           | `app/common/Select/`           | Dropdown select                   |
| Modal            | `app/common/Modal/`            | Dialog overlay                    |
| Card             | `app/common/Card/`             | Container with styling            |
| Spinner          | `app/common/Spinner/`          | Loading indicator                 |
| MarkdownRenderer | `app/common/MarkdownRenderer/` | With KaTeX, Mermaid support       |
| IconButton       | `app/common/IconButton/`       | Icon-only button                  |

### Hooks to Extract

| Hook            | Current Location | Notes                  |
| --------------- | ---------------- | ---------------------- |
| useLocalStorage | `app/hooks/`     | Persistent state       |
| useMediaQuery   | `app/hooks/`     | Responsive design      |
| useClickOutside | `app/hooks/`     | Modal/dropdown dismiss |

### Possibly Shared (evaluate during implementation)

| Component          | Notes                      |
| ------------------ | -------------------------- |
| Toast/Notification | If exists                  |
| Tabs               | If exists                  |
| Dropdown           | If different from Select   |
| Form components    | FormField, FormError, etc. |

## Implementation Steps

### Step 1: Create package structure

```bash
mkdir -p packages/ui/src/{components,hooks,styles,utils}
```

### Step 2: Initialize package.json

```json
{
  "name": "@logikids/ui",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles/index.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.0.0"
  }
}
```

### Step 3: Configure Vite for library build

**vite.config.ts:**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), dts({ include: ['src'] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
})
```

### Step 4: Move components one by one

For each component:

1. Copy component folder to `packages/ui/src/components/`
2. Update imports (relative paths, remove app-specific dependencies)
3. Add to `components/index.ts` exports
4. Update original location to import from `@logikids/ui`
5. Test that component still works

### Step 5: Move shared styles

Extract theme variables (colors, spacing, fonts) to `packages/ui/src/styles/theme.css`.

### Step 6: Update workspace configuration

**Root package.json (workspaces):**

```json
{
  "workspaces": ["packages/*"]
}
```

### Step 7: Add ui package as dependency

**packages/frontend/package.json:**

```json
{
  "dependencies": {
    "@logikids/ui": "workspace:*"
  }
}
```

## MarkdownRenderer Considerations

The MarkdownRenderer is complex with many dependencies (KaTeX, Mermaid, etc.). Options:

1. **Include all dependencies in ui package** - Larger bundle for teacher app even if not using all features
2. **Make plugins optional** - Core renderer in ui, plugins loaded dynamically
3. **Keep in frontend-student only** - Teacher app gets simpler markdown renderer

Recommendation: **Option 1** for simplicity. Both apps likely need math rendering. Optimize bundle size later if needed.

## Testing

1. Build ui package: `cd packages/ui && bun run build`
2. Import component in frontend: `import { Button } from '@logikids/ui'`
3. Verify components render correctly
4. Check no duplicate React instances (common monorepo issue)
5. Verify styles apply correctly

## Rollback Plan

Keep original components in frontend until ui package is stable. Migration is gradual - one component at a time.
