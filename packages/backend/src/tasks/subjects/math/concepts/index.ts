import { Concept } from '../../../core/types';

export const mathConcepts: Record<string, Concept> = {
  arithmetic: {
    displayName: 'Arithmetic Operations',
    description: 'Basic arithmetic operations including addition, subtraction, multiplication, and division',
    promptTemplate: `
Your task is to create an arithmetic problem that focuses on:
- Basic operations (addition, subtraction, multiplication, division)
- Numbers appropriate for age {{age}}
- {{difficulty}} difficulty level
- Clear step-by-step solution path
    `
  },
  geometry: {
    displayName: 'Geometry',
    description: 'Geometric concepts including shapes, angles, and spatial reasoning',
    promptTemplate: `
Your task is to create a geometry problem that focuses on:
- Geometric shapes and their properties
- Spatial reasoning appropriate for age {{age}}
- {{difficulty}} difficulty level
- Visual thinking and problem-solving
    `
  },
  // Add more concepts here...
}; 