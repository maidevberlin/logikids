import { Concept } from "../../core/types";

export const mathConcepts: Record<string, Concept> = {
  arithmetic: {
    name: 'Basic Arithmetic',
    description: 'Fundamental operations with numbers including addition, subtraction, multiplication, and division',
    promptTemplate: `
Your task is to create a basic arithmetic problem that focuses on:
- Basic operations (addition, subtraction, multiplication, division)
- Clear step-by-step solution path
- Real-world applications when possible
    `
  },
  mental_math: {
    name: 'Mental Math',
    description: 'Quick calculations and number sense without writing',
    promptTemplate: `
Your task is to create a mental math problem that focuses on:
- Mental calculation strategies
- Number relationships and patterns
- Practical everyday scenarios
    `
  },
  word_problems: {
    name: 'Word Problems',
    description: 'Real-world problem solving using mathematical concepts',
    promptTemplate: `
Your task is to create a word problem that focuses on:
- Clear, engaging story context
- Step-by-step problem-solving approach
- Relatable real-world scenarios
    `
  },
  fractions: {
    name: 'Fractions & Decimals',
    description: 'Understanding and working with fractions, decimals, and percentages',
    promptTemplate: `
Your task is to create a fraction/decimal problem that focuses on:
- Understanding fractions, decimals, or percentages
- Operations with fractions/decimals
- Real-world applications when possible
    `
  },
  geometry: {
    name: 'Geometry',
    description: 'Geometric concepts including shapes, angles, and spatial reasoning',
    promptTemplate: `
Your task is to create a geometry problem that focuses on:
- Geometric shapes and their properties
- Spatial reasoning and visualization
- Visual thinking and problem-solving
- Real-world applications when possible
    `
  },
  measurement: {
    name: 'Measurement & Units',
    description: 'Working with different units of measurement and conversions',
    promptTemplate: `
Your task is to create a measurement problem that focuses on:
- Units of measurement (length, weight, time, etc.)
- Unit conversions
- Practical real-world scenarios
    `
  }
}; 