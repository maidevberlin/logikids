import { prompt as arithmeticPrompt } from '../../prompts/math/concepts/arithmetic';
import { prompt as mentalMathPrompt } from '../../prompts/math/concepts/mental_math';
import { prompt as wordProblemsPrompt } from '../../prompts/math/concepts/word_problems';
import { prompt as fractionsPrompt } from '../../prompts/math/concepts/fractions';
import { prompt as geometryPrompt } from '../../prompts/math/concepts/geometry';
import { prompt as measurementPrompt } from '../../prompts/math/concepts/measurement';
import { Concept, MathConceptId } from '../types';

export const mathConcepts: Record<MathConceptId, Concept> = {
  arithmetic: {
    id: 'arithmetic',
    name: 'Basic Arithmetic',
    description: 'Fundamental operations with numbers including addition, subtraction, multiplication, and division',
    promptTemplate: arithmeticPrompt
  },

  mental_math: {
    id: 'mental_math',
    name: 'Mental Math',
    description: 'Quick calculations and number sense without writing',
    promptTemplate: mentalMathPrompt
  },

  word_problems: {
    id: 'word_problems',
    name: 'Word Problems',
    description: 'Real-world problem solving using mathematical concepts',
    promptTemplate: wordProblemsPrompt
  },

  fractions: {
    id: 'fractions',
    name: 'Fractions & Decimals',
    description: 'Understanding and working with fractions, decimals, and percentages',
    promptTemplate: fractionsPrompt
  },

  geometry: {
    id: 'geometry',
    name: 'Geometry',
    description: 'Geometric concepts including shapes, angles, and spatial reasoning',
    promptTemplate: geometryPrompt
  },

  measurement: {
    id: 'measurement',
    name: 'Measurement & Units',
    description: 'Working with different units of measurement and conversions',
    promptTemplate: measurementPrompt
  }
}; 