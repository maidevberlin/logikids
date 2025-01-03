import { Subject } from '@logikids/backend/tasks/types';
import { Concept } from '../../Subject/subjects';

export interface ConceptSelectorProps {
  subject: Subject;
  value: Concept | 'random';
  onChange: (value: Concept | 'random') => void;
  className?: string;
} 