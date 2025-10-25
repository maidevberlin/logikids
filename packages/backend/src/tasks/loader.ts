import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import chokidar, { FSWatcher } from 'chokidar';
import {
  conceptFrontmatterSchema,
  subjectFrontmatterSchema,
  taskTypeFrontmatterSchema,
  hintPromptFrontmatterSchema,
  ConceptFrontmatter,
  SubjectFrontmatter,
  TaskTypeFrontmatter,
  HintPromptFrontmatter,
} from './schemas';

export interface Concept {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  basePromptTemplate: string;
  concepts: Map<string, Concept>;
}

export interface TaskType {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

export interface HintPrompt {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

interface LoadedPrompt<T = any> {
  metadata: T;
  content: string;
}

export class PromptLoader {
  private subjectCache = new Map<string, Subject>();
  private taskTypeCache = new Map<string, TaskType>();
  private hintPromptCache: HintPrompt | null = null;
  private watcher: FSWatcher | null = null;
  private promptsDir: string;

  constructor(promptsDir: string = path.join(process.cwd(), 'prompts')) {
    this.promptsDir = promptsDir;
  }

  /**
   * Load a subject and all its concepts from markdown files
   */
  async loadSubject(subjectId: string): Promise<Subject> {
    // Check cache first
    if (this.subjectCache.has(subjectId)) {
      return this.subjectCache.get(subjectId)!;
    }

    const subjectDir = path.join(this.promptsDir, 'subjects', subjectId);

    // Load base.md
    const basePath = path.join(subjectDir, 'base.md');
    const basePrompt = await this.parsePromptFile<SubjectFrontmatter>(
      basePath,
      subjectFrontmatterSchema
    );

    // Load all concept files
    const conceptFiles = await this.getConceptFiles(subjectDir);
    const concepts = new Map<string, Concept>();

    for (const conceptFile of conceptFiles) {
      const conceptPath = path.join(subjectDir, conceptFile);
      const conceptPrompt = await this.parsePromptFile<ConceptFrontmatter>(
        conceptPath,
        conceptFrontmatterSchema
      );

      concepts.set(conceptPrompt.metadata.id, {
        id: conceptPrompt.metadata.id,
        name: conceptPrompt.metadata.name,
        description: conceptPrompt.metadata.description,
        promptTemplate: conceptPrompt.content,
      });
    }

    const subject: Subject = {
      id: basePrompt.metadata.id,
      name: basePrompt.metadata.name,
      description: basePrompt.metadata.description,
      basePromptTemplate: basePrompt.content,
      concepts,
    };

    // Cache the subject
    this.subjectCache.set(subjectId, subject);

    return subject;
  }

  /**
   * Load a task type from markdown file
   */
  async loadTaskType(taskTypeId: string): Promise<TaskType> {
    // Check cache first
    if (this.taskTypeCache.has(taskTypeId)) {
      return this.taskTypeCache.get(taskTypeId)!;
    }

    const taskTypePath = path.join(this.promptsDir, 'task-types', `${taskTypeId}.md`);
    const taskTypePrompt = await this.parsePromptFile<TaskTypeFrontmatter>(
      taskTypePath,
      taskTypeFrontmatterSchema
    );

    const taskType: TaskType = {
      id: taskTypePrompt.metadata.id,
      name: taskTypePrompt.metadata.name,
      description: taskTypePrompt.metadata.description,
      promptTemplate: taskTypePrompt.content,
    };

    // Cache the task type
    this.taskTypeCache.set(taskTypeId, taskType);

    return taskType;
  }

  /**
   * Load hint prompt from markdown file
   */
  async loadHintPrompt(): Promise<HintPrompt> {
    // Check cache first
    if (this.hintPromptCache) {
      return this.hintPromptCache;
    }

    const hintPromptPath = path.join(this.promptsDir, 'hints', 'base.md');
    const hintPromptData = await this.parsePromptFile<HintPromptFrontmatter>(
      hintPromptPath,
      hintPromptFrontmatterSchema
    );

    const hintPrompt: HintPrompt = {
      id: hintPromptData.metadata.id,
      name: hintPromptData.metadata.name,
      description: hintPromptData.metadata.description,
      promptTemplate: hintPromptData.content,
    };

    // Cache the hint prompt
    this.hintPromptCache = hintPrompt;

    return hintPrompt;
  }

  /**
   * Enable hot-reload for development
   */
  enableHotReload(): void {
    if (this.watcher) return; // Already enabled

    this.watcher = chokidar.watch(`${this.promptsDir}/**/*.md`, {
      ignoreInitial: true,
      persistent: true,
    });

    this.watcher.on('change', (filePath) => {
      console.log(`[PromptLoader] Prompt updated: ${filePath}`);
      this.invalidateCache(filePath);
    });

    this.watcher.on('add', (filePath) => {
      console.log(`[PromptLoader] New prompt added: ${filePath}`);
      this.invalidateCache(filePath);
    });

    this.watcher.on('unlink', (filePath) => {
      console.log(`[PromptLoader] Prompt deleted: ${filePath}`);
      this.invalidateCache(filePath);
    });

    console.log('[PromptLoader] Hot-reload enabled');
  }

  /**
   * Disable hot-reload and cleanup
   */
  destroy(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  /**
   * Parse markdown file with frontmatter and validate
   */
  private async parsePromptFile<T>(
    filePath: string,
    schema: any
  ): Promise<LoadedPrompt<T>> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const parsed = matter(fileContent);

      // Validate frontmatter with Zod
      const validatedMetadata = schema.parse(parsed.data);

      return {
        metadata: validatedMetadata,
        content: parsed.content.trim(),
      };
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const issues = error.issues.map((issue: any) =>
          `  - ${issue.path.join('.')}: ${issue.message}`
        ).join('\n');

        throw new Error(
          `Error loading prompt: ${filePath}\n${issues}\n\nPlease check the frontmatter format.`
        );
      }
      throw new Error(`Error reading file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Get all concept markdown files in a subject directory
   */
  private async getConceptFiles(subjectDir: string): Promise<string[]> {
    try {
      const files = await fs.readdir(subjectDir);
      return files.filter(
        (file) => file.endsWith('.md') && file !== 'base.md'
      );
    } catch (error) {
      return [];
    }
  }

  /**
   * Invalidate cache for a specific file path
   */
  private invalidateCache(filePath: string): void {
    // Determine if it's a subject, task type, or hint file
    if (filePath.includes('/subjects/')) {
      // Extract subject id from path
      const match = filePath.match(/\/subjects\/([^/]+)\//);
      if (match) {
        const subjectId = match[1];
        this.subjectCache.delete(subjectId);
        console.log(`[PromptLoader] Cache invalidated for subject: ${subjectId}`);
      }
    } else if (filePath.includes('/task-types/')) {
      // Extract task type id from filename
      const match = filePath.match(/\/task-types\/([^/]+)\.md$/);
      if (match) {
        const taskTypeId = match[1];
        this.taskTypeCache.delete(taskTypeId);
        console.log(`[PromptLoader] Cache invalidated for task type: ${taskTypeId}`);
      }
    } else if (filePath.includes('/hints/')) {
      // Invalidate hint prompt cache
      this.hintPromptCache = null;
      console.log(`[PromptLoader] Cache invalidated for hint prompt`);
    }
  }
}
