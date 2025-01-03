import { Subject } from '@logikids/backend/tasks/types';

export interface Concept {
  displayName: string;
}

export interface SubjectConfig {
  concepts: Record<string, Concept>;
}

export const subjects: Record<Subject, SubjectConfig> = {
  math: {
    concepts: {
      algebra: { displayName: 'Algebra' },
      geometry: { displayName: 'Geometry' },
      fractions: { displayName: 'Fractions and Decimals' },
      measurement: { displayName: 'Measurement' },
      word_problems: { displayName: 'Word Problems' },
      data_analysis: { displayName: 'Data Analysis' },
      probability: { displayName: 'Probability' },
      mental_math: { displayName: 'Mental Math' }
    }
  },
  logic: {
    concepts: {
      sequential: { displayName: 'Sequential Reasoning' },
      categorical: { displayName: 'Categorical Logic' },
      conditional: { displayName: 'Conditional Logic' },
      deductive: { displayName: 'Deductive Reasoning' }
    }
  }
}; 