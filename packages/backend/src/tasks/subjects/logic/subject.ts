import { logicConcepts } from './concepts';
import { basePrompt } from '../../prompts/logic/logic.prompt';
import { LogicConceptId, Subject, SUBJECTS } from '../types';

export const logicSubject: Subject<LogicConceptId> = {
  id: SUBJECTS.logic.id,
  name: 'Logic',
  description: 'Logical thinking and problem solving',
  concepts: logicConcepts,
  basePromptTemplate: basePrompt
}; 