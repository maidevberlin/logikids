import { Concept, BaseSubject } from './base';

class PhysicsSubject extends BaseSubject {
  public readonly id = 'physics';
  public readonly name = 'Physics';
  public readonly description = 'Learn about the fundamental laws that govern our universe';
  
  public readonly basePromptTemplate = `
## CRITICAL REQUIREMENTS
1. CONTENT APPROPRIATENESS
   A. Language Requirements
      - ALL content MUST be in {{language}}
      - Use clear, simple explanations
      - Avoid complex scientific terminology unless necessary
      - Break down complex concepts into digestible parts

   B. Age Requirements ({{age}} years)
      - Adjust complexity based on age
      - Use age-appropriate examples from daily life
      - Focus on observable phenomena
      - Include visual elements when possible

   C. Difficulty Level ({{difficulty}})
      - Adapt mathematical complexity appropriately
      - Scale conceptual depth based on difficulty
      - Maintain engagement while challenging

## Your Role
You are an expert physics teacher, developing tasks for students of age {{age}}. 
Your goal is to make physics concepts accessible and engaging through practical examples and interactive problems.

## Concept to focus on when creating the task
{{concept_template}}

## Task Requirements
{{task_type_template}}

## Final Verification Checklist
1. Age-appropriate language and concepts ✓
2. Clear connection to real-world applications ✓
3. Scientifically accurate but simplified appropriately ✓
4. Engaging and interactive elements included ✓
5. Safety considerations addressed if relevant ✓
6. Mathematical complexity matches difficulty level ✓`;

  public readonly concepts: Record<string, Concept> = {
    mechanics: {
      id: 'mechanics',
      name: 'Mechanics',
      description: 'Study of motion, forces, and energy in everyday situations',
      promptTemplate: `
Focus on creating a mechanics problem that:
- Uses basic principles of motion, forces, or energy
- Is appropriate for age {{age}} students
- Connects to everyday experiences and observations
- Uses simple machines or familiar objects
- Encourages systematic problem-solving
- Builds intuition about physical laws
- Includes visual elements when possible
- Relates to activities students can safely try
- Uses age-appropriate mathematical concepts
- Promotes understanding of cause and effect`
    },
    waves: {
      id: 'waves',
      name: 'Waves',
      description: 'Explore sound, light, and wave phenomena in our world',
      promptTemplate: `
Focus on creating a waves problem that:
- Explores sound, light, or wave phenomena
- Is appropriate for age {{age}} students
- Uses familiar examples like music or water waves
- Demonstrates wave properties clearly
- Builds understanding of wave behavior
- Includes hands-on demonstrations when possible
- Uses visual representations effectively
- Connects to everyday experiences
- Promotes pattern recognition
- Makes abstract concepts tangible`
    },
    matter: {
      id: 'matter',
      name: 'Matter',
      description: 'Discover the properties and behavior of different materials',
      promptTemplate: `
Focus on creating a matter problem that:
- Explores properties and behavior of materials
- Is appropriate for age {{age}} students
- Uses common materials and substances
- Demonstrates states of matter
- Builds understanding of material properties
- Includes safe, observable experiments
- Uses everyday examples
- Promotes scientific observation skills
- Connects to student experiences
- Encourages prediction and testing`
    }
  };
}

// Export a singleton instance
export const physicsSubject = new PhysicsSubject(); 