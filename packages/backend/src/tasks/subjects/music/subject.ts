import { musicConcepts } from './concepts';
import { basePrompt } from '../../prompts/music/music.prompt';
import { MusicConceptId, Subject, SUBJECTS } from '../types';

export const musicSubject: Subject<MusicConceptId> = {
  id: SUBJECTS.music.id,
  name: 'Music',
  description: 'Musical concepts and understanding',
  concepts: musicConcepts,
  basePromptTemplate: basePrompt
}; 