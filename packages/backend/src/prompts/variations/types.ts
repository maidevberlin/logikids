/**
 * Unified age-filtered item (used for scenarios and all enrichments)
 */
export interface AgeFilteredItem {
  text?: string // For enrichments (text content)
  context?: string // For scenarios (context string)
  age: [number, number] // [minAge, maxAge]
}

export type EnrichmentType =
  | 'framing'
  | 'character'
  | 'temporal'
  | 'metacognitive'
  | 'mystery'
  | 'realWorld'
  | 'emotional'
  | 'structure'

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
  age?: [number, number]
}
