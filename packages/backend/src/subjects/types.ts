import { z } from 'zod';
import { subjectsInputSchema } from './schemas';

export type SubjectsInput = z.infer<typeof subjectsInputSchema>;

export interface ConceptSummary {
  id: string;
  name: string;
  description: string;
  grade: number;
  difficulty: 'easy' | 'medium' | 'hard';
  source: string;
  focus: string;
  learning_objectives: string[];
}

export interface SubjectWithConcepts {
  id: string;
  name: string;
  description: string;
  conceptCount: number;
  minGrade?: number;
  maxGrade?: number;
  concepts: ConceptSummary[];
}

export interface SubjectsResponse {
  subjects: SubjectWithConcepts[];
}
