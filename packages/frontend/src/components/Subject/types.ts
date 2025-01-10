export const SUBJECT_VALUES = ['math', 'logic', 'music', 'physics'] as const

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
}; 