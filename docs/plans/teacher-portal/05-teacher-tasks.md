# Phase 5: Teacher Tasks

## Goal

Enable teachers to create AI-generated tasks with manual overrides, save them to a personal library, and manage their collection.

**Note:** This phase includes frontend work that needs detailed UI/UX planning before implementation.

## Prerequisites

- Phase 2 (Teacher Auth) completed
- Phase 4 (Frontend Split) completed

## Database

Table created in overview, implemented here:

```sql
CREATE TABLE teacher_tasks (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  task_json JSONB NOT NULL,
  generation_params JSONB NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES user_accounts(user_id)
);

CREATE INDEX idx_teacher_tasks_teacher_id ON teacher_tasks(teacher_id);
CREATE INDEX idx_teacher_tasks_created_at ON teacher_tasks(created_at);
```

## Backend Implementation

### Module Structure

```
packages/backend/src/teacher/tasks/
├── router.ts
├── controller.ts
├── service.ts
├── schemas.ts
└── types.ts
```

### Types

**types.ts:**

```typescript
import type { TaskResponse, TaskType } from '../../core/ai/types'

export interface GenerationParams {
  subject: string
  concept: string
  taskType: TaskType
  learningObjective: string
  isCustomObjective: boolean
  realWorldContext: string
  isCustomContext: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  grade: number
  language: string
}

export interface TeacherTask {
  id: string
  teacherId: string
  taskJson: TaskResponse
  generationParams: GenerationParams
  createdAt: number
  updatedAt: number
}

export interface GenerateTaskInput {
  subject: string
  concept: string
  taskType: TaskType
  learningObjective: string // From concept list OR custom text
  isCustomObjective: boolean
  realWorldContext: string // From concept list OR custom text
  isCustomContext: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  grade: number
  language: string
}
```

### Schemas

**schemas.ts:**

```typescript
import { z } from 'zod'

export const generateTaskInputSchema = z.object({
  subject: z.string().min(1),
  concept: z.string().min(1),
  taskType: z.enum([
    'singleChoice',
    'multiSelect',
    'fillInBlank',
    'ordering',
    'numberInput',
    'yesNo',
  ]),
  learningObjective: z.string().min(1),
  isCustomObjective: z.boolean(),
  realWorldContext: z.string().min(1),
  isCustomContext: z.boolean(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  grade: z.number().min(1).max(13),
  language: z.string().min(2).max(5),
})

export const saveTaskInputSchema = z.object({
  taskJson: z.record(z.unknown()), // Validated by task type schemas in service
  generationParams: generateTaskInputSchema,
})

export const listTasksInputSchema = z.object({
  subject: z.string().optional(),
  concept: z.string().optional(),
  taskType: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
})
```

### Router

**router.ts:**

```typescript
import { router, teacherProcedure } from '../../trpc'
import { generateTaskInputSchema, saveTaskInputSchema, listTasksInputSchema } from './schemas'
import { z } from 'zod'

export const teacherTasksRouter = router({
  // Generate single task (not saved)
  generate: teacherProcedure.input(generateTaskInputSchema).mutation(async ({ ctx, input }) => {
    return ctx.teacherTasksController.generate(input)
  }),

  // Generate batch of 3-5 tasks (not saved)
  generateBatch: teacherProcedure
    .input(
      generateTaskInputSchema.extend({
        count: z.number().min(3).max(5).default(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.teacherTasksController.generateBatch(input)
    }),

  // Save a generated task to library
  save: teacherProcedure.input(saveTaskInputSchema).mutation(async ({ ctx, input }) => {
    return ctx.teacherTasksController.save(ctx.userId, input)
  }),

  // List saved tasks
  list: teacherProcedure.input(listTasksInputSchema).query(async ({ ctx, input }) => {
    return ctx.teacherTasksController.list(ctx.userId, input)
  }),

  // Get single task
  get: teacherProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.teacherTasksController.get(ctx.userId, input.id)
  }),

  // Delete task
  delete: teacherProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.teacherTasksController.delete(ctx.userId, input.id)
  }),

  // Get concept details (for override dropdowns)
  getConceptDetails: teacherProcedure
    .input(z.object({ subject: z.string(), concept: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.teacherTasksController.getConceptDetails(input)
    }),
})
```

### Service

**service.ts (key methods):**

```typescript
@injectable()
export class TeacherTasksService {
  constructor(
    @inject(TYPES.AIClient) private aiClient: AIClient,
    @inject(TYPES.PromptService) private promptService: PromptService,
    @inject(TYPES.SubjectRegistry) private subjectRegistry: SubjectRegistry,
    @inject(TYPES.Database) private db: Database
  ) {}

  async generate(input: GenerateTaskInput): Promise<TaskResponse> {
    // Load concept
    const concept = await this.subjectRegistry.getConcept(input.subject, input.concept)

    // Build prompt with overrides (not random selection)
    const prompt = await this.promptService.buildPromptWithOverrides({
      concept,
      taskType: input.taskType,
      learningObjective: input.learningObjective,
      realWorldContext: input.realWorldContext,
      difficulty: input.difficulty,
      grade: input.grade,
      language: input.language,
    })

    // Generate task
    const task = await this.aiClient.generateTask(prompt, input.taskType)
    return task
  }

  async generateBatch(input: GenerateTaskInput & { count: number }): Promise<TaskResponse[]> {
    // Generate multiple tasks in parallel
    const promises = Array(input.count)
      .fill(null)
      .map(() => this.generate(input))
    return Promise.all(promises)
  }

  async save(teacherId: string, input: SaveTaskInput): Promise<TeacherTask> {
    const id = crypto.randomUUID()
    const now = Date.now()

    await this.db.query(
      `
      INSERT INTO teacher_tasks (id, teacher_id, task_json, generation_params, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
      [id, teacherId, input.taskJson, input.generationParams, now, now]
    )

    return { id, teacherId, ...input, createdAt: now, updatedAt: now }
  }

  async getConceptDetails(subject: string, concept: string) {
    const conceptData = await this.subjectRegistry.getConcept(subject, concept)
    return {
      learningObjectives: conceptData.learning_objectives,
      realWorldContexts: conceptData.real_world_context,
      problemTypes: conceptData.problem_types,
    }
  }
}
```

### Prompt Service Extension

Add method to `core/ai/prompts/service.ts`:

```typescript
async buildPromptWithOverrides(params: {
  concept: Concept
  taskType: TaskType
  learningObjective: string    // Direct value, not random
  realWorldContext: string     // Direct value, not random
  difficulty: Difficulty
  grade: number
  language: string
}): Promise<string> {
  // Similar to existing buildPrompt but uses provided values
  // instead of randomChoice() for objective and context
}
```

## Frontend Implementation

### Routes

```
/tasks                → TaskLibrary (list, filter, delete)
/tasks/create         → TaskCreator (form, generate, preview, save)
```

### Components (high-level)

**TaskCreator:**

1. Subject/Concept selector (cascading dropdowns)
2. Override form:
   - Task type: radio buttons or select
   - Learning objective: select (from concept) + "Custom" option with text input
   - Real-world context: select (from concept) + "Custom" option with text input
   - Difficulty: radio buttons
   - Grade: number input or select
   - Language: select
3. Generate buttons: "Generate 1" / "Generate 5"
4. Preview area: shows generated task(s)
5. Save button(s): save selected task(s) to library

**TaskLibrary:**

1. Filter bar: subject, concept, task type, search
2. Task list: cards showing task preview, metadata
3. Actions: view, delete, add to worksheet
4. Pagination

### API Calls

```typescript
// Generate single task
const { mutate: generateTask } = trpc.teacher.tasks.generate.useMutation()

// Generate batch
const { mutate: generateBatch } = trpc.teacher.tasks.generateBatch.useMutation()

// Save task
const { mutate: saveTask } = trpc.teacher.tasks.save.useMutation()

// List tasks
const { data: tasks } = trpc.teacher.tasks.list.useQuery({ limit: 50 })

// Get concept details for override dropdowns
const { data: conceptDetails } = trpc.teacher.tasks.getConceptDetails.useQuery({
  subject: selectedSubject,
  concept: selectedConcept,
})
```

## Testing

### Backend

1. Generate task with overrides → verify objective/context match input
2. Generate batch → verify all tasks generated
3. Save task → verify stored in DB
4. List tasks → verify only teacher's tasks returned
5. Delete task → verify removed (and cascades from worksheets)
6. Get concept details → verify returns correct arrays

### Frontend

1. Select subject/concept → dropdowns populate correctly
2. Select custom objective → text input appears
3. Generate single → task preview shows
4. Generate batch → 5 task previews show
5. Save task → appears in library
6. Filter library → correct tasks shown
7. Delete task → removed from list

## Open Questions for Detailed Planning

- Task card design in library (how much to show in preview?)
- Mobile responsiveness for task creator form
- Loading states during AI generation
- Error handling for failed generations
- Keyboard navigation for form
