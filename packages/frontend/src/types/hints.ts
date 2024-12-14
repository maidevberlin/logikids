export type HintType = 'conceptual' | 'procedural' | 'strategic'

export interface HintResponse {
  hint: string
  metadata: {
    type?: HintType
  }
} 