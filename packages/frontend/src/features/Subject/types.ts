export interface Concept {
  id: string;
  name: string;
  grade: number;
  difficulty: string;
  source: 'curriculum' | 'custom';
}

export interface Subject {
  id: string;
  name: string;
  concepts: Concept[];
}

// Default values for initial state
export const DEFAULT_SUBJECT = 'math';
export const DEFAULT_CONCEPT = 'random'; 