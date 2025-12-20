# Phase 6: Worksheets

## Goal

Enable teachers to organize saved tasks into named worksheets, reorder tasks within worksheets, and configure PDF export options.

**Note:** This phase includes frontend work that needs detailed UI/UX planning before implementation.

## Prerequisites

- Phase 5 (Teacher Tasks) completed

## Database

Tables created in overview, implemented here:

```sql
-- Worksheets table
CREATE TABLE teacher_worksheets (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  name TEXT NOT NULL,
  pdf_options JSONB DEFAULT '{}',
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES user_accounts(user_id)
);

CREATE INDEX idx_teacher_worksheets_teacher_id ON teacher_worksheets(teacher_id);

-- Join table for many-to-many relationship
CREATE TABLE worksheet_tasks (
  worksheet_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  PRIMARY KEY (worksheet_id, task_id),
  FOREIGN KEY (worksheet_id) REFERENCES teacher_worksheets(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES teacher_tasks(id) ON DELETE CASCADE
);

CREATE INDEX idx_worksheet_tasks_worksheet_id ON worksheet_tasks(worksheet_id);
CREATE INDEX idx_worksheet_tasks_task_id ON worksheet_tasks(task_id);
```

## Backend Implementation

### Module Structure

```
packages/backend/src/teacher/worksheets/
├── router.ts
├── controller.ts
├── service.ts
├── schemas.ts
└── types.ts
```

### Types

**types.ts:**

```typescript
export interface PdfOptions {
  includeAnswers: 'none' | 'end' | 'separate'
  header?: {
    title?: string
    date?: string
    teacherName?: string
    className?: string
  }
}

export interface Worksheet {
  id: string
  teacherId: string
  name: string
  pdfOptions: PdfOptions
  createdAt: number
  updatedAt: number
}

export interface WorksheetWithTasks extends Worksheet {
  tasks: Array<{
    taskId: string
    position: number
    task: TeacherTask
  }>
}

export interface WorksheetSummary {
  id: string
  name: string
  taskCount: number
  createdAt: number
  updatedAt: number
}
```

### Schemas

**schemas.ts:**

```typescript
import { z } from 'zod'

export const pdfOptionsSchema = z.object({
  includeAnswers: z.enum(['none', 'end', 'separate']).default('end'),
  header: z
    .object({
      title: z.string().optional(),
      date: z.string().optional(),
      teacherName: z.string().optional(),
      className: z.string().optional(),
    })
    .optional(),
})

export const createWorksheetSchema = z.object({
  name: z.string().min(1).max(100),
  pdfOptions: pdfOptionsSchema.optional(),
})

export const updateWorksheetSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  pdfOptions: pdfOptionsSchema.optional(),
})

export const addTasksSchema = z.object({
  worksheetId: z.string(),
  taskIds: z.array(z.string()).min(1),
})

export const removeTasksSchema = z.object({
  worksheetId: z.string(),
  taskIds: z.array(z.string()).min(1),
})

export const reorderTasksSchema = z.object({
  worksheetId: z.string(),
  taskOrder: z.array(
    z.object({
      taskId: z.string(),
      position: z.number().min(0),
    })
  ),
})
```

### Router

**router.ts:**

```typescript
import { router, teacherProcedure } from '../../trpc'
import { z } from 'zod'
import {
  createWorksheetSchema,
  updateWorksheetSchema,
  addTasksSchema,
  removeTasksSchema,
  reorderTasksSchema,
} from './schemas'

export const worksheetsRouter = router({
  // Create new worksheet
  create: teacherProcedure.input(createWorksheetSchema).mutation(async ({ ctx, input }) => {
    return ctx.worksheetsController.create(ctx.userId, input)
  }),

  // List all worksheets (summary only)
  list: teacherProcedure.query(async ({ ctx }) => {
    return ctx.worksheetsController.list(ctx.userId)
  }),

  // Get worksheet with all tasks
  get: teacherProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.worksheetsController.get(ctx.userId, input.id)
  }),

  // Update worksheet name or options
  update: teacherProcedure.input(updateWorksheetSchema).mutation(async ({ ctx, input }) => {
    return ctx.worksheetsController.update(ctx.userId, input)
  }),

  // Delete worksheet (tasks remain in library)
  delete: teacherProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.worksheetsController.delete(ctx.userId, input.id)
  }),

  // Add tasks to worksheet
  addTasks: teacherProcedure.input(addTasksSchema).mutation(async ({ ctx, input }) => {
    return ctx.worksheetsController.addTasks(ctx.userId, input)
  }),

  // Remove tasks from worksheet
  removeTasks: teacherProcedure.input(removeTasksSchema).mutation(async ({ ctx, input }) => {
    return ctx.worksheetsController.removeTasks(ctx.userId, input)
  }),

  // Reorder tasks in worksheet
  reorderTasks: teacherProcedure.input(reorderTasksSchema).mutation(async ({ ctx, input }) => {
    return ctx.worksheetsController.reorderTasks(ctx.userId, input)
  }),
})
```

### Service

**service.ts (key methods):**

```typescript
@injectable()
export class WorksheetsService {
  constructor(@inject(TYPES.Database) private db: Database) {}

  async create(teacherId: string, input: CreateWorksheetInput): Promise<Worksheet> {
    const id = crypto.randomUUID()
    const now = Date.now()

    await this.db.query(
      `
      INSERT INTO teacher_worksheets (id, teacher_id, name, pdf_options, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
      [id, teacherId, input.name, input.pdfOptions || {}, now, now]
    )

    return {
      id,
      teacherId,
      name: input.name,
      pdfOptions: input.pdfOptions || {},
      createdAt: now,
      updatedAt: now,
    }
  }

  async list(teacherId: string): Promise<WorksheetSummary[]> {
    const result = await this.db.query(
      `
      SELECT w.id, w.name, w.created_at, w.updated_at,
             COUNT(wt.task_id) as task_count
      FROM teacher_worksheets w
      LEFT JOIN worksheet_tasks wt ON w.id = wt.worksheet_id
      WHERE w.teacher_id = $1
      GROUP BY w.id
      ORDER BY w.updated_at DESC
    `,
      [teacherId]
    )

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      taskCount: parseInt(row.task_count),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  }

  async get(teacherId: string, worksheetId: string): Promise<WorksheetWithTasks> {
    // Get worksheet
    const worksheetResult = await this.db.query(
      `
      SELECT * FROM teacher_worksheets WHERE id = $1 AND teacher_id = $2
    `,
      [worksheetId, teacherId]
    )

    if (worksheetResult.rows.length === 0) {
      throw notFound('Worksheet not found')
    }

    // Get tasks with positions
    const tasksResult = await this.db.query(
      `
      SELECT wt.position, t.*
      FROM worksheet_tasks wt
      JOIN teacher_tasks t ON wt.task_id = t.id
      WHERE wt.worksheet_id = $1
      ORDER BY wt.position ASC
    `,
      [worksheetId]
    )

    return {
      ...this.mapWorksheet(worksheetResult.rows[0]),
      tasks: tasksResult.rows.map((row) => ({
        taskId: row.id,
        position: row.position,
        task: this.mapTask(row),
      })),
    }
  }

  async addTasks(teacherId: string, input: AddTasksInput): Promise<void> {
    // Verify worksheet belongs to teacher
    await this.verifyOwnership(teacherId, input.worksheetId)

    // Get current max position
    const maxResult = await this.db.query(
      `
      SELECT COALESCE(MAX(position), -1) as max_pos
      FROM worksheet_tasks WHERE worksheet_id = $1
    `,
      [input.worksheetId]
    )
    let position = maxResult.rows[0].max_pos + 1

    // Insert tasks at end
    for (const taskId of input.taskIds) {
      await this.db.query(
        `
        INSERT INTO worksheet_tasks (worksheet_id, task_id, position)
        VALUES ($1, $2, $3)
        ON CONFLICT (worksheet_id, task_id) DO NOTHING
      `,
        [input.worksheetId, taskId, position++]
      )
    }

    // Update worksheet timestamp
    await this.touchWorksheet(input.worksheetId)
  }

  async reorderTasks(teacherId: string, input: ReorderTasksInput): Promise<void> {
    await this.verifyOwnership(teacherId, input.worksheetId)

    // Update all positions in transaction
    await this.db.transaction(async (tx) => {
      for (const { taskId, position } of input.taskOrder) {
        await tx.query(
          `
          UPDATE worksheet_tasks
          SET position = $1
          WHERE worksheet_id = $2 AND task_id = $3
        `,
          [position, input.worksheetId, taskId]
        )
      }
    })

    await this.touchWorksheet(input.worksheetId)
  }
}
```

## Frontend Implementation

### Routes

```
/worksheets           → WorksheetList (list, create, delete)
/worksheets/:id       → WorksheetDetail (view tasks, reorder, config)
```

### Components (high-level)

**WorksheetList:**

1. "Create Worksheet" button → modal with name input
2. List of worksheet cards showing:
   - Name
   - Task count
   - Last updated
3. Actions: open, delete

**WorksheetDetail:**

1. Header: worksheet name (editable), back button
2. Task list with drag-and-drop reordering
   - Each task shows preview (question, type, subject)
   - Remove button per task
3. "Add Tasks" button → modal with task library picker (multi-select)
4. PDF Options panel:
   - Include answers: radio buttons (none / at end / separate)
   - Header toggle + fields (title, date, name, class)
5. "Generate PDF" button → triggers PDF generation (Phase 7)

**TaskPicker (modal):**

1. Shows task library with filters
2. Checkboxes for multi-select
3. Already-in-worksheet tasks visually marked
4. "Add Selected" button

### Drag and Drop

Use a library like `@dnd-kit/core` for accessible drag-and-drop:

```typescript
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function TaskList({ tasks, onReorder }) {
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks.map(task => <SortableTask key={task.id} task={task} />)}
      </SortableContext>
    </DndContext>
  )
}
```

### API Calls

```typescript
// Create worksheet
const { mutate: createWorksheet } = trpc.teacher.worksheets.create.useMutation()

// List worksheets
const { data: worksheets } = trpc.teacher.worksheets.list.useQuery()

// Get worksheet with tasks
const { data: worksheet } = trpc.teacher.worksheets.get.useQuery({ id })

// Add tasks
const { mutate: addTasks } = trpc.teacher.worksheets.addTasks.useMutation()

// Reorder tasks
const { mutate: reorderTasks } = trpc.teacher.worksheets.reorderTasks.useMutation()
```

## Testing

### Backend

1. Create worksheet → verify stored
2. List worksheets → verify counts correct
3. Get worksheet → verify tasks in order
4. Add tasks → verify positions assigned
5. Reorder tasks → verify new order persisted
6. Remove tasks → verify removed from worksheet (not from library)
7. Delete worksheet → verify tasks remain in library

### Frontend

1. Create worksheet → appears in list
2. Open worksheet → tasks displayed in order
3. Drag task → reorder persists after refresh
4. Add tasks → appear at end
5. Remove task → removed from worksheet
6. Delete worksheet → tasks still in library

## Open Questions for Detailed Planning

- Empty state design (no worksheets, no tasks in worksheet)
- Task preview format in worksheet view
- Confirmation dialog for delete actions
- Optimistic updates for drag-and-drop
- Mobile drag-and-drop alternative (up/down buttons?)
