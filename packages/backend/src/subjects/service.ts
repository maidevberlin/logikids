import 'reflect-metadata';
import { injectable } from 'tsyringe';
import { subjectRegistry } from './registry';
import type { SubjectsInput, SubjectWithConcepts, ConceptSummary } from './types';
import type { Source } from '../concepts/types';

@injectable()
export class SubjectsService {
  getAll(input: SubjectsInput): SubjectWithConcepts[] {
    const { grade, difficulty } = input;

    const subjects = subjectRegistry.getAll().map((subject) => {
      const metadata = subjectRegistry.getConceptMetadata(subject.id);

      // Get concepts (filtered or all)
      const concepts = grade !== undefined
        ? subjectRegistry.getConcepts(subject.id, { grade, difficulty })
        : subjectRegistry.getConcepts(subject.id);

      return {
        id: subject.id,
        name: subject.name,
        description: subject.description,
        conceptCount: metadata.conceptCount,
        minGrade: metadata.minGrade,
        maxGrade: metadata.maxGrade,
        concepts: concepts.map(this.mapConcept),
      };
    });

    // Filter out subjects with no concepts if grade filtering is active
    return grade !== undefined
      ? subjects.filter((s) => s.concepts.length > 0)
      : subjects;
  }

  private mapConcept(concept: {
    id: string;
    name: string;
    description: string;
    grade: number;
    difficulty: 'easy' | 'medium' | 'hard';
    source: Source;
    focus: string;
    learning_objectives: string[];
  }): ConceptSummary {
    return {
      id: concept.id,
      name: concept.name,
      description: concept.description,
      grade: concept.grade,
      difficulty: concept.difficulty,
      source: concept.source,
      focus: concept.focus,
      learning_objectives: concept.learning_objectives,
    };
  }
}
