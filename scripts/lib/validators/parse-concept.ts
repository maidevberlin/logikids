/**
 * Parse and validate a concept file
 */

import { readFileSync } from 'fs'
import matter from 'gray-matter'
import type { ConceptFrontmatter } from '../../../content/schema'
import type { SchemaCheckResult } from '../types'
import { checkSchema } from './schema'

export interface ParsedConcept {
  frontmatter: ConceptFrontmatter
  content: string
  schemaResult: SchemaCheckResult<ConceptFrontmatter>
}

export type ParseConceptResult =
  | { success: true; parsed: ParsedConcept }
  | { success: false; schemaResult: SchemaCheckResult<ConceptFrontmatter> }

export function parseAndValidateConcept(filePath: string): ParseConceptResult {
  const fileContent = readFileSync(filePath, 'utf-8')
  const { data: frontmatter, content } = matter(fileContent)

  const schemaResult = checkSchema(frontmatter)

  if (schemaResult.status === 'fail') {
    return { success: false, schemaResult }
  }

  return {
    success: true,
    parsed: {
      frontmatter: schemaResult.data!,
      content,
      schemaResult,
    },
  }
}
