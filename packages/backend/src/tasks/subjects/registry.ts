import * as fs from 'fs/promises';
import * as path from 'path';
import { PromptLoader, Subject, Concept } from '../loader';

/**
 * Registry for managing all available subjects
 */
export class SubjectRegistry {
  private subjects = new Map<string, Subject>();
  private loader: PromptLoader;
  private initialized = false;

  constructor(loader?: PromptLoader) {
    this.loader = loader || new PromptLoader();
  }

  /**
   * Initialize registry by loading all subjects from /prompts/subjects/
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('[SubjectRegistry] Already initialized');
      return;
    }

    const promptsDir = path.join(process.cwd(), 'prompts');
    const subjectsDir = path.join(promptsDir, 'subjects');

    try {
      // Get all subject directories
      const subjectDirs = await fs.readdir(subjectsDir, { withFileTypes: true });
      const subjectIds = subjectDirs
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      console.log(`[SubjectRegistry] Loading ${subjectIds.length} subjects...`);

      // Load each subject
      for (const subjectId of subjectIds) {
        try {
          const subject = await this.loader.loadSubject(subjectId);
          this.subjects.set(subject.id, subject);
          console.log(`[SubjectRegistry] Loaded subject: ${subject.id} (${subject.concepts.size} concepts)`);
        } catch (error: any) {
          console.error(`[SubjectRegistry] Failed to load subject ${subjectId}:`, error.message);
          throw error; // Fail fast on invalid prompts
        }
      }

      this.initialized = true;
      console.log(`[SubjectRegistry] Initialization complete: ${this.subjects.size} subjects loaded`);

      // Enable hot-reload in development
      if (process.env.NODE_ENV !== 'production') {
        this.loader.enableHotReload();
      }
    } catch (error: any) {
      throw new Error(`Failed to initialize SubjectRegistry: ${error.message}`);
    }
  }

  /**
   * Get a subject by its ID
   */
  get(id: string): Subject | undefined {
    return this.subjects.get(id);
  }

  /**
   * Get all registered subjects
   */
  getAll(): Subject[] {
    return Array.from(this.subjects.values());
  }

  /**
   * Get a random concept from a subject
   */
  getRandomConcept(subjectId: string): Concept | undefined {
    const subject = this.subjects.get(subjectId);
    if (!subject || subject.concepts.size === 0) {
      return undefined;
    }

    const conceptIds = Array.from(subject.concepts.keys());
    const randomId = conceptIds[Math.floor(Math.random() * conceptIds.length)];
    return subject.concepts.get(randomId);
  }

  /**
   * Get a specific concept from a subject
   */
  getConcept(subjectId: string, conceptId: string): Concept | undefined {
    const subject = this.subjects.get(subjectId);
    return subject?.concepts.get(conceptId);
  }
}

// Export singleton instance
export const subjectRegistry = new SubjectRegistry();
