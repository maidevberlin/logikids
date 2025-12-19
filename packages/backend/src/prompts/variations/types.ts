/**
 * Unified grade-filtered item (used for scenarios and all enrichments)
 */
export interface GradeFilteredItem {
  text?: string // For enrichments (text content)
  context?: string // For scenarios (context string)
  grade: [number, number] // [minGrade, maxGrade]
}

export type EnrichmentType = 'metacognitive' | 'structure'

export interface Enrichment {
  type: EnrichmentType
  value: string
}

/**
 * Raw item from YAML before validation
 */
export interface RawVariationItem {
  text?: string
  context?: string
  grade?: [number, number]
}
