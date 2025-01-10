import { Subject, PhysicsConceptId } from '../types';
import { basePrompt } from '../../prompts/physics/physics.prompt';
import { wavesPrompt } from '../../prompts/physics/concepts/waves';
import { matterPrompt } from '../../prompts/physics/concepts/matter';
import { mechanicsPrompt } from '../../prompts/physics/concepts/mechanics';

export const physicsSubject: Subject<PhysicsConceptId> = {
  id: 'physics',
  name: 'Physics',
  description: 'Learn about the fundamental laws that govern our universe through mechanics, waves, and matter.',
  basePromptTemplate: basePrompt,
  concepts: {
    mechanics: {
      id: 'mechanics',
      name: 'Mechanics',
      description: 'Study motion, forces, and energy in everyday situations.',
      promptTemplate: mechanicsPrompt,
    },
    waves: {
      id: 'waves',
      name: 'Waves',
      description: 'Explore sound, light, and wave phenomena in our world.',
      promptTemplate: wavesPrompt,
    },
    matter: {
      id: 'matter',
      name: 'Matter',
      description: 'Discover the properties and behavior of different materials.',
      promptTemplate: matterPrompt,
    },
  },
}; 