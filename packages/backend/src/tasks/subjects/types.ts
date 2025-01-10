import { z } from 'zod';

// Subject Definitions
export const SUBJECTS = {
  math: {
    id: 'math',
    concepts: [
      'arithmetic',
      'mental_math',
      'word_problems',
      'fractions',
      'geometry',
      'measurement'
    ]
  },
  logic: {
    id: 'logic',
    concepts: [
      'patterns',
      'conditional',
      'sorting',
      'sequences',
      'analogical',
      'deductive'
    ]
  },
  music: {
    id: 'music',
    concepts: [
      'rhythm',
      'melody'
    ]
  },
  physics: {
    id: 'physics',
    concepts: [
      'mechanics',
      'waves',
      'matter'
    ]
  }
} as const;

// Subject Types
export type SubjectId = keyof typeof SUBJECTS;
export type MathConceptId = typeof SUBJECTS.math.concepts[number];
export type LogicConceptId = typeof SUBJECTS.logic.concepts[number];
export type MusicConceptId = typeof SUBJECTS.music.concepts[number];
export type PhysicsConceptId = typeof SUBJECTS.physics.concepts[number];
export type ConceptId = MathConceptId | LogicConceptId | MusicConceptId | PhysicsConceptId;

// Helper type to get concepts for a specific subject
export type SubjectConcepts<S extends SubjectId> = typeof SUBJECTS[S]['concepts'][number];

// Subject and concept interfaces
export interface Concept {
  id: ConceptId;
  name: string;
  description: string;
  promptTemplate: string;
}

export interface Subject<C extends ConceptId = ConceptId> {
  id: SubjectId;
  name: string;
  description: string;
  concepts: Record<C, Concept>;
  basePromptTemplate: string;
}

// Type mapping for subjects
export type SubjectsMap = {
  math: Subject<MathConceptId>;
  logic: Subject<LogicConceptId>;
  music: Subject<MusicConceptId>;
  physics: Subject<PhysicsConceptId>;
};

// Validation schemas
export const getConceptSchema = (subject: SubjectId) => {
  return z.union([
    z.literal('random'),
    z.enum(SUBJECTS[subject].concepts)
  ]);
}; 