import { SubjectId, Concept } from '../../Subject';

export interface ConceptSelectorProps {
  subject: SubjectId;
  value: Concept | 'random';
  onChange: (value: Concept | 'random') => void;
  className?: string;
} 