import { z } from 'zod';
import {JSONSchema} from '../common/ai/base.ts';

/**
 * Schema for concept frontmatter metadata
 */
export const conceptFrontmatterSchema = z.object({
  id: z.string().min(1, 'Concept id is required'),
  name: z.string().min(1, 'Concept name is required'),
  description: z.string().min(1, 'Concept description is required'),
});

export type ConceptFrontmatter = z.infer<typeof conceptFrontmatterSchema>;

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
