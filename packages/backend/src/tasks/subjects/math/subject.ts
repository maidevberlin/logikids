import { mathConcepts } from './concepts';
import { basePrompt } from '../../prompts/math/math.prompt';
import { MathConceptId, Subject, SUBJECTS } from '../types';

export const mathSubject: Subject<MathConceptId> = {
  id: SUBJECTS.math.id,
  name: 'Math',
  description: 'Mathematical concepts and problem solving',
  concepts: mathConcepts,
  basePromptTemplate: basePrompt
}; 