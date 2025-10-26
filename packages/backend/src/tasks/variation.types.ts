/**
 * Type definitions for task variation system
 */

export interface Scenario {
  context: string;
  minAge: number;
  maxAge: number;
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
  scenarios?: Scenario[];
  framings?: string[];
  dynamics?: string[];
  contexts?: string[];
  prompts?: string[];
  connections?: string[];
  structures?: string[];
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
