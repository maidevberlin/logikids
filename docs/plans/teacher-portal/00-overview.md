# Teacher Portal - Design Overview

## Summary

Add a "teacher" profile type to Logikids that enables educators to:

1. Create AI-generated tasks with manual overrides (task type, learning objective, context, language)
2. Save tasks to a personal library
3. Organize tasks into worksheets
4. Export worksheets as PDF (with configurable answer key)

## Key Decisions

| Area                   | Decision                                                 |
| ---------------------- | -------------------------------------------------------- |
| Teacher identification | Separate invite codes with `account_type` field          |
| Task storage           | Flat list + worksheets (many-to-many relationship)       |
| Task creation          | Single generate OR batch (3-5) then curate               |
| Override options       | Select from concept options OR enter custom text         |
| PDF answers            | Configurable: none / at end / separate PDF               |
| PDF header             | Optional: title, date, teacher name, class               |
| Sharing                | None - private libraries per teacher                     |
| Backend structure      | Unified, reorganized to `core/student/teacher`           |
| Frontend structure     | 3 packages: `ui`, `frontend-student`, `frontend-teacher` |
| PDF rendering          | Puppeteer (HTML + KaTeX to PDF, server-side)             |

## Phases

```
┌─────────────────────────────────────────────────────────────────┐
│  Phase 1: Backend Restructure (01-backend-restructure.md)       │
│  Move current code to core/student structure                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 2: Teacher Auth (02-teacher-auth.md)                     │
│  Add account_type to invite codes, teacherProcedure             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 3: UI Package (03-ui-package.md)                         │
│  Extract shared components to packages/ui                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 4: Frontend Split (04-frontend-split.md)                 │
│  Create frontend-student (moved) and frontend-teacher (shell)   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 5: Teacher Tasks (05-teacher-tasks.md)                   │
│  Task creation with overrides, save, list - backend + frontend  │
│  ⚠️  Needs detailed frontend plan before implementation         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 6: Worksheets (06-worksheets.md)                         │
│  Worksheet CRUD, add/remove/reorder tasks - backend + frontend  │
│  ⚠️  Needs detailed frontend plan before implementation         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 7: PDF Generation (07-pdf-generation.md)                 │
│  Puppeteer setup, HTML templates, download - backend + frontend │
│  ⚠️  Needs detailed frontend plan before implementation         │
└─────────────────────────────────────────────────────────────────┘
```

## Data Model

### Database Changes

```sql
-- Modify invite_codes
ALTER TABLE invite_codes ADD COLUMN account_type TEXT DEFAULT 'student';
ALTER TABLE invite_codes ADD COLUMN created_by TEXT;  -- Teacher who created the invite (for student invites)
-- Values for account_type: 'student' | 'teacher'

-- New: teacher_tasks
CREATE TABLE teacher_tasks (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  task_json JSONB NOT NULL,
  generation_params JSONB NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES user_accounts(user_id)
);

-- New: teacher_worksheets
CREATE TABLE teacher_worksheets (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  name TEXT NOT NULL,
  pdf_options JSONB DEFAULT '{}',
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES user_accounts(user_id)
);

-- New: worksheet_tasks (join table)
CREATE TABLE worksheet_tasks (
  worksheet_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  PRIMARY KEY (worksheet_id, task_id),
  FOREIGN KEY (worksheet_id) REFERENCES teacher_worksheets(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES teacher_tasks(id) ON DELETE CASCADE
);
```

### Type Definitions

```typescript
// generation_params stored with each task
interface GenerationParams {
  subject: string // Subject ID
  concept: string // Concept ID
  taskType: TaskType
  learningObjective: string // Selected or custom
  isCustomObjective: boolean
  realWorldContext: string // Selected or custom
  isCustomContext: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  grade: number
  language: string
}

// pdf_options stored with each worksheet
interface PdfOptions {
  includeAnswers: 'none' | 'end' | 'separate'
  header?: {
    title?: string
    date?: string
    teacherName?: string
    className?: string
  }
}
```

## Package Structure

### Backend (unified, reorganized)

```
packages/backend/src/
├── core/
│   ├── auth/           # Auth service, JWT, procedures
│   ├── ai/             # AI client, prompt building
│   ├── subjects/       # Subject registry, concept loading
│   ├── crypto/         # Encryption utilities (extracted from sync)
│   ├── database/       # DB connection
│   └── pdf/            # Puppeteer PDF generation
│
├── student/
│   ├── tasks/          # Task generation for students
│   ├── sync/           # User data sync (uses core/crypto)
│   ├── tts/            # Text-to-speech
│   └── router.ts
│
├── teacher/
│   ├── tasks/          # Task creation, overrides, library
│   ├── worksheets/     # Worksheet CRUD
│   ├── pdf/            # PDF generation endpoint
│   └── router.ts
│
└── router.ts           # { student, teacher, auth }
```

### Frontend (split into 3 packages)

```
packages/
├── ui/                     # Shared components (@logikids/ui)
│   ├── components/
│   ├── hooks/
│   └── styles/
│
├── frontend-student/       # Student app
│   └── src/app/...
│
├── frontend-teacher/       # Teacher app
│   └── src/app/
│       ├── tasks/          # Task creation, library
│       ├── worksheets/     # Worksheet management
│       └── auth/           # Teacher login
```

## Teacher App Routes

```
/                     → Dashboard
/tasks                → Task library (list, filter, delete)
/tasks/create         → Task creation form
/worksheets           → Worksheet list
/worksheets/:id       → Worksheet detail (tasks, reorder, PDF config)
/worksheets/:id/pdf   → PDF preview & download
```

## Open Questions

None currently - all major decisions made during brainstorming.

## Implementation Notes

- Phases 1-4 are infrastructure changes with clear scope
- Phases 5-7 include frontend work that needs detailed UI/UX planning before implementation
- Each phase should be independently deployable
- Backend restructure (Phase 1) is the largest refactor - plan for thorough testing
