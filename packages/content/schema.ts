import { z } from 'zod'

// Re-export language types for backend compatibility
export { LANGUAGES, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type Language } from './languages'

/**
 * Schema for concept frontmatter metadata
 * This schema defines the structure of concept markdown files in /content/subjects/
 *
 * Referenced by: docs/concept-rules.md
 */
export const conceptFrontmatterSchema = z
  .object({
    id: z.string().min(1, 'Concept id is required'),
    name: z.string().min(1, 'Concept name is required'),
    description: z.string().min(1, 'Concept description is required'),
    grade: z.number().int().min(1).max(13),
    focus: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    learning_objectives: z.array(z.string()).min(3).max(7),
    // Task guidance fields
    problem_types: z.array(z.string()).min(5).max(10),
    difficulty_guidelines: z.object({
      easy: z.array(z.string()).min(1).max(3),
      medium: z.array(z.string()).min(1).max(3),
      hard: z.array(z.string()).min(1).max(3),
    }),
    // Required fields
    real_world_context: z.array(z.string().min(1)).min(10).max(15),
    version: z.number().int().positive(),
    // Optional fields
    prerequisites: z.array(z.string()).optional(),
    version_notes: z.string().optional(),
    // Required fields
    anti_patterns: z.array(z.string()).min(3).max(5),
  })
  .strict()

export type ConceptFrontmatter = z.infer<typeof conceptFrontmatterSchema>

/**
 * Concept with source tracking (used by backend when loading concepts)
 */
export interface Concept extends ConceptFrontmatter {
  prompt: string
  source: 'curriculum' | 'custom'
  sourceDirectory: string
}
