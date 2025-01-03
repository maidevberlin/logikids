import { Subject } from '@logikids/backend/tasks/types';

export type Concept = string;

export interface SubjectConfig {
  concepts: Concept[];
}

export const subjects: Record<Subject, SubjectConfig> = {
  math: {
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
    concepts: [
      'patterns',
      'conditional',
      'sorting'
    ]
  }
}; 