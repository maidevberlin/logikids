import * as fs from 'fs/promises';
import * as path from 'path';
import { PromptLoader, Subject } from '../prompts/loader';
import { Concept } from '../prompts/schemas';

/**
 * Registry for managing all available subjects
 */
export class SubjectRegistry {
  private subjects = new Map<string, Subject>();
  private concepts = new Map<string, Map<string, Concept>>(); // subjectId -> conceptId -> Concept
  private loader: PromptLoader;
  private initialized = false;

  constructor(loader?: PromptLoader) {
    this.loader = loader || new PromptLoader();
  }

  /**
   * Initialize registry by loading all subjects from packages/content/subjects/
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('[SubjectRegistry] Already initialized');
      return;
    }

    const contentDir = path.join(process.cwd(), '..', 'content');
    const subjectsDir = path.join(contentDir, 'subjects');

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

          // Load concepts from both official and custom directories
          const concepts = await this.loader.loadConcepts(subjectId);
          const conceptMap = new Map<string, Concept>();
          for (const concept of concepts) {
            conceptMap.set(concept.id, concept);
          }
          this.concepts.set(subjectId, conceptMap);

          console.log(`[SubjectRegistry] Loaded subject: ${subject.id} (${concepts.length} concepts)`);
        } catch (error: any) {
          console.error(`[SubjectRegistry] Failed to load subject ${subjectId}:`, error.message);
          throw error; // Fail fast on invalid prompts
        }
      }

      this.initialized = true;
      console.log(`[SubjectRegistry] Initialization complete: ${this.subjects.size} subjects loaded`);

      // Enable hot-reload in development (watches both backend prompts and content directories)
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
   * Get all concepts for a subject, optionally filtered by grade, age, and difficulty
   */
  getConcepts(
    subjectId: string,
    options?: {
      grade?: number;
      age?: number;
      difficulty?: 'easy' | 'medium' | 'hard';
    }
  ): Concept[] {
    const conceptMap = this.concepts.get(subjectId);
    if (!conceptMap) return [];

    let concepts = Array.from(conceptMap.values());

    // Filter by grade
    if (options?.grade !== undefined) {
      concepts = concepts.filter(c => c.grade === options.grade);
    }

    // Filter by age (check if age is within [min, max] range)
    if (options?.age !== undefined) {
      concepts = concepts.filter(c => {
        const [minAge, maxAge] = c.ages;
        return options.age! >= minAge && options.age! <= maxAge;
      });
    }

    // Filter by difficulty
    if (options?.difficulty) {
      concepts = concepts.filter(c => c.difficulty === options.difficulty);
    }

    return concepts;
  }

  /**
   * Get a single concept by ID
   */
  getConcept(subjectId: string, conceptId: string): Concept | undefined {
    const conceptMap = this.concepts.get(subjectId);
    if (!conceptMap) return undefined;
    return conceptMap.get(conceptId);
  }

  /**
   * Get a random concept from a subject, optionally filtered by grade, age, and difficulty
   * If grade filter returns no results, falls back to age filter
   */
  getRandomConcept(
    subjectId: string,
    options?: {
      grade?: number;
      age?: number;
      difficulty?: 'easy' | 'medium' | 'hard';
    }
  ): Concept | undefined {
    const conceptMap = this.concepts.get(subjectId);
    if (!conceptMap || conceptMap.size === 0) {
      return undefined;
    }

    // Try grade filter first
    let filteredConcepts = this.getConcepts(subjectId, options);

    // If no results with grade, try with age only
    if (filteredConcepts.length === 0 && options?.grade !== undefined && options?.age !== undefined) {
      filteredConcepts = this.getConcepts(subjectId, {
        age: options.age,
        difficulty: options.difficulty
      });
    }

    // If still no results, return undefined
    if (filteredConcepts.length === 0) {
      return undefined;
    }

    // Pick random from filtered results
    const randomIndex = Math.floor(Math.random() * filteredConcepts.length);
    return filteredConcepts[randomIndex];
  }

  /**
   * Get metadata about a subject's concepts (min/max grade, min/max age, concept count)
   */
  getConceptMetadata(subjectId: string): {
    conceptCount: number;
    minGrade?: number;
    maxGrade?: number;
    minAge?: number;
    maxAge?: number;
  } {
    const conceptMap = this.concepts.get(subjectId);
    if (!conceptMap || conceptMap.size === 0) {
      return { conceptCount: 0 };
    }

    const concepts = Array.from(conceptMap.values());
    const grades = concepts.map(c => c.grade).filter(g => g !== undefined);
    const ages = concepts.flatMap(c => c.ages);

    return {
      conceptCount: concepts.length,
      minGrade: grades.length > 0 ? Math.min(...grades) : undefined,
      maxGrade: grades.length > 0 ? Math.max(...grades) : undefined,
      minAge: ages.length > 0 ? Math.min(...ages) : undefined,
      maxAge: ages.length > 0 ? Math.max(...ages) : undefined,
    };
  }
}

// Export singleton instance
export const subjectRegistry = new SubjectRegistry();
