/**
 * Parse and validate a concept file
 * Combines file reading, gray-matter parsing, and schema validation
 */

import { readFileSync } from 'fs';
import matter from 'gray-matter';
import type { ConceptFrontmatter } from '../../../prompts/schemas';
import type { SchemaCheckResult } from '../types';
import { checkSchema } from './schema';

export interface ParsedConcept {
  frontmatter: ConceptFrontmatter;
  content: string;
  schemaResult: SchemaCheckResult<ConceptFrontmatter>;
}

export type ParseConceptResult =
  | { success: true; parsed: ParsedConcept }
  | { success: false; schemaResult: SchemaCheckResult<ConceptFrontmatter> };

/**
 * Parse a concept file and validate its frontmatter schema
 * @param filePath - Absolute path to the concept file
 * @returns Parsed concept data if valid, or schema error result if invalid
 */
export function parseAndValidateConcept(filePath: string): ParseConceptResult {
  const fileContent = readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  const schemaResult = checkSchema(frontmatter);

  if (schemaResult.status === 'fail') {
    return { success: false, schemaResult };
  }

  return {
    success: true,
    parsed: {
      frontmatter: schemaResult.data!,
      content,
      schemaResult,
    },
  };
}
