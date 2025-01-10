import { prompt as rhythmPrompt } from '../../prompts/music/concepts/rhythm';
import { prompt as melodyPrompt } from '../../prompts/music/concepts/melody';
import { Concept, MusicConceptId } from '../types';

export const musicConcepts: Record<MusicConceptId, Concept> = {
  rhythm: {
    id: 'rhythm',
    name: 'Rhythm Recognition',
    description: 'Understanding and identifying different rhythmic patterns in music',
    promptTemplate: rhythmPrompt
  },

  melody: {
    id: 'melody',
    name: 'Melody Patterns',
    description: 'Recognizing and understanding melodic sequences and patterns',
    promptTemplate: melodyPrompt
  }
}; 