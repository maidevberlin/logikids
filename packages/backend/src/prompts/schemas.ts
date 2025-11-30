import { z } from 'zod';
import {JSONSchema} from '../common/ai/base';

// Re-export concept schema from dedicated file
export { conceptFrontmatterSchema, type ConceptFrontmatter, type Concept } from './concept-schema';

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
