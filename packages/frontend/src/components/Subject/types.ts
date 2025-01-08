export const SUBJECT_VALUES = ['math', 'logic'] as const

export type SubjectId = typeof SUBJECT_VALUES[number]

export type Concept = string;

export interface SubjectConfig {
  id: SubjectId
  concepts: Concept[];
}

export const subjects: Record<SubjectId, SubjectConfig> = {
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
      'sorting'
    ]
  }
}; 