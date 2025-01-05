# Task Generation System Refactoring Proposal

## Domain Model

1. **Task Type**
   - Defines HOW a task is presented and answered
   - Has its own specific response format
   - Examples: multiple-choice, yes/no, text-input
   - Defines the structure of the response JSON

2. **Subject + Concept**
   - Defines WHAT the task is about
   - Subject (e.g., math, logic)
   - Concept within subject (e.g., arithmetic, patterns)

3. **Task Parameters**
   - Common parameters for all tasks
   - language: string
   - age: number
   - difficulty: 'easy' | 'medium' | 'hard'

## Current Issues

1. **Task Type Handling**
   - Task types are not part of the request schema
   - No clear separation between task type response formats
   - Missing support for different task types
   - No random task type selection

2. **Type Safety Issues**
   - The `Subject` type in types.ts is incorrectly defined
   - Response types are not tied to task types
   - Inconsistent type imports between modules

3. **Prompt Building Complexity**
   - No clear separation between task type and subject prompts
   - Template processing scattered across components
   - Unclear prompt composition order

4. **Inconsistent Structure**
   - Subject and task type definitions scattered
   - No clear organization for different response types
   - Duplicate template processing

## Proposed Changes

### 1. Type System Cleanup

```typescript
// types.ts
export type SubjectId = 'math' | 'logic';
export type TaskTypeId = 'multiple_choice' | 'yes_no' | 'text_input';
export type Difficulty = 'easy' | 'medium' | 'hard';

// Base interfaces
export interface Subject {
  id: SubjectId;
  name: string;
  description: string;
  concepts: Record<string, Concept>;
  basePromptTemplate: string;
}

export interface Concept {
  name: string;
  description: string;
  promptTemplate: string;
}

// Task Type specific interfaces
export interface TaskType<T extends TaskResponse = TaskResponse> {
  id: TaskTypeId;
  name: string;
  description: string;
  promptTemplate: string;
  validateResponse: (response: unknown) => response is T;
}

// Response types
export interface TaskResponse {
  title: string;
  task: string;
  hints: string[];
}

export interface MultipleChoiceResponse extends TaskResponse {
  options: string[];
  solution: {
    index: number;
    explanation: string;
  };
}

export interface YesNoResponse extends TaskResponse {
  solution: {
    answer: boolean;
    explanation: string;
  };
}

export interface TextInputResponse extends TaskResponse {
  solution: {
    answer: string;
    acceptableAnswers?: string[];
    explanation: string;
  };
}

// Request schema
export const taskRequestSchema = z.object({
  subject: z.enum(['math', 'logic']),
  concept: z.string(),
  taskType: z.enum(['multiple_choice', 'yes_no', 'text_input']).optional(),
  age: z.number().min(5).max(18),
  difficulty: z.enum(['easy', 'medium', 'hard'])
});

export type TaskRequest = z.infer<typeof taskRequestSchema>;
```

### 2. Task Type Registry

```typescript
// taskTypes/registry.ts
export class TaskTypeRegistry {
  private static instance: TaskTypeRegistry;
  private taskTypes: Map<TaskTypeId, TaskType> = new Map();

  static getInstance(): TaskTypeRegistry {
    if (!TaskTypeRegistry.instance) {
      TaskTypeRegistry.instance = new TaskTypeRegistry();
    }
    return TaskTypeRegistry.instance;
  }

  register<T extends TaskResponse>(taskType: TaskType<T>) {
    this.taskTypes.set(taskType.id, taskType);
  }

  get(id: TaskTypeId): TaskType | undefined {
    return this.taskTypes.get(id);
  }

  getRandomTaskType(): TaskType {
    const types = Array.from(this.taskTypes.values());
    return types[Math.floor(Math.random() * types.length)];
  }
}
```

### 3. Restructured Prompt Building

```typescript
// prompt-builder.ts
export class PromptBuilder {
  constructor(
    private subject: Subject,
    private taskType: TaskType
  ) {}

  buildPrompt(params: TaskGenerationParams): string {
    const concept = this.getConceptOrRandom(params.concept);
    const variables = this.buildTemplateVariables(params, concept);
    
    // First build the concept-specific prompt
    const conceptPrompt = TemplateProcessor.process(
      concept.promptTemplate,
      variables
    );

    // Then build the task type prompt
    const taskTypePrompt = TemplateProcessor.process(
      this.taskType.promptTemplate,
      variables
    );

    // Finally, combine everything in the subject base template
    return TemplateProcessor.process(
      this.subject.basePromptTemplate,
      {
        ...variables,
        concept_template: conceptPrompt,
        task_type_template: taskTypePrompt
      }
    );
  }
}
```

### 4. Simplified Task Service

```typescript
// task.service.ts
export class TaskService {
  constructor(
    private readonly aiClient: AIClient,
    private readonly subjects: Record<SubjectId, Subject>,
    private readonly taskTypeRegistry: TaskTypeRegistry
  ) {}

  async generateTask(request: TaskRequest, language: string): Promise<TaskResponse> {
    const subject = this.subjects[request.subject];
    if (!subject) {
      throw new Error(`Subject ${request.subject} not found`);
    }

    const taskType = request.taskType 
      ? this.taskTypeRegistry.get(request.taskType)
      : this.taskTypeRegistry.getRandomTaskType();

    if (!taskType) {
      throw new Error(`Task type ${request.taskType} not found`);
    }

    const promptBuilder = new PromptBuilder(subject, taskType);
    const prompt = promptBuilder.buildPrompt({
      ...request,
      language
    });

    const response = await this.aiClient.generate(prompt);
    const parsedResponse = this.parseResponse(response);

    if (!taskType.validateResponse(parsedResponse)) {
      throw new Error(`Invalid response format for task type ${taskType.id}`);
    }

    return parsedResponse;
  }
}
```

### 5. Unified Directory Structure

```
/tasks
  /core
    types.ts           # Core type definitions
    registry.ts        # Task type registry
    prompt-builder.ts  # Prompt building logic
  /subjects
    /math
      index.ts        # Math exports
      subject.ts      # Math subject definition
      concepts.ts     # Math concepts
    /logic
      index.ts        # Logic exports
      subject.ts      # Logic subject definition
      concepts.ts     # Logic concepts
  /taskTypes
    /multipleChoice
      index.ts        # Multiple choice exports
      type.ts         # Type definition and validation
      template.ts     # Prompt template
    /yesNo
      index.ts        # Yes/No exports
      type.ts         # Type definition and validation
      template.ts     # Prompt template
    /textInput
      index.ts        # Text input exports
      type.ts         # Type definition and validation
      template.ts     # Prompt template
```

## Implementation Plan

1. **Phase 1: Task Type System**
   - Implement task type interfaces and registry
   - Add response type validation
   - Update request schema

2. **Phase 2: Response Types**
   - Define response interfaces for each task type
   - Implement validation functions
   - Add type guards and assertions

3. **Phase 3: Prompt Building**
   - Update prompt builder for task types
   - Implement template composition
   - Add tests for each task type

4. **Phase 4: Subject Integration**
   - Update subject definitions
   - Integrate with task types
   - Add tests for combinations

5. **Phase 5: Testing & Documentation**
   - Add comprehensive tests
   - Update documentation
   - Add examples for each task type

## Benefits

1. **Type Safety**
   - Response types tied to task types
   - Proper validation at runtime
   - Better IDE support

2. **Extensibility**
   - Easy to add new task types
   - Clear structure for new subjects
   - Modular template system

3. **Maintainability**
   - Clear separation of concerns
   - Type-safe response handling
   - Consistent structure

## Risks and Mitigation

1. **Breaking Changes**
   - Maintain compatibility layer
   - Gradual migration path
   - Comprehensive testing

2. **Complexity**
   - Clear documentation
   - Type safety helps catch errors
   - Good test coverage

3. **Performance**
   - Lazy loading of templates
   - Cache compiled templates
   - Benchmark critical paths 