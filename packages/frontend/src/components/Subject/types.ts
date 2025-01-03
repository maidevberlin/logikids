import { Subject } from '@logikids/backend/tasks/types';

export interface Concept {
  displayName: string;
}

export interface SubjectConfig {
  concepts: Record<string, Concept>;
}

export type { Subject }; 