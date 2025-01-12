export interface Concept {
  id: string;
  name: string;
  description: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  concepts: Concept[];
}

// Default values for initial state
export const DEFAULT_SUBJECT = 'math';
export const DEFAULT_CONCEPT = 'random'; 