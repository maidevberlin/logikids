import { Subject } from './base';
import * as subjects from '.';

export class SubjectRegistry {
  private static instance: SubjectRegistry;
  private subjects: Map<string, Subject> = new Map();

  private constructor() {
    // Register all subjects from the import
    Object.values(subjects).forEach(subject => {
      if (this.isSubject(subject)) {
        this.subjects.set(subject.id, subject);
      }
    });
  }

  public static getInstance(): SubjectRegistry {
    if (!SubjectRegistry.instance) {
      SubjectRegistry.instance = new SubjectRegistry();
    }
    return SubjectRegistry.instance;
  }

  private isSubject(obj: any): obj is Subject {
    return obj && 
           typeof obj.id === 'string' &&
           typeof obj.name === 'string' &&
           typeof obj.description === 'string' &&
           typeof obj.basePromptTemplate === 'string' &&
           typeof obj.concepts === 'object' &&
           typeof obj.getRandomConcept === 'function' &&
           typeof obj.getConcept === 'function';
  }

  public get(id: string): Subject | undefined {
    return this.subjects.get(id);
  }

  public getAll(): Subject[] {
    return Array.from(this.subjects.values());
  }
}

// Create and export the singleton instance
export const registry = SubjectRegistry.getInstance(); 