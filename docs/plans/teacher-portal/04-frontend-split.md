# Phase 4: Frontend Split

## Goal

Split current frontend into `frontend-student` (moved) and `frontend-teacher` (new shell), both importing shared components from `@logikids/ui`.

## Prerequisites

- Phase 3 (UI Package) completed

## Target Structure

```
packages/
├── ui/                         # Shared components (from Phase 3)
│
├── frontend-student/           # Student app (current frontend, moved)
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/           # Student auth flows
│   │   │   ├── concept/        # Concept selection
│   │   │   ├── task/           # Task display
│   │   │   ├── user/           # Settings, sync, profile
│   │   │   └── ...
│   │   ├── routes/
│   │   │   └── index.tsx
│   │   ├── api/                # tRPC client
│   │   ├── main.tsx
│   │   └── index.html
│   ├── public/
│   │   └── locales/            # i18n files
│   ├── package.json
│   └── vite.config.ts
│
├── frontend-teacher/           # Teacher app (new)
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/           # Teacher auth (login only)
│   │   │   ├── dashboard/      # Teacher dashboard
│   │   │   ├── tasks/          # Placeholder
│   │   │   └── worksheets/     # Placeholder
│   │   ├── routes/
│   │   │   └── index.tsx
│   │   ├── api/                # tRPC client (same backend)
│   │   ├── main.tsx
│   │   └── index.html
│   ├── public/
│   │   └── locales/            # i18n files (can share with student)
│   ├── package.json
│   └── vite.config.ts
```

## Implementation Steps

### Step 1: Rename current frontend

```bash
mv packages/frontend packages/frontend-student
```

Update `package.json` name:

```json
{
  "name": "@logikids/frontend-student"
}
```

### Step 2: Update imports to use @logikids/ui

Replace local component imports with ui package imports throughout frontend-student.

### Step 3: Update Docker/deployment configs

Update any references to `packages/frontend` → `packages/frontend-student`.

### Step 4: Create frontend-teacher scaffold

```bash
mkdir -p packages/frontend-teacher/src/{app,routes,api}
mkdir -p packages/frontend-teacher/public/locales
```

### Step 5: Initialize frontend-teacher package.json

```json
{
  "name": "@logikids/frontend-teacher",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@logikids/ui": "workspace:*",
    "@tanstack/react-query": "^5.0.0",
    "@trpc/client": "^10.0.0",
    "@trpc/react-query": "^10.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "i18next": "^23.0.0",
    "react-i18next": "^13.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

### Step 6: Create minimal teacher app

**src/main.tsx:**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc, trpcClient } from './api/trpc'
import { router } from './routes'
import '@logikids/ui/styles'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
)
```

**src/routes/index.tsx:**

```typescript
import { createBrowserRouter } from 'react-router-dom'
import { Dashboard } from '../app/dashboard/Dashboard'
import { Login } from '../app/auth/Login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  // Placeholder routes for later phases
  {
    path: '/tasks',
    element: <div>Tasks - Coming in Phase 5</div>,
  },
  {
    path: '/tasks/create',
    element: <div>Create Task - Coming in Phase 5</div>,
  },
  {
    path: '/worksheets',
    element: <div>Worksheets - Coming in Phase 6</div>,
  },
])
```

**src/app/dashboard/Dashboard.tsx:**

```typescript
import { Card, Button } from '@logikids/ui'

export function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Teacher Dashboard</h1>
      <div className="dashboard-cards">
        <Card>
          <h2>Tasks</h2>
          <p>0 tasks in library</p>
          <Button href="/tasks/create">Create Task</Button>
        </Card>
        <Card>
          <h2>Worksheets</h2>
          <p>0 worksheets</p>
          <Button href="/worksheets">View Worksheets</Button>
        </Card>
      </div>
    </div>
  )
}
```

### Step 7: Set up tRPC client

Copy tRPC client setup from frontend-student, same backend URL.

**src/api/trpc.ts:**

```typescript
import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@logikids/backend/router'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc',
      headers: () => {
        const token = localStorage.getItem('accessToken')
        return token ? { Authorization: `Bearer ${token}` } : {}
      },
    }),
  ],
})
```

### Step 8: Update Docker Compose

Add frontend-teacher service:

```yaml
services:
  frontend-student-dev:
    build:
      context: .
      dockerfile: packages/frontend-student/Dockerfile.dev
    # ... existing config

  frontend-teacher-dev:
    build:
      context: .
      dockerfile: packages/frontend-teacher/Dockerfile.dev
    ports:
      - '5174:5173' # Different port
    volumes:
      - ./packages/frontend-teacher:/app/packages/frontend-teacher
      - ./packages/ui:/app/packages/ui
    environment:
      - VITE_API_URL=http://localhost:3000/trpc
```

## Deployment Considerations

Two separate apps = two deployment targets:

| App              | URL (example)       | Notes            |
| ---------------- | ------------------- | ---------------- |
| frontend-student | app.logikids.de     | Main student app |
| frontend-teacher | teacher.logikids.de | Teacher portal   |

Or single domain with path routing:

- `logikids.de/` → student app
- `logikids.de/teacher/` → teacher app

Decision deferred to deployment phase.

## Testing

1. Build ui package
2. Build frontend-student → verify no regressions
3. Build frontend-teacher → verify loads with placeholder pages
4. Run both in development → verify both connect to same backend
5. Login with teacher account in frontend-teacher → verify auth works

## Note

This phase creates the **shell only**. The actual teacher features (tasks, worksheets, PDF) are implemented in Phases 5-7 and will need detailed frontend implementation plans.
