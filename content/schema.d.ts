import { z } from 'zod';
/**
 * Schema for concept frontmatter metadata
 * This schema defines the structure of concept markdown files in /content/subjects/
 *
 * Referenced by: docs/concept-rules.md
 */
export declare const conceptFrontmatterSchema: any;
export type ConceptFrontmatter = z.infer<typeof conceptFrontmatterSchema>;
/**
 * Concept with source tracking (used by backend when loading concepts)
 */
export interface Concept extends ConceptFrontmatter {
    prompt: string;
    source: 'curriculum' | 'custom';
    sourceDirectory: string;
}
