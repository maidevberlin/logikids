import { z } from 'zod';

/**
 * Schema for concept frontmatter metadata
 * Referenced by: .claude/docs/concept-rules.md
 */
export const conceptFrontmatterSchema = z.object({
  id: z.string().min(1, 'Concept id is required'),
  name: z.string().min(1, 'Concept name is required'),
  description: z.string().min(1, 'Concept description is required'),
  grade: z.number().int().min(1).max(13),
  ages: z.tuple([z.number().int().min(6).max(18), z.number().int().min(6).max(18)])
    .refine(([min, max]) => min <= max, {
      message: 'ages[0] (min) must be <= ages[1] (max)'
    }),
  focus: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  learning_objectives: z.array(z.string()).min(3).max(7),
  // Task guidance fields
  problem_types: z.array(z.string()).min(5).max(10),
  age_guidelines: z.record(
    z.coerce.number().int().min(6).max(18),
    z.array(z.string()).min(1)
  ),
  difficulty_guidelines: z.object({
    easy: z.array(z.string()).min(1),
    medium: z.array(z.string()).min(1),
    hard: z.array(z.string()).min(1),
  }),
  // Required fields
  real_world_context: z.array(z.string().min(1)).min(3).max(5),
  version: z.number().int().positive(),
  // Optional fields
  prerequisites: z.array(z.string()).optional(),
  anti_patterns: z.array(z.string().max(80)).min(1).max(3).optional(),
  version_notes: z.string().optional(),
}).strict();

export type ConceptFrontmatter = z.infer<typeof conceptFrontmatterSchema>;

/**
 * Concept with source tracking
 */
export interface Concept extends ConceptFrontmatter {
  prompt: string;
  source: 'curriculum' | 'custom';
  sourceDirectory: string;
}
