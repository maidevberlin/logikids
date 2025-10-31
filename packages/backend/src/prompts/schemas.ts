import { z } from 'zod';
import {JSONSchema} from '../common/ai/base.ts';

/**
 * Schema for concept frontmatter metadata
 */
export const conceptFrontmatterSchema = z.object({
  id: z.string().min(1, 'Concept id is required'),
  name: z.string().min(1, 'Concept name is required'),
  description: z.string().min(1, 'Concept description is required'),
  // New required fields
  grade: z.number().int().min(1).max(13),
  ages: z.tuple([z.number().int().min(6).max(18), z.number().int().min(6).max(18)])
    .refine(([min, max]) => min <= max, {
      message: 'ages[0] (min) must be <= ages[1] (max)'
    }),
  focus: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  learning_objectives: z.array(z.string()).min(1),
  // Optional fields
  prerequisites: z.array(z.string()).optional(),
  example_tasks: z.array(z.string()).optional(),
  real_world_context: z.string().optional(),
});

export type ConceptFrontmatter = z.infer<typeof conceptFrontmatterSchema>;

/**
 * Concept with source tracking
 */
export interface Concept extends ConceptFrontmatter {
  prompt: string;
  source: 'curriculum' | 'custom';
  sourceDirectory: string;
}

/**
 * Schema for subject base.md frontmatter metadata
 */
export const subjectFrontmatterSchema = z.object({
  id: z.string().min(1, 'Subject id is required'),
  name: z.string().min(1, 'Subject name is required'),
  description: z.string().min(1, 'Subject description is required'),
});

export type SubjectFrontmatter = z.infer<typeof subjectFrontmatterSchema>;

/**
 * Schema for task type frontmatter metadata
 */
export const taskTypeFrontmatterSchema = z.object({
  id: z.string().min(1, 'Task type id is required'),
  name: z.string().min(1, 'Task type name is required'),
  description: z.string().min(1, 'Task type description is required'),
});

export type TaskTypeFrontmatter = z.infer<typeof taskTypeFrontmatterSchema>;

/**
 * Schema for hint prompt frontmatter metadata
 */
export const hintPromptFrontmatterSchema = z.object({
  id: z.string().min(1, 'Hint prompt id is required'),
  name: z.string().min(1, 'Hint prompt name is required'),
  description: z.string().min(1, 'Hint prompt description is required'),
});

export type HintPromptFrontmatter = z.infer<typeof hintPromptFrontmatterSchema>;

export const hintSchema: JSONSchema = {
  type: 'object',
  properties: {
    hint: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['hint'],
  additionalProperties: false
};
