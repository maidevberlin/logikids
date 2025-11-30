import { z } from 'zod'
import { subjectsInputSchema } from './schemas'
import { Source } from '../concepts/types'

export type SubjectsInput = z.infer<typeof subjectsInputSchema>

export interface ConceptSummary {
  id: string
  name: string
  description: string
  grade: number
  difficulty: 'easy' | 'medium' | 'hard'
  source: Source
  focus: string
  learning_objectives: string[]
}

export interface SubjectWithConcepts {
  id: string
  name: string
  description: string
  conceptCount: number
  minGrade?: number
  maxGrade?: number
  concepts: ConceptSummary[]
}

export interface SubjectsResponse {
  subjects: SubjectWithConcepts[]
}
