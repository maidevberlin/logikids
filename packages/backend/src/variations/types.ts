/**
 * Type definitions for task variation system
 */

export interface Scenario {
  context: string;
  minGrade: number;
  maxGrade: number;
}

/**
 * Unified age-filtered item (used for scenarios and all enrichments)
 */
export interface AgeFilteredItem {
  text?: string;      // For enrichments (text content)
  context?: string;   // For scenarios (context string)
  age: [number, number];  // [minAge, maxAge]
}

export type EnrichmentType =
  | 'framing'
  | 'character'
  | 'temporal'
  | 'metacognitive'
  | 'mystery'
  | 'realWorld'
  | 'emotional'
  | 'structure';

export interface Enrichment {
  type: EnrichmentType;
  value: string;
}

/**
 * Raw variation data loaded from YAML files
 */
export interface VariationData {
  scenarios?: AgeFilteredItem[];
  framings?: AgeFilteredItem[];
  dynamics?: AgeFilteredItem[];
  contexts?: AgeFilteredItem[];
  prompts?: AgeFilteredItem[];
  connections?: AgeFilteredItem[];
  framings_emotional?: AgeFilteredItem[];  // For emotional-framings.md
  structures?: AgeFilteredItem[];
}

/**
 * Variations injected into task prompt
 */
export interface TaskVariations {
  scenario?: string;
  languageStyle?: string;
  studentGender?: string;
  enrichmentInstruction?: string;
}
