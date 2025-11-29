import { z } from 'zod';
import { difficultyEnum, sourceEnum, conceptsInputSchema } from './schemas';

export type Difficulty = z.infer<typeof difficultyEnum>;
export type Source = z.infer<typeof sourceEnum>;
export type ConceptsInput = z.infer<typeof conceptsInputSchema>;

export interface ConceptFilters {
  grade?: number;
  difficulty?: Difficulty;
  source?: Source;
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  grade: number;
  focus: string;
  difficulty: Difficulty;
  source: Source;
  learning_objectives: string[];
  prerequisites?: string[];
}

export interface ConceptsResponse {
  concepts: Concept[];
  total: number;
}
