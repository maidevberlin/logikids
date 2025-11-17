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
  Concept,
} from './schemas';
import { createLogger } from '../common/logger';
import { PromptTemplateError, ValidationError } from '../common/errors';

const logger = createLogger('PromptLoader');

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
  private contentDir: string;
  private curriculumsDir: string;
  private basePromptCache: string | null = null;
  private variationsTemplateCache: string | null = null;

  constructor(
    promptsDir: string = path.join(process.cwd(), 'prompts'),
    contentDir: string = path.join(process.cwd(), '..', 'content')
  ) {
    this.promptsDir = promptsDir;
    this.contentDir = contentDir;
    this.curriculumsDir = path.join(contentDir, 'curriculums');
  }

  /**
   * Load base prompt (shared across all subjects)
   */
  async loadBasePrompt(): Promise<string> {
    // Check cache first
    if (this.basePromptCache) {
      return this.basePromptCache;
    }

    const basePath = path.join(this.promptsDir, 'base-prompt.md');
    try {
      const fileContent = await fs.readFile(basePath, 'utf-8');
      const parsed = matter(fileContent);
      this.basePromptCache = parsed.content.trim();
      return this.basePromptCache;
    } catch (error: any) {
      throw new PromptTemplateError(`Error loading base prompt from ${basePath}: ${error.message}`);
    }
  }

  /**
   * Load variations template (shared across all subjects)
   */
  async loadVariationsTemplate(): Promise<string> {
    // Check cache first
    if (this.variationsTemplateCache) {
      return this.variationsTemplateCache;
    }

    const variationsPath = path.join(this.promptsDir, 'variations.md');
    try {
      const fileContent = await fs.readFile(variationsPath, 'utf-8');
      const parsed = matter(fileContent);
      this.variationsTemplateCache = parsed.content.trim();
      return this.variationsTemplateCache;
    } catch (error: any) {
      throw new PromptTemplateError(`Error loading variations template from ${variationsPath}: ${error.message}`);
    }
  }

  /**
   * Load a subject and all its concepts from markdown files
   */
  async loadSubject(subjectId: string): Promise<Subject> {
    // Check cache first
    if (this.subjectCache.has(subjectId)) {
      return this.subjectCache.get(subjectId)!;
    }

    const subjectDir = path.join(this.contentDir, 'subjects', subjectId);

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
        ...conceptPrompt.metadata,
        prompt: conceptPrompt.content,
        source: 'custom' as const,
        sourceDirectory: subjectDir,
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
   * Load all concepts for a subject from both official (curriculum) and custom directories
   */
  async loadConcepts(subjectId: string): Promise<Concept[]> {
    const concepts: Concept[] = [];
    const subjectDir = path.join(this.contentDir, 'subjects', subjectId);

    // Load official (curriculum) concepts from subjects/{subject}/official/
    const officialPath = path.join(subjectDir, 'official');
    const officialConcepts = await this.loadConceptsFromDirectory(
      officialPath,
      'curriculum'
    );
    concepts.push(...officialConcepts);

    // Load custom concepts from subjects/{subject}/custom/
    const customPath = path.join(subjectDir, 'custom');
    const customConcepts = await this.loadConceptsFromDirectory(
      customPath,
      'custom'
    );
    concepts.push(...customConcepts);

    // Handle duplicates by appending "(Custom)" to custom version
    return this.deduplicateConcepts(concepts);
  }

  /**
   * Load concepts from a specific directory
   */
  private async loadConceptsFromDirectory(
    dirPath: string,
    source: 'curriculum' | 'custom',
    excludeFiles: string[] = []
  ): Promise<Concept[]> {
    const concepts: Concept[] = [];

    try {
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        if (excludeFiles.includes(file)) continue;

        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);

        if (!stat.isFile()) continue;

        try {
          const fileContent = await fs.readFile(filePath, 'utf-8');
          const parsed = matter(fileContent);

          const result = conceptFrontmatterSchema.safeParse(parsed.data);
          if (!result.success) {
            logger.warn(`Invalid concept frontmatter in ${filePath}`, { error: result.error.message });
            continue;
          }

          concepts.push({
            ...result.data,
            prompt: parsed.content.trim(),
            source,
            sourceDirectory: dirPath,
          });
        } catch (error) {
          logger.warn(`Error loading concept from ${filePath}`, error);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read - that's okay
      // Return empty array
    }

    return concepts;
  }

  /**
   * Handle duplicate concept names by appending "(Custom)" to custom versions
   */
  private deduplicateConcepts(concepts: Concept[]): Concept[] {
    const nameMap = new Map<string, Concept[]>();

    // Group concepts by name
    for (const concept of concepts) {
      const existing = nameMap.get(concept.name) || [];
      existing.push(concept);
      nameMap.set(concept.name, existing);
    }

    // Handle duplicates
    const deduplicated: Concept[] = [];

    for (const [_name, group] of nameMap.entries()) {
      if (group.length === 1) {
        deduplicated.push(group[0]);
      } else {
        // Multiple concepts with same name
        const curriculum = group.filter(c => c.source === 'curriculum');
        const custom = group.filter(c => c.source === 'custom');

        // Add curriculum versions as-is
        deduplicated.push(...curriculum);

        // Add custom versions with "(Custom)" suffix
        for (const concept of custom) {
          deduplicated.push({
            ...concept,
            name: `${concept.name} (Custom)`,
            id: `${concept.id}-custom`,
          });
        }
      }
    }

    return deduplicated;
  }

  /**
   * Enable hot-reload for development
   */
  enableHotReload(): void {
    if (this.watcher) return; // Already enabled

    // Watch both prompts (backend) and content (subjects) directories
    this.watcher = chokidar.watch(
      [
        `${this.promptsDir}/**/*.md`,
        `${this.contentDir}/**/*.md`
      ],
      {
        ignoreInitial: true,
        persistent: true,
      }
    );

    this.watcher.on('change', (filePath) => {
      logger.info('Prompt updated', { filePath });
      this.invalidateCache(filePath);
    });

    this.watcher.on('add', (filePath) => {
      logger.info('New prompt added', { filePath });
      this.invalidateCache(filePath);
    });

    this.watcher.on('unlink', (filePath) => {
      logger.info('Prompt deleted', { filePath });
      this.invalidateCache(filePath);
    });

    logger.info('Hot-reload enabled for prompts and content');
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

        throw new ValidationError(
          `Error loading prompt: ${filePath}\n${issues}\n\nPlease check the frontmatter format.`
        );
      }
      throw new PromptTemplateError(`Error reading file ${filePath}: ${error.message}`);
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
    // Check if it's the base prompt
    if (filePath.includes('base-prompt.md')) {
      this.basePromptCache = null;
      logger.debug('Cache invalidated for base prompt');
      return;
    }

    // Check if it's the variations template
    if (filePath.includes('variations.md')) {
      this.variationsTemplateCache = null;
      logger.debug('Cache invalidated for variations template');
      return;
    }

    // Determine if it's a subject, task type, or hint file
    if (filePath.includes('/subjects/')) {
      // Extract subject id from path
      const match = filePath.match(/\/subjects\/([^/]+)\//);
      if (match) {
        const subjectId = match[1];
        this.subjectCache.delete(subjectId);
        logger.debug('Cache invalidated for subject', { subjectId });
      }
    } else if (filePath.includes('/task-types/')) {
      // Extract task type id from filename
      const match = filePath.match(/\/task-types\/([^/]+)\.md$/);
      if (match) {
        const taskTypeId = match[1];
        this.taskTypeCache.delete(taskTypeId);
        logger.debug('Cache invalidated for task type', { taskTypeId });
      }
    } else if (filePath.includes('/hints/')) {
      // Invalidate hint prompt cache
      this.hintPromptCache = null;
      logger.debug('Cache invalidated for hint prompt');
    }
  }
}
